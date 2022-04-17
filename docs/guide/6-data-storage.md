# Data storage

In the previous section we started implementing our business logic in a Lambda function, butwhat's a CRUD application without data storage? So our next task is tackling how we are going to store the classified ads that our users create via the chatbot. Our database of choice is going to be Amazon DynamoDB.

## Introducing Amazon DynamoDB

Amazon DynamoDB is a fully managed, serverless, key-value NoSQL database. It is designed to run high-peformance applications at any scale.

### Terraform: DyanamoDB

Create a new file `dynamodb.tf` in the root of your project and add the following:

```hcl
resource "aws_dynamodb_table" "classifieds" {
  name           = "Classifieds"
  read_capacity  = 20
  write_capacity = 20
  # Controls how you are charged for read
  # and write throughput and how you manage capacity.
  billing_mode = "PROVISIONED"
  hash_key     = "PostId"

  attribute {
    name = "PostId"
    type = "S"
  }
}
```

We have declared a DynamoDB table named `Classifieds`. We will use provisioned billing mode, so need read and write capacity specified ahead of time. Our hash key is going to be the post identifier `PostId`. Since this is a NoSQL database we don't necessarily have to specify additional attributes like `PostTitle` and `PostDescription`.

You can run `terraform plan` to see what will be provisioned. You should see output similar to below.

```hcl
Terraform used the selected providers to generate the following execution plan. Resource actions are
indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_dynamodb_table.classifieds will be created
  + resource "aws_dynamodb_table" "classifieds" {
      + arn              = (known after apply)
      + billing_mode     = "PROVISIONED"
      + hash_key         = "PostId"
      + id               = (known after apply)
      + name             = "Classifieds"
      + read_capacity    = 20
      + stream_arn       = (known after apply)
      + stream_label     = (known after apply)
      + stream_view_type = (known after apply)
      + tags_all         = (known after apply)
      + write_capacity   = 20

      + attribute {
          + name = "PostId"
          + type = "S"
        }

      + point_in_time_recovery {
          + enabled = (known after apply)
        }

      + server_side_encryption {
          + enabled     = (known after apply)
          + kms_key_arn = (known after apply)
        }

      + ttl {
          + attribute_name = (known after apply)
          + enabled        = (known after apply)
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy
```

We don't have to provision the table just yet. Let's work on implementing our Lex intents one by one.

### CreatePost

```js
'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Classifieds'
const CREATE_POST_INTENT = 'CreatePost'

// Payload that we construct from intent slots
var payload = {}

// Close dialog with the user, reporting fulfillmentState of Failed or Fulfilled
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

// --------------- Intents -----------------------
async function createPost(intentRequest, context, callback) {
    const slots = intentRequest.currentIntent.slots;
    const title = slots.PostTitle;
    const description = slots.PostDescription;

    payload = {
        PostId: context.awsRequestId,
        // we will update this to a real userId once we implement Cognito
        UserId: `${intentRequest.userId}`,
        PostTitle: title,
        PostDescription: description
    };
    await dynamodb
        .put({
            TableName: TABLE_NAME,
            Item: payload
        })
        .promise();
}

// --------------- Events -----------------------
function dispatch(intentRequest, context, callback) {
    const intentName = intentRequest.currentIntent.name;
    // ...

    switch (intentName) {
        case CREATE_POST_INTENT:
            createPost(intentRequest, context)
            break;
        default:
            throw new Error(`Intent with name ${intentName} not supported`);
    }

    // ...
}

// --------------- Main handler -----------------------

// ...
```

You can now run `terraform apply` to provision your resources. After provisioning the resources, testing the `CreatePost` intent you will get an error. You can check `CloudWatch` logs and will notice the following error:

```
"reason":{"errorType":"AccessDeniedException","errorMessage":"User:
arn:aws:sts::xxxxxxxxxx:assumed-role/iam_for_classifieds_lambda/classifieds_lambda
is not authorized to perform: dynamodb:PutItem
on resource: arn:aws:dynamodb:us-east-1:xxxxxxxxxx:table/Classifieds"...
```

By now we know the drill. We need to give our Lambda function permission to perform actions on our DynamoDB table.

Update `lambda.tf` and add the following code block at the end of the file.

```hcl
// ...

# We need to grant Lambda Dynamodb permissions
# So let's create an iam policy that allows operations on dynamodb
# Here we have specified all actions, however,
# it is recommended to specify only the required actions
data "aws_iam_policy_document" "allow_dynamodb" {
  statement {
    sid       = ""
    effect    = "Allow"
    actions   = [
        "dynamodb:PutItem"
    ]
    resources = ["*"]
  }
}

# Use the defined iam policy document to create an iam policy that allows dynamodb access
resource "aws_iam_policy" "allow_dynamodb" {
  name        = "allow-dynamodb-policy"
  description = "Allows access to dynamo db"
  policy      = data.aws_iam_policy_document.allow_dynamodb.json
}

# Now that we have an iam policy, let's attach it to our lambda iam role
resource "aws_iam_role_policy_attachment" "allow_dynamodb_attach" {
  role       = aws_iam_role.iam_for_classifieds_lambda.name
  policy_arn = aws_iam_policy.allow_dynamodb.arn
}
```

You can test the bot again and your post should be created and stored in DynamoDB.

![Create post dynamodb](../images/create_post_dynamodb.png)

### ReadPost

Let's work on the logic to read a post from our database. We will need to parse a `PostId` to our chatbot and it will return a post for us. Add logic to handle `ReadPost` intent as below.

```js {5,9-25,28,33-34,40-42,54-55}
'use strict';

// ...

const READ_POST_INTENT = 'ReadPost'

// ...

async function readPost(intentRequest, callback) {
    const slots = intentRequest.currentIntent.slots;

    var params = {
        TableName: TABLE_NAME,
        Key: {
            PostId: slots.PostId
        }
    };

    try {
        const result = await dynamodb.get(params).promise()
        return result;
    } catch (error) {
        console.error(error);
    }
}

// --------------- Events -----------------------
async function dispatch(intentRequest, context, callback) {
    const intentName = intentRequest.currentIntent.name;

    // ...

    // will store our response contet to be sent back to Lex
    let responseContent = ''

    switch (intentName) {
        case CREATE_POST_INTENT:
            createPost(intentRequest, context)
            break;
        case READ_POST_INTENT:
            responseContent = await readPost(intentRequest);
            break;
        default:
            throw new Error(`Intent with name ${intentName} not supported`);
    }

    if (source !== 'DialogCodeHook') {
        callback(
            close(
                sessionAttributes,
                'Fulfilled',
                {
                    'contentType': 'PlainText',
                    'content': `Fulfill intent named ${intentName}
                    ResponseContent: ${JSON.stringify(responseContent)}`
                }
            )
        );
    }
}
```

Apply your changes by running `terraform apply`.

Go ahead and create a new post using Lex test window. Navigate to DynamoDB and copy the created item's `PostId`. This process will use the scan process to return the items in the table.

![Scanned db item](../images/scanned_dynamo_item.png)

::: warning
DynamoDB scans are expensive and slow. It's not good practice to use scans on your DynamoDB tables
:::

Now if you test reading a post using the test bot window you will get an error because Lambda has no DynamoDB `GetItem` permissions.

Update the `data "aws_iam_policy_document" "allow_dynamodb"` block in your `lambda.tf` file to the following.

```hcl{9-13}
# We need to grant Lambda Dynamodb permissions
# So let's create an iam policy that allows operations on dynamodb
# Here we have specified all actions, however,
# it is recommended to specify only the required actions
data "aws_iam_policy_document" "allow_dynamodb" {
  statement {
    sid       = ""
    effect    = "Allow"
    actions   = [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem"
    ]
    resources = ["*"]
  }
}
```

Apply the new IAM policy by running `terraform apply`.

Test the intent again and you should see a successful response.

![Read post lex](../images/read_post_response.png)




### DeletePost
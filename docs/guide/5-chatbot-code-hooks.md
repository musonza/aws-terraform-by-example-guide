## Introducing AWS Lambda

> Lambda is a compute service that lets you run code without provisioning or managing servers. Lambda runs your code on a high-availability compute infrastructure and performs all of the administration of the compute resources, including server and operating system maintenance, capacity provisioning and automatic scaling, code monitoring and logging. With Lambda, you can run code for virtually any type of application or backend service. All you need to do is supply your code in one of the languages that Lambda supports.

You can see more on AWS Lambda at https://docs.aws.amazon.com/lambda/latest/dg/welcome.html

Earlier, you noticed that our bot was just returning the intent information on fulfillment. We are going to be using an AWS Lambda function as **code hook** for our Amazon Lex bot. Our function will perform validation and fulfillment of our intent.

## Create Lambda function

You have a handful runtimes that you can pick to write your Lambda function in. In our case we are going to use nodejs. There is a lot of configuration required for our Lambda function. I will add comments to explain each piece of code.

First let's write little code for our function. Create a new directory named `src` within `aws-terraform-by-example`. Then create a file `classifieds_lambda.js` in the `src` directory.

```js
'use strict';

// --------------- Events -----------------------
function dispatch(intentRequest, context, callback) {
    const intentName = intentRequest.currentIntent.name;

    // map of slot names, configured for the intent, to slot values that
    // Amazon Lex has recognized in the user conversation.
    // A slot value remains null until the user provides a value.
    const slots = intentRequest.currentIntent.slots;

    // invocationSource indicates why Amazon Lex is invoking the Lambda function,
    // Amazon Lex sets this to one of the following values:
    // DialogCodeHook – Amazon Lex sets this value to direct the Lambda function
    // to initialize the function and to validate the user's data input.
    // FulfillmentCodeHook – Lex sets this value to
    // direct the Lambda function to fulfill an intent.
    const source = intentRequest.invocationSource;

    // Application-specific session attributes that the client
    // sends in the request.
    // If you want Amazon Lex to include them in the response to the client,
    // your Lambda function should send these back to Amazon Lex in the response
    const sessionAttributes = intentRequest.sessionAttributes;

    if (source !== 'DialogCodeHook') {
        callback(
            close(
                sessionAttributes,
                'Fulfilled',
                {
                    'contentType': 'PlainText',
                    'content': `Fulfill intent named ${intentName}
                    Body: ${JSON.stringify(slots)}`
                }
            )
        );
    }
}


// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            context,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};
```

Now that we have our code for Lambda, let's work on the Terraform declaration of the function. Create a new file `lambda.tf` and add the following code block.

```hcl
# The archive provider will expose resources to manage archive files.
provider "archive" {}

# This will generate an archive from our source file.
data "archive_file" "zip" {
  type = "zip"
  # source code path for our Lambda function which
  # handles Lex intent fulfillment activities
  source_file = "src/classifieds_lambda.js"
  # each time we have new changes in our code we send output to this
  # path as a zip
  output_path = "archives/classifieds.zip"
}

# The execution role provides the function's identity and
# access to AWS services and resources.
resource "aws_iam_role" "iam_for_classifieds_lambda" {
  name               = "iam_for_classifieds_lambda"
  assume_role_policy = data.aws_iam_policy_document.policy.json
}

#  ---- Data for our Lambda configuration ----

# The IAM policy that our Lambda execution role will assume
data "aws_iam_policy_document" "policy" {
  statement {
    sid    = ""
    effect = "Allow"

    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }

    actions = ["sts:AssumeRole"]
  }
}

#  ----- End data for our configuration ---- //

resource "aws_lambda_function" "classifieds_lambda" {
  function_name = "classifieds_lambda"
  filename      = data.archive_file.zip.output_path
  # Amazon Resource Name (ARN) of the function's execution role.
  role = aws_iam_role.iam_for_classifieds_lambda.arn
  # Used to trigger updates. Must be set to a base64-encoded SHA256 hash
  # of the package file specified
  source_code_hash = filebase64sha256(data.archive_file.zip.output_path)

  handler     = "classifieds_lambda.handler"
  runtime     = "nodejs14.x"
  description = "Code hookup for classifieds bot"
}
```

Running `terraform apply` and you may run into the below error.

```txt
│ Error: Inconsistent dependency lock file
│
│ The following dependency selections recorded in the lock file are inconsistent with the current
│ configuration:
│   - provider registry.terraform.io/hashicorp/archive: required by this configuration but no version is selected
│
│ To update the locked dependency selections to match a changed configuration, run:
│   terraform init -upgrade
```

This is because we have added a new provider, `archive` after we had alreay initialized our Terraform dependencies. As the message suggests, we can address the issue by running `terraform init -upgrade`. After succesful upgrade you can run the `apply` command again and your Lambda function will be created. You can navigate to your AWS console to see the function and the deployed source code.

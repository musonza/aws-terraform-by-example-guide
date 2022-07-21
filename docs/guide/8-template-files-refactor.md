# Template files

You may have noticed code that similar to the following:

```hcl
# IAM role to use with authenticated identities
resource "aws_iam_role" "authenticated" {
  name = "cognito_authenticated"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.main.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}
```

While the `assume_role_policy` is not that long, we may have more extended policies in some cases, which will result in unreadable terraform files. This section aims to refactor any policies into separate files called templates. Then we will pull in the contents using `templatefile`, a Terraform function. Terraform has several built-in functions that can be utilized to transform and combine values within expressions.

Create a `templates` folder at the root of the project.

```shell
$ mkdir templates
```

Add the following JSON files to the templates directory.

```
ubuntu:~/environment/aws-terraform-by-example/templates
.
├── cognito-assume-role-policy.json
├── cognito-policy.json
├── lambda-allow-dynamodb-iam-policy.json
├── lambda-allow-logs-iam-policy.json
└── lambda-assumed-role-policy.json
```


`/templates/cognito-assume-role-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${pool_id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "${authenticated_or_unauthenticated}"
        }
      }
    }
  ]
}
```

`/templates/cognito-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*",
        "lex:PostContent",
        "lex:PostText",
        "lex:PutSession",
        "lex:GetSession",
        "lex:DeleteSession",
        "lex:RecognizeText",
        "lex:RecognizeUtterance",
        "lex:StartConversation"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

Now let's update cognito.tf to the following.

`/cognito.tf`

```hcl{11-16,24,37-43,49}
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name = "classifieds"
  // for now we will allow unauthenticated users for testing
  allow_unauthenticated_identities = true
  allow_classic_flow               = false
}

# IAM role to use with authenticated identities
resource "aws_iam_role" "authenticated" {
  name = "cognito_authenticated"
  assume_role_policy = templatefile(
    "templates/cognito-assume-role-policy.json",
    {
      pool_id                          = "${aws_cognito_identity_pool.main.id}",
      authenticated_or_unauthenticated = "authenticated"
    }
  )
}

// Policy to use with authenticated identities
resource "aws_iam_role_policy" "authenticated" {
  name   = "authenticated_policy"
  role   = aws_iam_role.authenticated.id
  policy = templatefile("templates/cognito-policy.json", {})
}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id
  roles = {
    "authenticated"   = aws_iam_role.authenticated.arn,
    "unauthenticated" = aws_iam_role.unauthenticated.arn
  }
}

resource "aws_iam_role" "unauthenticated" {
  name = "cognito_unauthenticated"
  assume_role_policy = templatefile(
    "templates/cognito-assume-role-policy.json",
    {
      pool_id                          = "${aws_cognito_identity_pool.main.id}",
      authenticated_or_unauthenticated = "unauthenticated"
    }
  )
}

resource "aws_iam_role_policy" "unauthenticated" {
  name   = "unauthenticated_policy"
  role   = aws_iam_role.unauthenticated.id
  policy = templatefile("templates/cognito-policy.json", {})
}

resource "aws_cognito_user_pool" "classifieds" {
  name             = "classifieds"
  alias_attributes = ["email", "phone_number"]
}

```

`/templates/ambda-allow-dynamodb-iam-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": ["*"]
    }
  ]
}
```

`/templates/lambda-allow-logs-iam-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream", 
        "logs:PutLogEvents",
        "logs:CreateLogGroup"
      ],
      "Resource": ["*"]
    }
  ]
}
```

`/templates/lambda-assumed-role-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "dynamodb.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Make updates to lambda.tf file.

`/lambda.tf`

```hcl{20,51,67}
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
  name = "iam_for_classifieds_lambda"
  # assume_role_policy = data.aws_iam_policy_document.policy.json
  assume_role_policy = templatefile("templates/lambda-assumed-role-policy.json", {})
}

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

# Gives an external source Lex permission to access the Lambda function.
# We need our bot to be able to invoke a lambda function when we attempt to fulfill our intent.
resource "aws_lambda_permission" "allow_lex" {
  statement_id  = "AllowExecutionFromLex"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.classifieds_lambda.function_name
  principal     = "lex.amazonaws.com"
}

resource "aws_iam_policy" "lambda_logs" {
  name        = "allow-logs-policy"
  description = "Allows access to logs"
  # We want to be able to send errors in our lambda function
  # to CloudWatch logs
  policy = templatefile("templates/lambda-allow-logs-iam-policy.json", {})
}

# Now that we have an iam policy, let's attach it to our lambda iam role
resource "aws_iam_role_policy_attachment" "lambda_logs_attach" {
  role       = aws_iam_role.iam_for_classifieds_lambda.name
  policy_arn = aws_iam_policy.lambda_logs.arn
}

# We need to grant Lambda Dynamodb permissions
# So let's create an iam policy that allows operations on dynamodb
# It is recommended to specify only the required actions
# Use the defined iam policy document to create an iam policy that allows dynamodb access
resource "aws_iam_policy" "allow_dynamodb" {
  name        = "allow-dynamodb-policy"
  description = "Allows access to dynamo db"
  policy      = templatefile("templates/lambda-allow-dynamodb-iam-policy.json", {})
}

# Now that we have an iam policy, let's attach it to our lambda iam role
resource "aws_iam_role_policy_attachment" "allow_dynamodb_attach" {
  role       = aws_iam_role.iam_for_classifieds_lambda.name
  policy_arn = aws_iam_policy.allow_dynamodb.arn
}
```
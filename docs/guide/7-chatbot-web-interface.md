# Chatbot Web Interface

## Chatbot UI

Until now we have been interacting with our chatbot using the bot test window in the console. However, we would like our users to interact with the chatbot on the web. Luckily we don't have to build the UI from scratch. Amazon has a sample Lex Web UI project that we can leverage. We will use the sample project for our use case and cut on development time.

The chatbot UI has a lot of benefits that include:

- Mobile-ready responsive UI
- Support for voice and text
- Fully integrated user login via Amazon Cognito User Pool (we will use this for authentication and authorization)
- Resending any previous messages

This are just some of the benefits, but there is more as we will see when we start working on the integration.

Let's pull in the sample code into our project. Run the following command in the `src` directory of your project.

```bash
$ git clone https://github.com/aws-samples/aws-lex-web-ui.git
```

Remove the remote origin from the clone repo

```bash
$ cd aws-lex-web-ui && git remote remove origin && rm -rf .git
```

We have the following options to deploying and integrating the chatbot UI:

1. Using AWS CloudFormation
2. Using a prebuilt distribution library
3. Using a prepackaged component

We are going to use the last option. We will be able to test on our local machines as well as deploy to Amazon s3 later on.

Let's test the sample we just pulled in by navigating to the chatbot ui directory

While in the `aws-lex-web-ui` directory, install node dependencies

```bash
$ npm ci
```

Build and run the project

```bash
$ npm run build && npm run dev
```

You should see output similar to the following:

```text
> aws-lex-web-ui@0.19.4 dev
> webpack-dev-server --mode development  --hot

ℹ ｢wds｣: Project is running at http://localhost:8000/
ℹ ｢wds｣: webpack output is served from /
```

When you navigate to the above url you will encounter a blank screen. If you check the browser developer console you will notice the following error `Error: missing cognito poolId config`

![Pool Id missing](../images/cognito_pool_missing.png)

We are getting this error because chatbot ui leverages Amazon Cognito for authentication and authorization. 

## Introducing Amazon Cognito

Amazon Cognito provides authentication, authorization, and user management for web and mobile apps. Our users will be able to sign in directly with a user name and password, or via a third party such as Facebook, Amazon, Google or Apple.

Amazon Cognito has two primary components - **user pools** and **identity pools**. User pools are user directories that provide us with sign-up and sign-in options. Identity pools afford us to grant user access to other AWS services. So from the previous error, `Error: missing cognito poolId config`, chatbot ui is missing configuration for an **identity pool**.

Let's work on creating Cognito resources using Terraform.
Create a new file `cognito.tf` in the root of your project.

```hcl
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "classifieds"
  // for now we will allow unauthenticated users for testing
  allow_unauthenticated_identities = true
  allow_classic_flow               = false
}

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

// Policy to use with authenticated identities
resource "aws_iam_role_policy" "authenticated" {
  name = "authenticated_policy"
  role = aws_iam_role.authenticated.id

  policy = <<EOF
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
EOF
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
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "unauthenticated" {
  name = "unauthenticated_policy"
  role = aws_iam_role.unauthenticated.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
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
EOF
}

resource "aws_cognito_user_pool" "classifieds" {
  name             = "classifieds"
  alias_attributes = ["email", "phone_number"]
}
```

Run `terraform apply` to provision your new resources.


You can obtain your pool id from Terraform output as seen next:

```bash
...
aws_cognito_user_pool.classifieds: Creating...
aws_cognito_identity_pool.main: Creation complete after 0s [id=us-east-1:a1e0d5a9-e1f4-4bbf-b383-cf92aa462b5b]
...
```

You can also use `terraform console`

```txt
bash-3.2$ terraform console
> resource.aws_cognito_identity_pool.main
{
  "allow_classic_flow" = false
  "allow_unauthenticated_identities" = true
  "arn" = "arn:aws:cognito-identity:us-east-1:082920454967:identitypool/us-east-1:a1e0d5a9-e1f4-4bbf-b383-cf92aa462b5b"
  "cognito_identity_providers" = toset([])
  "developer_provider_name" = ""
  "id" = "us-east-1:a1e0d5a9-e1f4-4bbf-b383-cf92aa462b5b"
  "identity_pool_name" = "classifieds"
  "openid_connect_provider_arns" = toset(null) /* of string */
  "saml_provider_arns" = tolist(null) /* of string */
  "supported_login_providers" = tomap(null) /* of string */
  "tags" = tomap(null) /* of string */
  "tags_all" = tomap({})
}
>
```


Alternatively, you can find the pool id in AWS console. Navigate to AWS console and search for **Cognito**. You should find a link to **Federated identities**

![cognito dashboard](../images/cognito_dashboard.png)

Click through the link and look for your identity pool. Copy the identity pool id.

![pool](../images/identity_pool_id.png)

It's ok for this identity pool id to be in your html or JavaScript files. However, as an additional security we are going to eventually restrict our pool to aunthenticated users only later.


## Configure Chatbout UI

Chatbot UI provides us with some default configuration which you can find in the file  `src/aws-lex-web-ui/src/config/default-lex-web-ui-loader-config.json`. We will override or add our own configuration to `src/aws-lex-web-ui/src/config/lex-web-ui-loader-config.json`.

Make the following updates to `lex-web-ui-loader-config.json`

```json
{
  "region": "us-east-1",
  "cognito": {
    "poolId": "us-east-1:a1e0d5a9-e1f4-4bbf-b383-cf92aa462b5b",
    "aws_cognito_region": "us-east-1",
    "region": "us-east-1"
  },
  "lex": {
    "botName": "Classifieds",
    "initialText": "You can ask me for help adding posts. Just type \"create post\" or click on the mic and say it.",
    "initialSpeechInstruction": "Say 'Create Post' to get started.",
    "initialUtterance": "",
    "region": "us-east-1"
  },
  "ui": {
    "parentOrigin": "http://localhost:8000",
    "toolbarTitle": "Classifieds",
    "pageTitle": "Order Flowers Bot",
    "toolbarLogo": "",
    "positiveFeedbackIntent": "Thumbs up",
    "negativeFeedbackIntent": "Thumbs down",
    "helpIntent": "Help",
    "helpContent": {}
  },
  "iframe": {
    "iframeOrigin": "",
    "shouldLoadIframeMinimized": false,
    "iframeSrcPath": "/index.html#/?lexWebUiEmbed=true"
  }
}
```

Rebuild the app again and navigate to the provided url on your machine.

![UI first post](../images/lex-ui-first-post.png)

The next thing we are going to cover is how we can use a cloud-based integrated development environment  (IDE). The approach has a lot of benefits that we will cover. After setting up the cloud-based integrated development environment we will continue building our application.
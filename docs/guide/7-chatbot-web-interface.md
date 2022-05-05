# Chatbot Web Interface

## Chatbot UI

Until now we have been interacting with our chatbot using the bot test window in the console. However, we would like our users to interact with the chatbot on the web. Luckily we don't have to build the UI from scratch. Amazon has a sample Lex Web UI project that we can leverage. We will use the sample project for our use case and cut on development time.

The chatbot UI has a lot of benefits that include:

- Mobile-ready responsive UI
- Support for voice and text
- Fully integrated user login via Amazon Cognito User Pool (we will use this for authentication and authorization)
- Resending any previous messages

This are just some of the benefits, but there is more as we will see when we start working on the integration.

Let's pull in the sample code by adding it as a submodule to our project. Run the following command in the root of your project.

```bash
$ git submodule add https://github.com/aws-samples/aws-lex-web-ui.git
```

We have the following options to deploying and integrating the chatbot UI:

1. Using AWS CloudFormation
2. Using a prebuilt distribution library
3. Using a prepackaged component

We are going to use the last option. We will be able to test on our local machines as well as deploy to Amazon s3 later on.

Let's test the sample we just pulled in by navigating to the chatbot ui directory

Install node dependencies

```bash
cd aws-lex-web-ui && npm ci
```

Build the project
```bash
npm run build
```

Run the project

```bash
npm run dev
```

You should see output similar to the following:

```text
> aws-lex-web-ui@0.19.4 dev
> webpack-dev-server --mode development  --hot

ℹ ｢wds｣: Project is running at http://localhost:8000/
ℹ ｢wds｣: webpack output is served from /
```

When you navigate to the above url you will encounter the following error `Error: missing cognito poolId config`

![Pool Id missing](../images/cognito_pool_missing.png)


We are getting this error because chatbot ui leverages Amazon Cognito for authentication and authorization. 

## Introducing Amazon Cognito

Amazon Cognito provides authentication, authorization, and user management for web and mobile apps. Our users will be able to sign in directly with a user name and password, or via a third party such as Facebook, Amazon, Google or Apple.

Amazon Cognito has two primary components - **user pools** and **identity pools**. User pools are user directories that provide us with sign-up and sign-in options. Identity pools afford us to grant user access to other AWS services.


<!-- python -m SimpleHTTPServer 8000 -->
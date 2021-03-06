# Project Setup

Before creating our application and setting up infrastructure, let's decide on our project structure. With Terraform, you can set up your code into abstractions called modules. However, as the saying goes - "premature optimization is the root of all evil" we don't want to perform any premature abstraction, so we will stick with a root module to start.

While you can/will be using your text editor, I will use Unix-type commands to signify directory/file creation, etc., to highlight some steps easily.

First, create a directory for all our code on any location on your computer.

```bash
mkdir aws-terraform-by-example
```

## Define variables input

We must make our configuration as dynamic as possible. We want to try not to hardcode configuration values as much as possible. For instance, we will be using AWS `us-east-1` region in our application. However, you or someone else may need to launch the application in a different region, and we need an easy way to switch that in one place.

Create a new file `variables.tf` within your `aws-terraform-by-example` directory and add a block defining `aws_region` as below.

```hcl
variable "aws_region" {
  default = "us-east-1"
}
```

## Terraform Providers

For Terraform to work with our AWS account, we have to ensure we provide the abilities for that communication and resource management. To achieve the ability to communicate with different remote systems like AWS, Terraform will rely on plugins called providers. So in our configuration, we must declare the intent to use an AWS provider.

Create a new file `providers.tf` within your `aws-terraform-by-example` directory and add a block as below.

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.8"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

We have specified AWS as a required provider. We have also identified a region defined in `variables.tf`. Terraform will know where to look for the variable when we prefix with the keyword `var`. It's also essential to specify the version we are using to ensure we don't run into issues because we will attempt to use the latest version each time.

Now to pull in the providers, we run the following command in the root directory.

```bash
$ terraform init
```

Once the command is done running, you should see an output similar to the below.

```txt
Initializing the backend...

Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 4.8"...
- Installing hashicorp/aws v4.8.0...
- Installed hashicorp/aws v4.8.0 (signed by HashiCorp)

Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see any changes that are required for your infrastructure. All Terraform commands should now work.

If you ever set or change modules or backend configuration for Terraform, rerun this command to reinitialize your working directory. If you forget, other commands will detect it and remind you to do so if necessary.

## AWS CLI Credentials Access Configuration

For Terraform to be able to create resources on our AWS account, it needs admin permissions via an IAM role. You may have a default profile for AWS CLI setup already. However, it's good practice to have specific profiles for specific projects. Edit the AWS provider block of providers.tf and add `profile = "aws-terraform-example"` as below.

```hcl
// ...
provider "aws" {
  region  = var.aws_region
  profile = "aws-terraform-example"
}

// ...
```

Now we need to create the configuration file. To do so we will edit `~/.aws/credentials` file. Note, you will need to have AWS cli installed on your system first.


::: tip AWS cli configuration
If you have just installed AWS cli, you need to run the command `aws configure` and follow the steps to complete configuration.
:::

```bash
$ vim ~/.aws/credentials
```

```txt
[default]
aws_access_key_id = ********
aws_secret_access_key = ********

[aws-terraform-example]
aws_access_key_id = ********
aws_secret_access_key = ********
```

Notice the name for the profile in AWS provider block should match the name of the profile name specified in `~/.aws/credential`. You can read more on AWS access key creation here https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/.

That's all, Terraform should now have access to your AWS account via the configured profile. When we provision our first resource, a chatbot, we will verify the setup soon.

## Source Control

This would be a perfect time to initialize your git repository if you haven't. Otherwise, feel free to skip the version control process if you want to follow along simply.

Initialize the repository

{line-numbers: false}
```bash
git init
```

Before we commit our changes to source control, we must ensure we ignore some files' versioning. Create a new file `.gitignore` and add the following:

```
# Local .terraform directories
**/.terraform/*

# .tfstate files
*.tfstate
*.tfstate.*

# Crash log files
crash.log
crash.*.log

# Exclude all .tfvars files, which likely contain sensitive data, such as
# password, private keys, and other secrets. These should not be part of version
# control as they are data points which are potentially sensitive and subject
# to change depending on the environment.
*.tfvars
*.tfvars.json

# Ignore override files as they are usually used to override
# resources locally and so are not checked in
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Include override files you do wish to add to version control
# using negated pattern !example_override.tf

# Include tfplan files to ignore the plan output of command:
# terraform plan -out=tfplan example: *tfplan*

# Ignore CLI configuration files
.terraformrc
terraform.rc
```

This file was obtained from https://github.com/github/gitignore/blob/main/Terraform.gitignore which is a good resource for a collection of various `.gitignore` files.

Let's add commit our changes to source control.

```bash
git add . && git commit -m "Initialize Terraform with AWS provider"
```
# Requirements

## AWS account

You will need an AWS account to follow along with the tutorials. If you don’t have one already, you can create an account at https://aws.amazon.com/. However, you shouldn’t expect significant billing charges to your account as long as you run a command to tear down your infrastructure each time you are done (more on that later).

::: tip AWS Free Tier
You can always create a new AWS account and take advantage of AWS Free Tier. Just make sure to provide a payment method you are not already using on another AWS account.

See more at https://aws.amazon.com/free/free-tier-faqs/
:::

## Terraform

A basic understanding of Terraform is required to go through the activities. Visit https://www.terraform.io/intro if you don't have Terraform setup on your machine. You can check whether you have Terraform by running the command below in your terminal.

{line-numbers: false}
```bash
~ $ terraform -v
Terraform v1.1.7
on darwin_amd64
```

Terraform is an Infrastructure as Code tool from HashiCorp that lets you define both cloud and on-prem resources in human-readable configuration files that can be versioned, reused, and shared for collaboration. You can learn more about getting started with Terraform at https://www.terraform.io/intro. I will not go through the setup of Terraform because I believe the Terraform site will do a great job getting you started.

## Text editor

A text editor to manage our Terraform files is going to be handy. Our choice is going to be Visual Studio Code (VS Code). Once VS Code is installed, you can search for a Terraform extension to add to your editor. Further instructions on the Terraform extension can be found here https://github.com/hashicorp/vscode-terraform. Terraform extension will add editing features for Terraform files such as syntax highlighting, Intellisense, code formatting, etc.

## Git (optional)

The beauty of  Infrastructure as Code is the ability to push changes to version control. We will incrementally work through our application infrastructure and track the history of changes via git as our code evolves. If you don’t have git setup, visit https://git-scm.com to get started.

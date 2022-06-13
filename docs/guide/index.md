# About this guide

## What are we building?

We are going to be building a classified ads application. The application will allow our app users to interact with a bot to manage their ads (perform CRUD operations). Users will add, delete and update their ads via bot interactions. Other users will be able to view and search for ads on a website we will create on AWS. In addition, we will have a lot of functionality, from managing user authentication to authorization, etc.

## Our approach

To achieve our goal, we will leverage AWS services available to us. While we can manually launch services in the AWS console, our approach to managing and provisioning services on AWS will be Infrastructure as Code (IaC). This approach allows us to create configuration files that contain our infrastructure specifications. In addition, having configuration files makes editing and distributing configurations easier. Also, configuration files have additional benefits, including change management, living documentation, and ensuring we provision the same environment each time, to name a few.

We have several options for solutions that will help us with IaC. These include AWS CloudFormation, Terraform, Chef, Puppet, etc. In our case, we are going to be using Terraform.
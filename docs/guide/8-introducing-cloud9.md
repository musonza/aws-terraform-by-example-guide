# Introducing AWS Cloud9

Until now we have been using VSCode IDE on our local machine. While this allows for faster and easier setup there are some drawbacks. For instance, we have to setup AWS access keys and secrets. Now imagine in a collaborative environment, we will need each team member to setup AWS credentials which may not be ideal. As an alternative, we can use AWS Cloud9.

## What is AWS Cloud9

AWS Cloud9 is a cloud-based integrated development environment (IDE) which allows you to write, run and debug code via the browser. Just like VSCode, it encompasses a code editor, debugger, and terminal. You will be able to work on your project from anywhere, as long as you have a machine connected to the internet. In addition, sharing development environments and code pairing with team members is a breeze.


## Cloud9 Setup

### Create environment

1. Navigate to your AWS console and search for Cloud9
2. Click on the **Create environment** button
3. Provide a name for your environment

![Create Cloud9 env](../images/create-cloud9-env.png)

4. Click next and make sure to select at least the following settings just to make sure we work with the same settings

![cloud9 env settings](../images/cloud9-env-settings-info.png)

5. Proceed with all the remaining steps and create your environment. Creation process may take a few minutes.

### Git setup

Now we need to pull in our code from a code repository. In my case I'm using GitHub, so these instructions are going to be more specific towards GitHub.


**Clone code repository**

Trying cloning the repository that has your work to this point you will get permissions issues 

```bash
ubuntu:~/environment $ git clone git@github.com:musonza/aws-terraform-by-example.git
Cloning into 'aws-terraform-by-example'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

**Connect Cloud9 and GitHub accounts via ssh**

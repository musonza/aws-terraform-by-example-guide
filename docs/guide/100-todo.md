 - create Cloud 9 env
 - integrated coding env, sandbox, runs on ec2, security token service

 - add ssh to github https://medium.com/sonabstudios/setting-up-github-on-aws-cloud9-with-ssh-2545c4f989ea
 - git clone git@github.com:musonza/aws-terraform-by-example.git
 - cd aws-terraform-by-example
 - terraform init
 - delete   profile = "aws-terraform-example" from providers.tf
 - terraform apply
 --- If you get an InvalidTokenId error and you are using AWS managed temporary credentials, your access might be restricted
    --- disable - https://github.com/aws-samples/aws-workshop-for-kubernetes/issues/391
    ---- https://docs.aws.amazon.com/cloud9/latest/user-guide/credentials.html#credentials-temporary

    -- terraform apply



- terraform graph (dependency graph) - investigate dependency issues
    - sudo apt install graphviz 
    - terraform graph | dot -Tpdf > graph-plan.pdf
     $ terraform graph | dot -Tpng > graph-plan.png                                                         
     $ terraform graph | dot -Tsvg > graph-plan.svg

     terraform graph -type=plan-destroy | dot -Tpng > graph-destroy.png


     - what is a terraform null_resource


     Organize code into terraform modules
     - include modules in root
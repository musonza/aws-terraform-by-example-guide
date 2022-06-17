# Hey, I'm Tinashe

Software Engineer

I'm learning the usage of Terraform with AWS provider by example and sharing my learnings. This is a work in progress, and I will try to make frequent updates.

**Status:** WIP

<details>
<summary>Click for current Plan</summary>

[View Terraform graph](https://aws-terraform-by-example.com/assets/graph-plan.fa6ce95f.svg)

```json
# aws_cognito_identity_pool.main will be created
  + resource "aws_cognito_identity_pool" "main" {
      + allow_classic_flow               = false
      + allow_unauthenticated_identities = true
      + arn                              = (known after apply)
      + id                               = (known after apply)
      + identity_pool_name               = "classifieds"
      + tags_all                         = (known after apply)
    }

  # aws_cognito_identity_pool_roles_attachment.main will be created
  + resource "aws_cognito_identity_pool_roles_attachment" "main" {
      + id               = (known after apply)
      + identity_pool_id = (known after apply)
      + roles            = (known after apply)
    }

  # aws_cognito_user_pool.classifieds will be created
  + resource "aws_cognito_user_pool" "classifieds" {
      + alias_attributes           = [
          + "email",
          + "phone_number",
        ]
      + arn                        = (known after apply)
      + creation_date              = (known after apply)
      + custom_domain              = (known after apply)
      + domain                     = (known after apply)
      + email_verification_message = (known after apply)
      + email_verification_subject = (known after apply)
      + endpoint                   = (known after apply)
      + estimated_number_of_users  = (known after apply)
      + id                         = (known after apply)
      + last_modified_date         = (known after apply)
      + mfa_configuration          = "OFF"
      + name                       = "classifieds"
      + sms_verification_message   = (known after apply)
      + tags_all                   = (known after apply)

      + admin_create_user_config {
          + allow_admin_create_user_only = (known after apply)

          + invite_message_template {
              + email_message = (known after apply)
              + email_subject = (known after apply)
              + sms_message   = (known after apply)
            }
        }

      + password_policy {
          + minimum_length                   = (known after apply)
          + require_lowercase                = (known after apply)
          + require_numbers                  = (known after apply)
          + require_symbols                  = (known after apply)
          + require_uppercase                = (known after apply)
          + temporary_password_validity_days = (known after apply)
        }

      + sms_configuration {
          + external_id    = (known after apply)
          + sns_caller_arn = (known after apply)
        }

      + verification_message_template {
          + default_email_option  = (known after apply)
          + email_message         = (known after apply)
          + email_message_by_link = (known after apply)
          + email_subject         = (known after apply)
          + email_subject_by_link = (known after apply)
          + sms_message           = (known after apply)
        }
    }

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

  # aws_iam_policy.allow_dynamodb will be created
  + resource "aws_iam_policy" "allow_dynamodb" {
      + arn         = (known after apply)
      + description = "Allows access to dynamo db"
      + id          = (known after apply)
      + name        = "allow-dynamodb-policy"
      + path        = "/"
      + policy      = jsonencode(
            {
              + Statement = [
                  + {
                      + Action   = [
                          + "dynamodb:UpdateItem",
                          + "dynamodb:PutItem",
                          + "dynamodb:GetItem",
                          + "dynamodb:DeleteItem",
                        ]
                      + Effect   = "Allow"
                      + Resource = "*"
                      + Sid      = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + policy_id   = (known after apply)
      + tags_all    = (known after apply)
    }

  # aws_iam_policy.lambda_logs will be created
  + resource "aws_iam_policy" "lambda_logs" {
      + arn         = (known after apply)
      + description = "Allows access to logs"
      + id          = (known after apply)
      + name        = "allow-logs-policy"
      + path        = "/"
      + policy      = jsonencode(
            {
              + Statement = [
                  + {
                      + Action   = [
                          + "logs:PutLogEvents",
                          + "logs:CreateLogStream",
                          + "logs:CreateLogGroup",
                        ]
                      + Effect   = "Allow"
                      + Resource = "*"
                      + Sid      = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + policy_id   = (known after apply)
      + tags_all    = (known after apply)
    }

  # aws_iam_role.authenticated will be created
  + resource "aws_iam_role" "authenticated" {
      + arn                   = (known after apply)
      + assume_role_policy    = (known after apply)
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + managed_policy_arns   = (known after apply)
      + max_session_duration  = 3600
      + name                  = "cognito_authenticated"
      + name_prefix           = (known after apply)
      + path                  = "/"
      + tags_all              = (known after apply)
      + unique_id             = (known after apply)

      + inline_policy {
          + name   = (known after apply)
          + policy = (known after apply)
        }
    }

  # aws_iam_role.iam_for_classifieds_lambda will be created
  + resource "aws_iam_role" "iam_for_classifieds_lambda" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = [
                              + "lambda.amazonaws.com",
                              + "dynamodb.amazonaws.com",
                            ]
                        }
                      + Sid       = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + managed_policy_arns   = (known after apply)
      + max_session_duration  = 3600
      + name                  = "iam_for_classifieds_lambda"
      + name_prefix           = (known after apply)
      + path                  = "/"
      + tags_all              = (known after apply)
      + unique_id             = (known after apply)

      + inline_policy {
          + name   = (known after apply)
          + policy = (known after apply)
        }
    }

  # aws_iam_role.unauthenticated will be created
  + resource "aws_iam_role" "unauthenticated" {
      + arn                   = (known after apply)
      + assume_role_policy    = (known after apply)
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + managed_policy_arns   = (known after apply)
      + max_session_duration  = 3600
      + name                  = "cognito_unauthenticated"
      + name_prefix           = (known after apply)
      + path                  = "/"
      + tags_all              = (known after apply)
      + unique_id             = (known after apply)

      + inline_policy {
          + name   = (known after apply)
          + policy = (known after apply)
        }
    }

  # aws_iam_role_policy.authenticated will be created
  + resource "aws_iam_role_policy" "authenticated" {
      + id     = (known after apply)
      + name   = "authenticated_policy"
      + policy = jsonencode(
            {
              + Statement = [
                  + {
                      + Action   = [
                          + "mobileanalytics:PutEvents",
                          + "cognito-sync:*",
                          + "cognito-identity:*",
                          + "lex:PostContent",
                          + "lex:PostText",
                          + "lex:PutSession",
                          + "lex:GetSession",
                          + "lex:DeleteSession",
                          + "lex:RecognizeText",
                          + "lex:RecognizeUtterance",
                          + "lex:StartConversation",
                        ]
                      + Effect   = "Allow"
                      + Resource = [
                          + "*",
                        ]
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + role   = (known after apply)
    }

  # aws_iam_role_policy.unauthenticated will be created
  + resource "aws_iam_role_policy" "unauthenticated" {
      + id     = (known after apply)
      + name   = "unauthenticated_policy"
      + policy = jsonencode(
            {
              + Statement = [
                  + {
                      + Action   = [
                          + "mobileanalytics:PutEvents",
                          + "cognito-sync:*",
                          + "lex:PostContent",
                          + "lex:PostText",
                          + "lex:PutSession",
                          + "lex:GetSession",
                          + "lex:DeleteSession",
                          + "lex:RecognizeText",
                          + "lex:RecognizeUtterance",
                          + "lex:StartConversation",
                        ]
                      + Effect   = "Allow"
                      + Resource = [
                          + "*",
                        ]
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + role   = (known after apply)
    }

  # aws_iam_role_policy_attachment.allow_dynamodb_attach will be created
  + resource "aws_iam_role_policy_attachment" "allow_dynamodb_attach" {
      + id         = (known after apply)
      + policy_arn = (known after apply)
      + role       = "iam_for_classifieds_lambda"
    }

  # aws_iam_role_policy_attachment.lambda_logs_attach will be created
  + resource "aws_iam_role_policy_attachment" "lambda_logs_attach" {
      + id         = (known after apply)
      + policy_arn = (known after apply)
      + role       = "iam_for_classifieds_lambda"
    }

  # aws_lambda_function.classifieds_lambda will be created
  + resource "aws_lambda_function" "classifieds_lambda" {
      + architectures                  = (known after apply)
      + arn                            = (known after apply)
      + description                    = "Code hookup for classifieds bot"
      + filename                       = "archives/classifieds.zip"
      + function_name                  = "classifieds_lambda"
      + handler                        = "classifieds_lambda.handler"
      + id                             = (known after apply)
      + invoke_arn                     = (known after apply)
      + last_modified                  = (known after apply)
      + memory_size                    = 128
      + package_type                   = "Zip"
      + publish                        = false
      + qualified_arn                  = (known after apply)
      + reserved_concurrent_executions = -1
      + role                           = (known after apply)
      + runtime                        = "nodejs14.x"
      + signing_job_arn                = (known after apply)
      + signing_profile_version_arn    = (known after apply)
      + source_code_hash               = "IdDrSR8FMVBH+hn56h/bD3X/EAt9HbqbCdqoxwDlUbM="
      + source_code_size               = (known after apply)
      + tags_all                       = (known after apply)
      + timeout                        = 3
      + version                        = (known after apply)

      + ephemeral_storage {
          + size = (known after apply)
        }

      + tracing_config {
          + mode = (known after apply)
        }
    }

  # aws_lambda_permission.allow_lex will be created
  + resource "aws_lambda_permission" "allow_lex" {
      + action        = "lambda:InvokeFunction"
      + function_name = "classifieds_lambda"
      + id            = (known after apply)
      + principal     = "lex.amazonaws.com"
      + statement_id  = "AllowExecutionFromLex"
    }

  # aws_lex_bot.classifieds will be created
  + resource "aws_lex_bot" "classifieds" {
      + arn                             = (known after apply)
      + checksum                        = (known after apply)
      + child_directed                  = false
      + create_version                  = false
      + created_date                    = (known after apply)
      + detect_sentiment                = false
      + enable_model_improvements       = false
      + failure_reason                  = (known after apply)
      + id                              = (known after apply)
      + idle_session_ttl_in_seconds     = 300
      + last_updated_date               = (known after apply)
      + locale                          = "en-US"
      + name                            = "Classifieds"
      + nlu_intent_confidence_threshold = 0
      + process_behavior                = "BUILD"
      + status                          = (known after apply)
      + version                         = (known after apply)
      + voice_id                        = (known after apply)

      + abort_statement {
          + message {
              + content      = "Sorry, I am not able to assist you at this time"
              + content_type = "PlainText"
            }
        }

      + intent {
          + intent_name    = "CreatePost"
          + intent_version = (known after apply)
        }
      + intent {
          + intent_name    = "DeletePost"
          + intent_version = (known after apply)
        }
      + intent {
          + intent_name    = "ReadPost"
          + intent_version = (known after apply)
        }
      + intent {
          + intent_name    = "UpdatePost"
          + intent_version = (known after apply)
        }
    }

  # aws_lex_intent.create_post will be created
  + resource "aws_lex_intent" "create_post" {
      + arn               = (known after apply)
      + checksum          = (known after apply)
      + create_version    = false
      + created_date      = (known after apply)
      + id                = (known after apply)
      + last_updated_date = (known after apply)
      + name              = "CreatePost"
      + sample_utterances = [
          + "Create a post",
          + "Create an ad",
          + "I would like to create an ad",
          + "Post an ad",
        ]
      + version           = (known after apply)

      + fulfillment_activity {
          + type = "CodeHook"

          + code_hook {
              + message_version = "1.0"
              + uri             = (known after apply)
            }
        }

      + slot {
          + description       = "The description for your post / ad"
          + name              = "PostDescription"
          + priority          = 2
          + sample_utterances = []
          + slot_constraint   = "Required"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "Please provide the description of your post?"
                  + content_type = "PlainText"
                }
            }
        }
      + slot {
          + description       = "The title for your post / ad"
          + name              = "PostTitle"
          + priority          = 1
          + sample_utterances = []
          + slot_constraint   = "Required"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "What is the title of your post?"
                  + content_type = "PlainText"
                }
            }
        }
    }

  # aws_lex_intent.delete_post will be created
  + resource "aws_lex_intent" "delete_post" {
      + arn               = (known after apply)
      + checksum          = (known after apply)
      + create_version    = false
      + created_date      = (known after apply)
      + id                = (known after apply)
      + last_updated_date = (known after apply)
      + name              = "DeletePost"
      + sample_utterances = [
          + "Delete a post",
          + "Delete an ad",
          + "I would like to delete an ad",
        ]
      + version           = (known after apply)

      + fulfillment_activity {
          + type = "CodeHook"

          + code_hook {
              + message_version = "1.0"
              + uri             = (known after apply)
            }
        }

      + slot {
          + description       = "The id for the post or ad in the database"
          + name              = "PostId"
          + priority          = 1
          + sample_utterances = []
          + slot_constraint   = "Required"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "What's the id of your ad that you want to delete?"
                  + content_type = "PlainText"
                }
            }
        }
    }

  # aws_lex_intent.read_post will be created
  + resource "aws_lex_intent" "read_post" {
      + arn               = (known after apply)
      + checksum          = (known after apply)
      + create_version    = false
      + created_date      = (known after apply)
      + id                = (known after apply)
      + last_updated_date = (known after apply)
      + name              = "ReadPost"
      + sample_utterances = [
          + "I would like to read an ad",
          + "Read a post",
          + "Read an ad",
          + "Show an ad",
        ]
      + version           = (known after apply)

      + fulfillment_activity {
          + type = "CodeHook"

          + code_hook {
              + message_version = "1.0"
              + uri             = (known after apply)
            }
        }

      + slot {
          + description       = "The id for the post or ad in the database"
          + name              = "PostId"
          + priority          = 1
          + sample_utterances = []
          + slot_constraint   = "Required"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "What's the id of the ad?"
                  + content_type = "PlainText"
                }
            }
        }
    }

  # aws_lex_intent.update_post will be created
  + resource "aws_lex_intent" "update_post" {
      + arn               = (known after apply)
      + checksum          = (known after apply)
      + create_version    = false
      + created_date      = (known after apply)
      + id                = (known after apply)
      + last_updated_date = (known after apply)
      + name              = "UpdatePost"
      + sample_utterances = [
          + "I would like to update an ad",
          + "Update a post",
          + "Update an ad",
        ]
      + version           = (known after apply)

      + fulfillment_activity {
          + type = "CodeHook"

          + code_hook {
              + message_version = "1.0"
              + uri             = (known after apply)
            }
        }

      + slot {
          + description       = "The description for your post / ad"
          + name              = "PostDescription"
          + priority          = 3
          + sample_utterances = []
          + slot_constraint   = "Optional"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "Please provide the description of your post?"
                  + content_type = "PlainText"
                }
            }
        }
      + slot {
          + description       = "The id for the post or ad in the database"
          + name              = "PostId"
          + priority          = 1
          + sample_utterances = []
          + slot_constraint   = "Required"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "What's the id of the ad you want to update?"
                  + content_type = "PlainText"
                }
            }
        }
      + slot {
          + description       = "The title for your post / ad"
          + name              = "PostTitle"
          + priority          = 2
          + sample_utterances = []
          + slot_constraint   = "Optional"
          + slot_type         = "AMAZON.AlphaNumeric"

          + value_elicitation_prompt {
              + max_attempts = 2

              + message {
                  + content      = "What is the title of your post?"
                  + content_type = "PlainText"
                }
            }
        }
    }

Plan: 20 to add, 0 to change, 0 to destroy.
```
</details>
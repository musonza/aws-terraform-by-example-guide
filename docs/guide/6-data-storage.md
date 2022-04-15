# Data storage

In the previous section we started implementing our business logic in a Lambda function. What's a CRUD application without data storage? So our next task is tackling how we are going to store the classified ads that our user create via the chatbot. Our database of choice is going to be Amazon DynamoDB.

## Introducing Amazon DynamoDB

Amazon DynamoDB is a fully managed, serverless, key-value NoSQL database. It is designed to run high-peformance applications at any scale.
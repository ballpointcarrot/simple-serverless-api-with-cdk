# Simple API CDK + Serverless

This project defines a serverless API which handles a simple "hello world" endpoint as
well as (most of) a CRUDL endpoint for a simple data object. The app is deployed via AWS CDK,
which manages the infrastructure of the app so that you don't need to manually provision and
manage resources.

## Deploying

Prerequisites: an AWS account and a set of credentials registered via the AWS CLI tools.

In order to deploy the application, you'll need to run two steps:

`yarn run cdk bootstrap` will create resources used by CDK to deploy non-AWS resources (eg: function code,
docker images, etc.) into AWS.

Once that's complete, `yarn run cdk deploy` will deploy the application based on the constructs defined
in `./lib/simple_api-stack.ts`.

## Included

* API Gateway
* Lambda functions (Hello, CRUDL functions housed in `./src/lambdas`)
* DynamoDB Table (for managing data for the CRUDL operations)

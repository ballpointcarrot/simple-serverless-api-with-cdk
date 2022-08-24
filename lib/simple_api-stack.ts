import * as cdk from 'aws-cdk-lib';
import * as apig from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

import { Construct } from 'constructs';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

export type CrudAction = "Create" | "Update" | "Read" | "Delete" | "List";

export class SimpleApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apig.RestApi(this, "simple-api");

    /* Create a new AWS Lambda function */
    const helloFn = new NodejsFunction(this, 'hello-fn', {
      entry: 'src/lambdas/hello.ts',
      handler: 'helloHandler'
    });

    const helloIntegration = new apig.LambdaIntegration(helloFn);

    /* You can reuse the same function logic to power separate routes */
    const hello = api.root.addResource('hello');
    hello.addMethod('GET', helloIntegration);
    const helloName = hello.addResource('{name}');
    helloName.addMethod('GET', helloIntegration);


    const crudDb = new Table(this, 'crud-db', {
      partitionKey: { name: 'crud_id', type: AttributeType.STRING }
    });

    /* An example REST CRUD route */
    const cruds = api.root.addResource('crud');
    const crudFns = this.buildCrudFunctions(crudDb);
    cruds.addMethod('GET', new apig.LambdaIntegration(crudFns.List));
    cruds.addMethod('POST', new apig.LambdaIntegration(crudFns.Create));
    const crud = cruds.addResource('{crud_id}');
    crud.addMethod('GET', new apig.LambdaIntegration(crudFns.Read));
    crud.addMethod('PUT');
    crud.addMethod('DELETE', new apig.LambdaIntegration(crudFns.Delete));
  }

  // TODO finish building functions here
  buildCrudFunctions(db: Table): Record<CrudAction, IFunction> {
    const listFn = new NodejsFunction(this, 'list-cruds', {
      entry: 'src/lambdas/crud/list.ts',
      environment: {
        DDB_TABLE_NAME: db.tableName
      }
      // defaults to handler: 'handler'
    });
    db.grantReadData(listFn);
    const readFn = new NodejsFunction(this, 'read-crud', {
      entry: 'src/lambdas/crud/read.ts',
      environment: {
        DDB_TABLE_NAME: db.tableName
      }
    });
    db.grantReadData(readFn);
    const createFn = new NodejsFunction(this, 'create-crud', {
      entry: 'src/lambdas/crud/create.ts',
      environment: {
        DDB_TABLE_NAME: db.tableName
      }
    });
    db.grantReadWriteData(createFn);
    const updateFn = new NodejsFunction(this, 'update-crud', {
      entry: 'src/lambdas/crud/update.ts',
      environment: {
        DDB_TABLE_NAME: db.tableName
      }
    });
    db.grantReadWriteData(updateFn);
    const deleteFn = new NodejsFunction(this, 'delete-crud', {
      entry: 'src/lambdas/crud/delete.ts',
      environment: {
        DDB_TABLE_NAME: db.tableName
      }
    });
    db.grantReadWriteData(deleteFn);
    return {
      "List": listFn,
      "Create": createFn,
      "Read": readFn,
      "Update": updateFn,
      "Delete": deleteFn
    };
  }

}

import { Context, APIGatewayEvent } from 'aws-lambda';
import { client as dbClient, QueryCommand } from './db';
import Log from 'pino';

const logger = Log();

async function readCrud(event: APIGatewayEvent, _context: Context ) {
    const crud_id = event.pathParameters?.crud_id ?? "";
    const queryCmd = new QueryCommand({
        TableName: process.env.DDB_TABLE_NAME ?? "",
        KeyConditionExpression: "#id = :key",
        ExpressionAttributeNames: {
            "#id": "crud_id"
        },
        ExpressionAttributeValues: {
            ":key": crud_id
        }

    })
    const results = await dbClient.send(queryCmd);
    if(results.Items) {
        return {
            statusCode: 200,
            body: JSON.stringify(results.Items[0])
        };
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({})
        };
    }
}

export const handler = readCrud;

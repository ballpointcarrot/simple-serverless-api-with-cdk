import { Context, APIGatewayEvent } from 'aws-lambda';
import { client as dbClient, DeleteCommand } from './db';
import Log from 'pino';

const logger = Log()

async function deleteCrud(event: APIGatewayEvent, _context: Context ) {
    const crud_id = event.pathParameters?.crud_id ?? "";
    const queryCmd = new DeleteCommand({
        TableName: process.env.DDB_TABLE_NAME ?? "",
        Key: { crud_id }

    })
    const results = await dbClient.send(queryCmd);
    return {
        statusCode: 200,
        body: JSON.stringify({})
    };
}

export const handler = deleteCrud;

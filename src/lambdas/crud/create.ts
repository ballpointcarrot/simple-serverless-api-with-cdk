import { Context, APIGatewayEvent } from 'aws-lambda';
import * as uuid from 'uuid';
import { client as dbClient, PutCommand } from './db';
import { CrudObject } from './shapes';
import Log from 'pino';

const logger = Log();

async function createCrud(event: APIGatewayEvent, _context: Context ) {
    const input = JSON.parse(event.body ?? "");
    const crud: CrudObject = {
        crud_id: uuid.v4(),
        location: input.location
    }
    const createCmd = new PutCommand({
        TableName: process.env.DDB_TABLE_NAME ?? "",
        Item: crud
    })
    const results = await dbClient.send(createCmd);
    return {
        statusCode: 201,
        body: JSON.stringify(crud)
    };
}

export const handler = createCrud;

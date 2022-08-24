import { Context, APIGatewayEvent } from 'aws-lambda';
import { client as dbClient } from './db';
import { CrudObject } from './shapes';
import Log from 'pino';

const logger = Log();

async function listCruds(event: APIGatewayEvent, _context: Context ) {
    const results: CrudObject[] = await dbClient.scan();
    return {
        statusCode: 200,
        body: results
    }
}

export const handler = listCruds;

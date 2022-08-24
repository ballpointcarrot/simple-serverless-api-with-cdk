import { Context, APIGatewayEvent } from 'aws-lambda';
import { client as dbClient } from './db';
import { CrudObject } from './shapes';
import Log from 'pino';

const logger = Log();

async function updateCrud(event: APIGatewayEvent, _context: Context ) {
    // TODO: this function is not complete, and is a no-op currently.
    return {
        statusCode: 200,
        body: ""
    }
}

export const handler = updateCrud;

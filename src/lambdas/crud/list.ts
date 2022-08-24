import { Context, APIGatewayEvent } from 'aws-lambda';
import { client as dbClient, ScanCommand} from './db';
import { CrudObject } from './shapes';
import Log from 'pino';


const logger = Log();

async function listCruds(event: APIGatewayEvent, _context: Context ) {
    const scanCmd: ScanCommand = new ScanCommand({
        TableName: process.env.DDB_TABLE_NAME ?? ""
    });

    const results = await dbClient.send(scanCmd);
    logger.info(results.Count);
    return {
        statusCode: 200,
        body: JSON.stringify({
            cruds: results.Items
        })
    }
}

export const handler = listCruds;

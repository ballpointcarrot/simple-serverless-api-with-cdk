import { Context, APIGatewayEvent } from 'aws-lambda';
import Log from 'pino';

const logger = Log();

export async function helloHandler(event: APIGatewayEvent, _context: Context ) {
    logger.info(`Event: ${JSON.stringify(event, null, 2)}`);

    let greeting = "World";
    if(event.pathParameters?.name) {
        greeting = event.pathParameters.name;
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello, ${greeting}!`
        })
    }
};


import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../business/todos'
import * as uuid from 'uuid'
import { loggers } from 'winston';
import { createLogger } from '../../utils/logger'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger('TodosAccess')

    const newTodo: CreateTodoRequest = JSON.parse(event.body as string)
    console.log('Processing... ', event)
    console.log('Processing... ', event.body)
    console.log('Processing newTodo ', newTodo)
    // TODO: Implement creating a new TODO item
    let userId = getUserId(event);
    console.log(userId);
    if (!userId) {
      userId = uuid.v4();
    }
    const newItem = await createTodo(newTodo, userId as string);

    console.log('Processing Done ', newItem)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)


import middy from "@middy/core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import cors from '@middy/http-cors'
import * as uuid from 'uuid'
import { getTodosForUser } from '../../business/todos'
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let userId = getUserId(event) ?? "1";
  console.log("userId ", userId);
  const todos = await getTodosForUser(userId as string);

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: todos
    })
  };
})

handler.use(
  cors({
    credentials: true
  })
)

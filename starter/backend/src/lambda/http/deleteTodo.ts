import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { getUserId } from '../utils'
import { deleteTodo } from '../../business/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters?.todoId
  
    // TODO: Remove a TODO item by id
    const userId = getUserId(event);
    console.log("userId ", userId);
    console.log("todoId ", todoId);
    const response = await deleteTodo(userId as string, todoId as string);
    console.log("Delete response ", response)

    return {
      statusCode: 204,
      body: response
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils';
import { updateTodo } from '../../business/todos'
import { loggers } from 'winston';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters?.todoId
    const todoUpdate: UpdateTodoRequest = JSON.parse(event.body as string)
    console.log("event ", event);
    console.log("todoId ", event.pathParameters?.todoId);
    console.log("todoUpdate ", todoUpdate);
    
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    let userId = getUserId(event) ?? "";
    console.log("userId ", userId);
    await updateTodo(userId as string, todoId as string, todoUpdate);

    return {
      statusCode: 204,
      body: "Update Todo Item successfully"
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)
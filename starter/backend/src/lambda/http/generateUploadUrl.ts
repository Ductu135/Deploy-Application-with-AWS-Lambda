import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { getUserId } from '../utils'
import { createAttachmentPresignedUrl } from '../../business/todos'

export const handler =  middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters?.todoId
  const userId = getUserId(event);

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const url = await createAttachmentPresignedUrl(todoId as string);

  return {
    statusCode: 201,
    body: JSON.stringify({
      url: url
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)


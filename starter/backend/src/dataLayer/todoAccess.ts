import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
        private readonly documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) {}

    getAllTodos = async (userId: string) : Promise<TodoItem[]> => {
        logger.info("Getting all todods");

        const result = await this.documentClient.query({
            TableName: this.todosTable as string,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        return result.Items as TodoItem[];
    }

    createTodoItem = async (todoItem: TodoItem): Promise<TodoItem> => {
        console.log('Creating todo item', todoItem);

        const response = await this.documentClient.put({
            TableName: this.todosTable as string,
            Item: todoItem
        }).promise();
        
        if (response.$response.error) {
            throw new Error(response.$response.error.message)
        }

        console.log('response result ', response);

        return todoItem as TodoItem;
    }


} 
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
        logger.info("Getting all todos");
        console.log("userId ", userId);
        console.log("todosIndex ", this.todosIndex);

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

    updateTodoItem = async (userId, todoId, todoUpdate: TodoUpdate) : Promise<TodoUpdate> => {
        logger.info("Connect database to update");

        const response = await this.documentClient.update({
            TableName: this.todosTable as string,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        return todoUpdate as TodoUpdate;
    }

    deleteTodoItem = async (userId: string, todoId: string): Promise<string> => {
        logger.info("Connect database to delete");

        await this.documentClient.delete({
            TableName: this.todosTable as string,
            Key: {
                userId, todoId
            }
        }).promise()

        logger.info("Deleted successfully")
        return "Deleted successfully";
    }
} 
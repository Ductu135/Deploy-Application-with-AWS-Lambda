import { TodosAccess } from '../dataLayer/todoAccess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger("TodoAccess");
const attachmentUtils = new AttachmentUtils();
const todoAccess = new TodosAccess();

//Get
export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
    console.log("Getting Todo item list", userId);
    return await todoAccess.getAllTodos(userId);
}

//Create
export const createTodo = async (newTodo: CreateTodoRequest, userId: string) : Promise<TodoItem> => {
    console.log("create function is called");
    console.log("createTodo ", newTodo);

    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId);
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    };

    console.log("createTodo newItem ", newItem);

    return await todoAccess.createTodoItem(newItem);
}

//Update
export const updateTodo =  async (userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> => {
    logger.info("Updating item");
    var updateItem = {
        ...todoUpdate
    }
    console.log("UpdateItem ", updateItem)
    return await todoAccess.updateTodoItem(userId, todoId, updateItem);
}

//Delete
export const deleteTodo =  async (userId: string, todoId: string): Promise<string> => {
    logger.info("Deleting item");
    return await todoAccess.deleteTodoItem(userId, todoId);
}

//Generate Url
export const createAttachmentPresignedUrl = async (todoId: string): Promise<string> => {
    return attachmentUtils.getUploadUrl(todoId);
}
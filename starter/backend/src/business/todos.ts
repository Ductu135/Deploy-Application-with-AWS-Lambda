import { TodosAccess } from '../dataLayer/todoAccess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const logger = createLogger("TodoAccess");
const attachmentUtils = new AttachmentUtils();
const todoAccess = new TodosAccess();

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
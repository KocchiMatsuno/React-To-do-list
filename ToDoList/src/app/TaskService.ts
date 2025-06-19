import { LocalStorageTaskRepository } from '../data/repos/LocalStorageTaskRepository';
import { AddTaskUseCase } from '../usecases/AddTaskUseCase';
import { RemoveTaskUseCase } from '../usecases/RemoveTaskUseCase';
import { UpdateTaskUseCase } from '../usecases/UpdateTaskUseCase';
import { GetAllTasksUseCase } from '../usecases/GetAllTasksUseCase';
import { GetTaskUseCase } from '../usecases/GetTaskUseCase';

const repo = new LocalStorageTaskRepository();

export const addTask = new AddTaskUseCase(repo).execute.bind(new AddTaskUseCase(repo));
export const removeTask = new RemoveTaskUseCase(repo).execute.bind(new RemoveTaskUseCase(repo));
export const updateTask = new UpdateTaskUseCase(repo).execute.bind(new UpdateTaskUseCase(repo));
export const getAllTasks = new GetAllTasksUseCase(repo).execute.bind(new GetAllTasksUseCase(repo));
export const getTask = new GetTaskUseCase(repo).execute.bind(new GetTaskUseCase(repo));

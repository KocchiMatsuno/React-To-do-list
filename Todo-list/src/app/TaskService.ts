import { LocalStorageTaskRepository } from '../data/repos/LocalStorageTaskRepository';
import { AddTaskUseCase } from '../domain/usecases/AddTaskUseCase.ts';
import { RemoveTaskUseCase } from '../domain/usecases/RemoveTaskUseCase';
import { UpdateTaskUseCase } from '../domain/usecases/UpdateTaskUseCase';
import { GetAllTasksUseCase } from '../domain/usecases/GetAllTasksUseCase';
import { GetTaskUseCase } from '../domain/usecases/GetTaskUseCase';

const repo = new LocalStorageTaskRepository(); // or InMemoryTaskRepository()
export const addTask = new AddTaskUseCase(repo).execute.bind(repo);
export const removeTask = new RemoveTaskUseCase(repo).execute.bind(repo);
export const updateTask = new UpdateTaskUseCase(repo).execute.bind(repo);
export const getAllTasks = new GetAllTasksUseCase(repo).execute.bind(repo);
export const getTask = new GetTaskUseCase(repo).execute.bind(repo);

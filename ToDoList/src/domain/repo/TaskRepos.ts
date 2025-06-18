import { Task } from '../entities/Task';

export interface TaskRepository {
  add(task: Task): Promise<void>;
  remove(id: string): Promise<void>;
  update(task: Task): Promise<void>;
  getAll(): Promise<Task[]>;
  get(id: string): Promise<Task | undefined>;
}

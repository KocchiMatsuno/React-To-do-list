import type { Task } from '../entities/Task';
export interface TaskRepository {
  add(task: Task): Promise<void>;
  remove(id: string): Promise<void>;
  update(task: Task): Promise<void>;
  get(id: string): Promise<Task | undefined>;
  getAll(): Promise<Task[]>;
}
  
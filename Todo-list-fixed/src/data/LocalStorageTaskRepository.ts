import type { Task } from '../domain/entities/TaskEntity';
import type { TaskRepository } from '../domain/repositories/TaskRepository';

const STORAGE_KEY = 'tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  private load(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private save(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  async add(task: Task): Promise<void> {
    const tasks = this.load();
    tasks.push(task);
    this.save(tasks);
  }

  async remove(id: string): Promise<void> {
    const tasks = this.load().filter(t => t.id !== id);
    this.save(tasks);
  }

  async update(task: Task): Promise<void> {
    const tasks = this.load().map(t => (t.id === task.id ? task : t));
    this.save(tasks);
  }

  async get(id: string): Promise<Task | undefined> {
    return this.load().find(t => t.id === id);
  }

  async getAll(): Promise<Task[]> {
    return this.load();
  }
}

import { Task } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repo/TaskRepository";

const STORAGE_KEY = "tasks";

export class LocalStorageTaskRepository implements TaskRepository {
  private load(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    // Reconstruct real Task instances from plain objects
    return parsed.map((t: any) =>
      new Task(t.id, t.title, t.completed, new Date(t.createdAt))
    );
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
    const tasks = this.load().filter((t) => t.id !== id);
    this.save(tasks);
  }

  async update(task: Task): Promise<void> {
    const tasks = this.load().map((t) => (t.id === task.id ? task : t));
    this.save(tasks);
  }

  async get(id: string): Promise<Task | undefined> {
    return this.load().find((t) => t.id === id);
  }

  async getAll(): Promise<Task[]> {
    return this.load();
  }
}

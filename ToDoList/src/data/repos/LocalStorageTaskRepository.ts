import { Task } from '../../domain/entities/Task';
import type{ TaskRepository } from '../../domain/repo/TaskRepository';

const STORAGE_KEY = 'tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  private getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveTasks(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  async add(task: Task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  async remove(id: string) {
    const tasks = this.getTasks().filter(task => task.id !== id);
    this.saveTasks(tasks);
  }

  async update(task: Task) {
    const tasks = this.getTasks().map(t => t.id === task.id ? task : t);
    this.saveTasks(tasks);
  }

  async getAll() {
    return this.getTasks();
  }

  async get(id: string) {
    return this.getTasks().find(task => task.id === id);
  }
}
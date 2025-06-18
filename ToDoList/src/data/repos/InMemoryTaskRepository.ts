import { Task } from '../../domain/entities/Task';
import type { TaskRepository } from '../../domain/repo/TaskRepository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async add(task: Task) {
    this.tasks.push(task);
  }

  async remove(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  async update(task: Task) {
    this.tasks = this.tasks.map(t => t.id === task.id ? task : t);
  }

  async getAll() {
    return [...this.tasks];
  }

  async get(id: string) {
    return this.tasks.find(task => task.id === id);
  }
}

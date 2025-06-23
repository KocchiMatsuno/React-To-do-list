import type { Task } from '../../domain/entities/Task';
import type { TaskRepository } from '../../domain/repo/TaskRepository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];
  async add(t: Task) { this.tasks.push(t); }
  async remove(id: string) { this.tasks = this.tasks.filter(x => x.id !== id); }
  async update(t: Task) { this.tasks = this.tasks.map(x => x.id === t.id ? t : x); }
  async get(id: string) { return this.tasks.find(x => x.id === id); }
  async getAll() { return [...this.tasks]; }
}

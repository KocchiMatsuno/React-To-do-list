import type { Task } from '../entities/Task';
import type { TaskRepository } from '../repo/TaskRepository';

export class AddTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(task: Task): Promise<void> {
    await this.repository.add(task);
  }
}

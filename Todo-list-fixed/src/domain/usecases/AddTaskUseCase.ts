import type { Task } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';

export class AddTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(task: Task): Promise<void> {
    await this.repository.add(task);
  }
}

import type { Task } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';

export class UpdateTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(task: Task): Promise<void> {
    await this.repository.update(task);
  }
}

import type { Task } from '../../domain/entities/Task';
import type { TaskRepository } from '../../domain/repo/TaskRepository';

export class UpdateTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(task: Task): Promise<void> {
    await this.repository.update(task);
  }
}

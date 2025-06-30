import type { Task } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';
export class GetAllTasksUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Task[]> {
    return await this.repository.getAll();
  }
}

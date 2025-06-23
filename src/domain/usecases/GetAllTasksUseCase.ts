import type { Task } from '../../domain/entities/Task';
import type { TaskRepository } from '../../domain/repo/TaskRepository';
export class GetAllTasksUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Task[]> {
    return await this.repository.getAll();
  }
}

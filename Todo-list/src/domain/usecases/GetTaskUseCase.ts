import type { Task } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';
export class GetTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Task | undefined> {
    return await this.repository.get(id);
  }
}

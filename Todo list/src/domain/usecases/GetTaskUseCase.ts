import type { Task } from '../../domain/entities/Task';
import type { TaskRepository } from '../../domain/repo/TaskRepository';
export class GetTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Task | undefined> {
    return await this.repository.get(id);
  }
}

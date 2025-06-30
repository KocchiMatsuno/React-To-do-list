import type { TaskRepository } from '../repositories/TaskRepository';

export class RemoveTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    await this.repository.remove(id);
  }
}

import type { TaskRepository } from '../../domain/repo/TaskRepository';

export class RemoveTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    await this.repository.remove(id);
  }
}

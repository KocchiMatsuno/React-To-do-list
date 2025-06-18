import type { TaskRepository } from '../domain/repo/TaskRepository';

export class RemoveTaskUseCase {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  execute(id: string): Promise<void> {
    return this.repo.remove(id);
  }
}

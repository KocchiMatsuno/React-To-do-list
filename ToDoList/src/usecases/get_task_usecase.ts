import type { Task } from '../domain/entities/Task';
import type { TaskRepository } from '../domain/repo/TaskRepository';

export class GetTaskUseCase {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  execute(id: string): Promise<Task | undefined> {
    return this.repo.get(id);
  }
}

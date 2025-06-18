import type { Task } from '../domain/entities/Task';
import type { TaskRepository } from '../domain/repo/TaskRepository';

export class GetAllTasksUseCase {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  execute(): Promise<Task[]> {
    return this.repo.getAll();
  }
}

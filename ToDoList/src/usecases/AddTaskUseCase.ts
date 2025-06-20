import type { Task } from '../domain/entities/Task';
import type { TaskRepository } from '../domain/repo/TaskRepository';

export class AddTaskUseCase {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  execute(task: Task): Promise<void> {
    return this.repo.add(task);
  }
}

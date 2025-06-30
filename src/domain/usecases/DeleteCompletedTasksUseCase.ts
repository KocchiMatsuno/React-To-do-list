import type { TaskRepository } from "../repo/TaskRepository";

export class DeleteCompletedTasksUseCase {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  async execute(): Promise<{ success: boolean; error?: string }> {
    try {
      const tasks = await this.repo.getAll();
      const completed = tasks.filter((t) => t.completed);
      for (const task of completed) {
        await this.repo.remove(task.id);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete completed tasks." };
    }
  }
}

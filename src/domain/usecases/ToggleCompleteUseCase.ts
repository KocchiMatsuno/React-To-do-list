import type { TaskRepository } from "../repo/TaskRepository";
import { Task } from "../entities/Task";

export class ToggleCompleteUseCase {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  async execute(id: string, completed: boolean): Promise<{ success: boolean; task?: Task; error?: string }> {
    const task = await this.repo.get(id);
    if (!task) {
      return { success: false, error: "Task not found." };
    }

    const updatedTask = new Task(task.id, task.title, completed);
    await this.repo.update(updatedTask);

    return { success: true, task: updatedTask };
  }
}

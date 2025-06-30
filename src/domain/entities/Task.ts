export class Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;

  constructor(id: string, title: string, completed = false, createdAt = new Date()) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.createdAt = createdAt;
  }
}

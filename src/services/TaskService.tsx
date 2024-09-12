import { Task } from "../models/Task";

export default class TaskService {
  static apiUrl: string = "http://localhost:3000";

  static async getTasksByStoryId(storyId: string): Promise<Task[]> {
    const response = await fetch(`${this.apiUrl}/tasks/?storyId=${storyId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks for story ID ${storyId}`);
    }
    return response.json();
  }
  static async getTasks(): Promise<Task[]> {
    const response = await fetch(`${this.apiUrl}/tasks/`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return response.json();
  }
  static async addTask(
    task: Task,
    storyId: string,
    projectId: string
  ): Promise<void> {
    const response = await fetch(
      `${this.apiUrl}/tasks/?projectId${projectId}/?storyId=${storyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create task: ${errorText}`);
    }
  }

  static async updateTask(task: Task): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update task with ID ${task._id}: ${errorText}`
      );
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    if (!taskId) {
      throw new Error("Invalid task ID");
    }
    const response = await fetch(`${this.apiUrl}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete task with ID ${taskId}: ${errorText}`);
    }
  }
}

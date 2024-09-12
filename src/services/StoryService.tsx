import { Story } from "../models/Story";

export default class StoryService {
  static apiUrl: string = "http://localhost:3000";

  static async getStories(): Promise<Story[]> {
    const response = await fetch(`${this.apiUrl}/stories/`);

    if (!response.ok) {
      throw new Error("Failed to fetch stories");
    }
    return response.json();
  }
  static async getStoryById(id:string): Promise<Story[]> {
    const response = await fetch(`${this.apiUrl}/stories/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch stories");
    }
    return response.json();
  }

  static async getStoriesByProjectId(projectId: string): Promise<Story[]> {
    const response = await fetch(
      `${this.apiUrl}/stories/?projectId=${projectId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch stories for project ID ${projectId}`);
    }
    return response.json();
  }

  static async createStory(story: Story, projectId: string): Promise<void> {
    const response = await fetch(
      `${this.apiUrl}/stories/?projectId=${projectId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(story),
      }
    );
    if (!response.ok) {
      console.log("Failed to create story:", story);

      const errorData = await response.text();
      console.error(`Error from server: ${errorData}`);

      throw new Error(
        `Failed to create story. Server responded with status: ${response.status}, error: ${errorData}`
      );
    }
  }

  static async updateStory(story: Story): Promise<void> {
    const response = await fetch(`${this.apiUrl}/stories/${story._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(story),
    });
    if (!response.ok) {
      throw new Error(`Failed to update story with ID ${story._id}`);
    }
  }

  static async deleteStory(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/stories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to delete story with ID ${id}`);
    }
  }
}

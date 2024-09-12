import { Project } from "../models/Project";
interface CurrentProject {
  id: string;
}
export default class ProjectAPI {
  static apiUrl: string = "http://localhost:3000";

  static async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.apiUrl}/projects`);
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.json();
  }

  static async getProject(id: string): Promise<Project | null> {
    const response = await fetch(`${this.apiUrl}/projects/${id}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  }

  static async createProject(project: Project): Promise<void> {
    const response = await fetch(`${this.apiUrl}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error("Failed to create project");
    }
  }

  static async updateProject(updatedProject: Project): Promise<void> {
    const response = await fetch(
      `${this.apiUrl}/projects/${updatedProject._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update project");
    }
  }

  static async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/projects/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
  }

  static async setCurrentProject(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/currentProject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error("Failed to set current project");
    }
  }

  static async getCurrentProject(): Promise<Project | null> {
    const response = await fetch(`${this.apiUrl}/currentProject`);
    if (!response.ok) {
      return null;
    }
    const data: CurrentProject = await response.json();
    return data.id ? this.getProject(data.id) : null;
  }
}

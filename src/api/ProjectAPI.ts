import { Project } from "../models/Project";
import { Story } from "../models/Story";
import { User } from "../models/User";

class ProjectAPI {
  private static currentProjectId: string | null = null;

  static getProjects(): Project[] {
    const projects = localStorage.getItem("projects");
    return projects ? JSON.parse(projects) : [];
  }

  static getProject(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find((project) => project._id === id) || null;
  }

  static createProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static updateProject(updatedProject: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex(
      (project) => project._id === updatedProject._id
    );
    if (index !== -1) {
      projects[index] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }

  static deleteProject(id: string): void {
    let projects = this.getProjects();
    projects = projects.filter((project) => project._id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static setCurrentProject(id: string): void {
    this.currentProjectId = id;
    localStorage.setItem("currentProjectId", id);
  }

  static getCurrentProject(): Project | null {
    const currentProjectId =
      this.currentProjectId || localStorage.getItem("currentProjectId");
    return currentProjectId ? this.getProject(currentProjectId) : null;
  }

  static getStories(): Story[] {
    const stories = localStorage.getItem("stories");
    return stories ? JSON.parse(stories) : [];
  }

  static getStoriesByProjectId(projectId: string): Story[] {
    const stories = this.getStories();
    return stories.filter((story) => story.projectId === projectId);
  }

  static createStory(story: Story): void {
    const stories = this.getStories();
    stories.push(story);
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  static updateStory(updatedStory: Story): void {
    const stories = this.getStories();
    const index = stories.findIndex((story) => story._id === updatedStory._id);
    if (index !== -1) {
      stories[index] = updatedStory;
      localStorage.setItem("stories", JSON.stringify(stories));
    }
  }

  static deleteStory(id: string): void {
    let stories = this.getStories();
    stories = stories.filter((story) => story._id !== id);
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  // Metody dotyczące użytkowników
  static register(user: User): void {
    let users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  static login(credentials: { username: string; password: string }): void {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) =>
        u.login === credentials.username &&
        u.password === credentials.password
    );
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      alert("Invalid credentials");
    }
  }
  static getUsers(): User[] {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : null;
  }
  static getCurrentUser(): User | null {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }

  static logout(): void {
    localStorage.removeItem("currentUser");
  }
}

export default ProjectAPI;

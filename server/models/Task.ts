export interface Task {
  _id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyId: string;
  estimatedTime: number;
  status: "todo" | "doing" | "done";
  createdAt: string;
  startAt?: string;
  endAt?: string;
  assignedUser?: string;
}

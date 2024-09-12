export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "admin" | "devops" | "developer";
}

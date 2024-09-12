import { User } from "../models/User";

const apiURL = "http://localhost:3000";

class UserService {
  static async register(user: User): Promise<boolean> {
    try {
      const response = await fetch(`${apiURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error("Failed to register");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  }

  static async login(credentials: {
    login: string;
    password: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return true;
      } else {
        alert("Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  static async googleLogin(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiURL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        return true;
      } else {
        alert("Google login failed");
        return false;
      }
    } catch (error) {
      console.error("Google login failed:", error);
      return false;
    }
  }

  static async getUsers(): Promise<User[]> {
    const response = await fetch(`${apiURL}/users`);

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch users");
    }
  }

  static getCurrentUser(): string | null {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      return "";
    }
    return user;
  }

  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");

    window.location.href = '/login';
  }

  static async refreshToken(): Promise<void> {
    const response = await fetch(`${apiURL}/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      UserService.logout();
      alert("Session expired. Please log in again.");
    }
  }
}

export default UserService;

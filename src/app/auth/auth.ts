import { apiRequest, TOKEN_KEY } from "@/app/lib/apiGateway";
import type { Session } from "@/app/auth/SessionContext";

interface RegisterData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  message: string;
  success: boolean;
}

interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  username?: string;
  phone?: string;
  joinDate?: string;
}

export const customAuth = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/auth/registration", {
      method: "POST",
      data,
    });
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const data = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        data: { email, password },
      });

      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);

        const userForSession: Session = {
          userId: data.userId,
          email: data.email,
          role: data.role,
          username: data.username || "Guest",
          phone: data.phone || "",
          joinDate:
            data.joinDate ||
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
        };

        localStorage.setItem("user", JSON.stringify(userForSession));
      }

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");
    }
    window.location.href = "/login";
  },

  async getSession(): Promise<Session | null> {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem("user");

    if (!token || !user) {
      console.log("Session check - Token:", !!token, "User:", !!user);
      return null;
    }

    try {
      return JSON.parse(user) as Session;
    } catch (error) {
      console.error("Error parsing user session:", error);
      return null;
    }
  },
};

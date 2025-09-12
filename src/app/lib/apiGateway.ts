import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const TOKEN_KEY = "auth_token";

  // Use proxy path instead of hardcoding localhost:8080
// Next.js will rewrite `/api` → `http://localhost:8080/api` via next.config.js
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Authorization token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export type RequestOptions = AxiosRequestConfig & { requiresAuth?: boolean };

// Generic request function
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });
    return response.data as T;
  } catch (error: any) {
    if (error.response) {
      // Server responded but not 2xx
      const errData = error.response.data as any;
      const message = errData?.message || errData?.error || "Request failed";
      console.error("API error:", errData, "Status:", error.response.status);
      throw new Error(message);
    } else if (error.request) {
      // No response received
      console.error("Network error:", error);
      throw new Error("Unable to reach the server. Please try again later.");
    } else {
      // Something else happened
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
}

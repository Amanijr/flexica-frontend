import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    Accept: "application/json",
  },
});

// Attach Authorization token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
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

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    // FormData should not have Content-Type
    if (options.data instanceof FormData) {
      options.headers = options.headers ?? {};
      delete (options.headers as Record<string, string>)["Content-Type"];
    }

    const response = await api({
      url: endpoint,
      ...options,
    });

    return response.data as T;
  } catch (error: any) {
    if (error.response) {
      const errData = error.response.data as any;
      const message = errData?.message || errData?.error || "Request failed";
      console.error("API error:", errData, "Status:", error.response.status);
      throw new Error(message);
    } else if (error.request) {
      console.error("Network error:", error);
      throw new Error("Unable to reach the server. Please try again later.");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
}

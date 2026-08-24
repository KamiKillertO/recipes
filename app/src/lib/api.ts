const DEFAULT_TIMEOUT_MS = 30_000;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    created_at: string;
  };
}

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export class ApiClient {
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;
  private timeoutMs: number = DEFAULT_TIMEOUT_MS;

  setToken(token: string | null) {
    this.token = token;
  }

  setUnauthorizedHandler(handler: (() => void) | null) {
    this.onUnauthorized = handler;
  }

  setTimeout(timeoutMs: number) {
    this.timeoutMs = timeoutMs;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      if (response.status === 401 && !endpoint.startsWith("/api/auth/")) {
        this.onUnauthorized?.();
      }
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Recipes
  async getRecipes(): Promise<any[]> {
    return this.request<any[]>("/api/recipes");
  }

  async getRecipe(id: string): Promise<any> {
    return this.request<any>(`/api/recipes/${id}`);
  }

  async createRecipe(recipe: any): Promise<any> {
    return this.request<any>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
    });
  }

  async updateRecipe(
    id: string,
    recipe: any
  ): Promise<any> {
    return this.request<any>(`/api/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipe),
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.request<void>(`/api/recipes/${id}`, {
      method: "DELETE",
    });
  }

  // OCR
  async processOCR(imageUri: string): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${baseUrl}/api/ocr`, {
      method: "POST",
      body: formData as any,
      headers,
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      if (response.status === 401) this.onUnauthorized?.();
      throw new Error("OCR failed");
    }

    return response.json();
  }
}

export const api = new ApiClient();
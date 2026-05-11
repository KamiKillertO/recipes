import * as types from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async register(username: string, password: string): Promise<types.AuthResponse> {
    const response = await this.request<types.AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(username: string, password: string): Promise<types.AuthResponse> {
    const response = await this.request<types.AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Recipes
  async getRecipes(): Promise<types.Recipe[]> {
    return this.request<types.Recipe[]>('/api/recipes');
  }

  async getRecipe(id: string): Promise<types.Recipe> {
    return this.request<types.Recipe>(`/api/recipes/${id}`);
  }

  async createRecipe(recipe: types.CreateRecipeRequest): Promise<types.Recipe> {
    return this.request<types.Recipe>('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
  }

  async updateRecipe(
    id: string,
    recipe: types.UpdateRecipeRequest
  ): Promise<types.Recipe> {
    return this.request<types.Recipe>(`/api/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipe),
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.request<void>(`/api/recipes/${id}`, {
      method: 'DELETE',
    });
  }

  // OCR
  async processOCR(imageUri: string): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/api/ocr`, {
      method: 'POST',
      body: formData as any,
      headers,
    });

    if (!response.ok) {
      throw new Error('OCR failed');
    }

    return response.json();
  }
}

export const api = new ApiClient();
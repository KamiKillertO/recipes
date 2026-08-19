import { create } from "zustand";

interface AuthState {
  user: { id: string; username: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string>;
  register: (username: string, password: string) => Promise<string>;
  logout: () => void;
  checkAuth: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");
    const { token, user } = data;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
    return token;
  },

  register: async (username: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Registration failed");
    const { token, user } = data;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
    return token;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: (token: string | null) => {
    if (token) {
      set({ token, isAuthenticated: true });
    } else {
      const stored = localStorage.getItem("auth_token");
      if (stored) {
        set({ token: stored, isAuthenticated: true });
      } else {
        set({ token: null, isAuthenticated: false });
      }
    }
  },
}));
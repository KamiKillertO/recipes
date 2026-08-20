import { create } from "zustand";
import { api } from "./api";

interface AuthUser {
  id: string;
  username: string;
  created_at: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    const response = await api.login(username, password);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    set({ token: response.token, user: response.user, isAuthenticated: true });
  },

  register: async (username: string, password: string) => {
    const response = await api.register(username, password);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    set({ token: response.token, user: response.user, isAuthenticated: true });
  },

  logout: () => {
    api.logout();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  restoreSession: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    let user: AuthUser | null = null;
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        user = JSON.parse(raw);
      } catch {
        user = null;
      }
    }
    api.setToken(token);
    set({ token, user, isAuthenticated: true });
  },
}));

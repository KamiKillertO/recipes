import { create } from 'zustand';
import { api } from '../lib/api';
import * as types from '../types';

interface AuthState {
  user: types.AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    const response = await api.login(username, password);
    api.setToken(response.token);
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
    return response.token;
  },

  register: async (username: string, password: string) => {
    const response = await api.register(username, password);
    api.setToken(response.token);
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
    return response.token;
  },

  logout: () => {
    api.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: (token: string | null) => {
    if (token) {
      api.setToken(token);
      set({ token, isAuthenticated: true });
    }
  },
}));
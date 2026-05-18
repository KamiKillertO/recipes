import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/api';
import * as types from '../types';

interface AuthState {
  user: types.AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      token: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.login(username, password);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            token: response.token,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.register(username, password);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            token: response.token,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        api.logout();
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (token) {
          api.setToken(token);
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
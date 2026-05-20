import { createContext, use, useEffect, type PropsWithChildren } from 'react';
import { useAuthStore } from './authStore';
import { useStorageState } from './useStorageState';

type AuthContextType = {
  signIn: (username: string, password: string) => Promise<string>;
  signOut: () => void;
  register: (username: string, password: string) => Promise<string>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { login, register, logout, checkAuth, isAuthenticated } = useAuthStore();
  const [[isLoading, token], setToken] = useStorageState('token');

  useEffect(() => {
    checkAuth(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username, password) => {
          const newToken = await login(username, password);
          setToken(newToken);
          return newToken;
        },
        signOut: () => {
          logout();
          setToken(null);
        },
        register: async (username, password) => {
          const newToken = await register(username, password);
          setToken(newToken);
          return newToken;
        },
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
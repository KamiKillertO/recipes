import { createContext, use, type PropsWithChildren } from 'react';
import { useAuthStore } from './authStore';

type AuthContextType = {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (username: string, password: string) => Promise<void>;
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
  const { login, register, logout, isAuthenticated } = useAuthStore();

  return (
    <AuthContext.Provider
      value={{
        signIn: login,
        signOut: logout,
        register,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
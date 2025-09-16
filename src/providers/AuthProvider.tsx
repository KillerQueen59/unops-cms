'use client';

import React, { createContext, useContext } from 'react';
import { useAuthStatus, useLogin, useLogout } from '@/hooks/useAuth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasToken: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading, hasToken } = useAuthStatus();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user: user as User | null,
    login,
    logout,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    isAuthenticated,
    hasToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;

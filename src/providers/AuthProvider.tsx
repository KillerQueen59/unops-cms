'use client';

import React, { createContext, useContext } from 'react';
import { useAuthStatus } from '@/hooks/useAuth';
import { STATIC_USER } from '@/lib/api';

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
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasToken: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading, hasToken } = useAuthStatus();

  const value: AuthContextType = {
    user: user || STATIC_USER,
    isLoading,
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

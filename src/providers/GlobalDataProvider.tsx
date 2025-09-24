'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useGlobalVillages } from '@/hooks/useGlobalVillages';

interface GlobalDataContextType {
  isInitialized: boolean;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(
  undefined
);

export function GlobalDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  // Initialize global villages when user is authenticated
  const { isLoaded } = useGlobalVillages();

  // Consider data initialized when villages are loaded
  const isInitialized = isLoaded;

  useEffect(() => {
    // This effect will trigger the global villages fetch when the user is authenticated
    // The useGlobalVillages hook will handle the actual fetching and caching
  }, [isAuthenticated]);

  const value: GlobalDataContextType = {
    isInitialized,
  };

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
}

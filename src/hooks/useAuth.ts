import { useQuery } from '@tanstack/react-query';
import { authApi, getAuthToken, STATIC_USER } from '@/lib/api';
import { useEffect, useState } from 'react';

// Auth Query Keys
export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
} as const;

// Current User Query - Always returns static user data
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: authApi.getCurrentUser,
    staleTime: Infinity, // Cache forever since we're using static data
  });
};

// Check if user has a valid token - reactive to auth changes
export const useAuthStatus = () => {
  const [token, setToken] = useState(() => getAuthToken());
  const { data: response, isLoading, error } = useCurrentUser();

  // Listen for auth changes (login/logout events)
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(getAuthToken());
    };

    // Listen for custom auth events
    window.addEventListener('auth-login', handleAuthChange);
    window.addEventListener('auth-logout', handleAuthChange);
    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-login', handleAuthChange);
      window.removeEventListener('auth-logout', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  console.log('token', token);

  // User is authenticated if they have a token
  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    user: isAuthenticated ? response?.data || STATIC_USER : null,
    isLoading,
    error: !isAuthenticated ? null : error, // Don't show errors if not authenticated
    hasToken: isAuthenticated,
  };
};

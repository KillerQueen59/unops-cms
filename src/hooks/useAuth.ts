import { useQueryClient } from '@tanstack/react-query';
import { getAuthToken, logout } from '@/lib/api';
import { useEffect, useState } from 'react';

// Simple auth status hook - just checks for token presence
export const useAuthStatus = () => {
  const [token, setToken] = useState(() => getAuthToken());

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

  // User is authenticated if they have a token
  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    user: null, // We don't fetch user data upfront
    isLoading: false, // No loading since we're not making API calls
    error: null,
    hasToken: isAuthenticated,
  };
}; // Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Clear token and dispatch event
    logout();

    // Clear all cached queries
    queryClient.clear();

    // Optionally redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return { logout: handleLogout };
};

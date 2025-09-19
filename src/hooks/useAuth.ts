import { useQuery } from '@tanstack/react-query';
import { authApi, getAuthToken, STATIC_USER } from '@/lib/api';

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

// Simplified Auth Status Hook - Always authenticated with static data
export const useAuthStatus = () => {
  const token = getAuthToken();
  const { data: response, isLoading, error } = useCurrentUser();

  return {
    isAuthenticated: true, // Always authenticated with static token
    user: response?.data || STATIC_USER,
    isLoading,
    error,
    hasToken: !!token,
  };
};

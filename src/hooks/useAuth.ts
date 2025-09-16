import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, getAuthToken } from '@/lib/api';

// Auth Query Keys
export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
  validate: (userId: string) => ['auth', 'validate', userId] as const,
} as const;

// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Invalidate and refetch user data after login
      queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.currentUser,
      });

      // Optionally set user data in cache
      if (data.data?.user) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, data.data.user);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Clear any cached auth data on error
      queryClient.removeQueries({
        queryKey: AUTH_QUERY_KEYS.currentUser,
      });
    },
  });
};

// Register Mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

// Current User Query
export const useCurrentUser = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: authApi.getCurrentUser,
    enabled: !!token, // Only run if token exists
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (
        error instanceof Error &&
        error.message.includes('Authentication failed')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Validate User Query
export const useValidateUser = (encryptedUserId: string) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.validate(encryptedUserId),
    queryFn: () => authApi.validateUser(encryptedUserId),
    enabled: !!encryptedUserId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authApi.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
};

// Auth Status Hook
export const useAuthStatus = () => {
  const token = getAuthToken();
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    isAuthenticated: !!token && !!user,
    user,
    isLoading: !!token && isLoading, // Only show loading if we have a token
    error,
    hasToken: !!token,
  };
};

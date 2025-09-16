import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  activityApi,
  transformActivityForUI,
  transformUIActivityForAPI,
} from '@/services/activityService';
import { ActivityData } from '@/types/activity';
import type {
  ActivityListParams,
  CreateActivityData,
  UpdateActivityData,
} from '@/services/activityService';

// Query keys for React Query - following best practices
export const ACTIVITY_QUERY_KEYS = {
  all: ['activities'] as const,
  lists: () => [...ACTIVITY_QUERY_KEYS.all, 'list'] as const,
  list: (params?: ActivityListParams) =>
    [...ACTIVITY_QUERY_KEYS.lists(), params] as const,
  details: () => [...ACTIVITY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ACTIVITY_QUERY_KEYS.details(), id] as const,
  categories: () => [...ACTIVITY_QUERY_KEYS.all, 'categories'] as const,
} as const;

/**
 * Hook to fetch all activities with optional filtering and pagination
 */
export const useActivities = (params?: ActivityListParams) => {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.list(params),
    queryFn: async () => {
      const response = await activityApi.getActivities(params);
      // Transform API data to UI format
      return {
        ...response,
        data: response.data.map(transformActivityForUI),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

/**
 * Hook to fetch a single activity by ID
 */
export const useActivity = (activityId: string) => {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.detail(activityId),
    queryFn: async () => {
      const response = await activityApi.getActivityById(activityId);
      return transformActivityForUI(response.data);
    },
    enabled: !!activityId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch activity categories
 */
export const useActivityCategories = () => {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.categories(),
    queryFn: () => activityApi.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes (categories don't change often)
  });
};

/**
 * Hook to create a new activity
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityData,
      files,
    }: {
      activityData: Partial<ActivityData>;
      files?: File[];
    }) => {
      const apiData = transformUIActivityForAPI(activityData);
      return activityApi.createActivity(apiData as CreateActivityData, files);
    },
    onSuccess: () => {
      // Invalidate and refetch activities lists
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to create activity:', error);
    },
  });
}; /**
 * Hook to update an existing activity
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      activityData,
      files,
    }: {
      activityId: string;
      activityData: Partial<ActivityData>;
      files?: File[];
    }) => {
      const apiData = transformUIActivityForAPI(activityData);
      return activityApi.updateActivity(
        activityId,
        apiData as UpdateActivityData,
        files
      );
    },
    onSuccess: (_, { activityId }) => {
      // Invalidate specific activity and activities lists
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_QUERY_KEYS.detail(activityId),
      });
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to update activity:', error);
    },
  });
};

/**
 * Hook to delete an activity
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) => activityApi.deleteActivity(activityId),
    onSuccess: (_, activityId) => {
      // Remove the deleted activity from cache and invalidate lists
      queryClient.removeQueries({
        queryKey: ACTIVITY_QUERY_KEYS.detail(activityId),
      });
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to delete activity:', error);
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  activityService,
  CreateActivityData,
  UpdateActivityData,
  ActivityListParams,
} from '@/services/activityService';
import { ActivityData } from '@/types/activity';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/common';

// Query Keys
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: string) => [...activityKeys.lists(), { filters }] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...activityKeys.details(), id] as const,
  categories: () => [...activityKeys.all, 'categories'] as const,
} as const;

export const useActivities = (params?: ActivityListParams) => {
  return useQuery({
    queryKey: activityKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<ActivityData>> => {
      try {
        const result = await activityService.getActivities(params);
        return result;
      } catch (error) {
        toast.error('Failed to fetch activities');
        return {
          data: [],
          totalData: 0,
          page: params?.page || 1,
          limit: params?.pageSize || 10,
          totalPages: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useActivity = (
  id: string | null,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => activityService.getActivityById(id!),
    enabled: enabled && !!id,
    refetchOnMount: 'always',
    staleTime: 0,
  });
};

export const useActivityCategories = () => {
  return useQuery({
    queryKey: activityKeys.categories(),
    queryFn: () => activityService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes (categories don't change often)
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activityData,
      files,
    }: {
      activityData: CreateActivityData;
      files?: File[];
    }) => activityService.createActivity(activityData, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      toast.success('Activity created successfully');
    },
    onError: (error) => {
      console.error('Failed to create activity:', error);
      toast.error('Failed to create activity');
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activityId,
      activityData,
      files,
    }: {
      activityId: string;
      activityData: UpdateActivityData;
      files?: File[];
    }) => activityService.updateActivity(activityId, activityData, files),
    onSuccess: (updatedActivity, { activityId }) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      queryClient.setQueryData(
        activityKeys.detail(activityId),
        updatedActivity
      );
      toast.success('Activity updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update activity:', error);
      toast.error('Failed to update activity');
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) =>
      activityService.deleteActivity(activityId),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      queryClient.removeQueries({ queryKey: activityKeys.detail(deletedId) });
      toast.success('Activity deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete activity:', error);
      toast.error('Failed to delete activity');
    },
  });
};

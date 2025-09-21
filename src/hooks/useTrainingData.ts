import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  trainingService,
  CreateTrainingData,
  UpdateTrainingData,
  PaginationParams,
  transformUITrainingForAPI,
} from '@/services/trainingService';
import { TrainingData } from '@/types/training';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/common';

// Query Keys
export const trainingKeys = {
  all: ['trainings'] as const,
  lists: () => [...trainingKeys.all, 'list'] as const,
  list: (filters: string) => [...trainingKeys.lists(), { filters }] as const,
  details: () => [...trainingKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...trainingKeys.details(), id] as const,
} as const;

export const useTrainings = (params?: PaginationParams) => {
  return useQuery({
    queryKey: trainingKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<TrainingData>> => {
      try {
        const result = await trainingService.getTrainings(params);
        return result;
      } catch (error) {
        toast.error('Failed to fetch trainings');
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

export const useTraining = (
  id: string | null,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: trainingKeys.detail(id),
    queryFn: () => trainingService.getTrainingById(id!),
    enabled: enabled && !!id,
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainingData }: { trainingData: Partial<TrainingData> }) => {
      const apiData = transformUITrainingForAPI(trainingData);
      return trainingService.createTraining(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainingData }: { trainingData: Partial<TrainingData> }) => {
      const apiData = transformUITrainingForAPI(trainingData);

      return trainingService.updateTraining(apiData, trainingData.id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trainingService.deleteTraining(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
      queryClient.removeQueries({ queryKey: trainingKeys.detail(deletedId) });
    },
  });
};

/**
 * Hook to prefetch training data (useful for hover effects, navigation)
 */
export const usePrefetchTraining = () => {
  const queryClient = useQueryClient();

  return (trainingId: string) => {
    queryClient.prefetchQuery({
      queryKey: trainingKeys.detail(trainingId),
      queryFn: () => trainingService.getTrainingById(trainingId),
      staleTime: 1000 * 60 * 5,
    });
  };
};

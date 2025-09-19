import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateTrainingData,
  TrainingData,
  TrainingFilters,
  TrainingListParams,
  UpdateTrainingData,
} from '@/types/training';
import {
  trainingApi,
  transformTrainingForUI,
  transformUITrainingForAPI,
} from '@/services/trainingService';

export const TRAINING_QUERY_KEYS = {
  all: ['trainings'] as const,
  lists: () => [...TRAINING_QUERY_KEYS.all, 'list'] as const,
  list: (params?: TrainingListParams) =>
    [...TRAINING_QUERY_KEYS.lists(), params] as const,
  details: () => [...TRAINING_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TRAINING_QUERY_KEYS.details(), id] as const,
  categories: () => [...TRAINING_QUERY_KEYS.all, 'categories'] as const,
} as const;

export function useTrainings(filters?: TrainingFilters) {
  const params: TrainingListParams = {
    search: filters?.searchQuery,
    trainingType: filters?.trainingType,
    village: filters?.village,
    startDate: filters?.startDate,
    endDate: filters?.endDate,
    page: filters?.page,
    pageSize: filters?.pageSize,
  };

  return useQuery({
    queryKey: TRAINING_QUERY_KEYS.list(params),
    queryFn: async () => {
      const response = await trainingApi.getTrainings(params);
      // Handle empty data gracefully - don't treat it as an error
      if (!response.data || response.data.length === 0) {
        return []; // Return empty array instead of throwing error
      }
      return response.data.map(transformTrainingForUI);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single training by ID
 */
export function useTraining(trainingId: string) {
  return useQuery({
    queryKey: TRAINING_QUERY_KEYS.detail(trainingId),
    queryFn: async () => {
      const response = await trainingApi.getTrainingById(trainingId);
      return transformTrainingForUI(response.data);
    },
    enabled: !!trainingId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to create a new training
 */
export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trainingData,
      files,
    }: {
      trainingData: Partial<TrainingData>;
      files?: File[];
    }) => {
      const apiData = transformUITrainingForAPI(trainingData);
      return trainingApi.createTraining(apiData as CreateTrainingData, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Failed to create training:', error);
    },
  });
}

/**
 * Hook to update an existing training
 */
export function useUpdateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trainingId,
      trainingData,
      files,
    }: {
      trainingId: string;
      trainingData: Partial<TrainingData>;
      files?: File[];
    }) => {
      const apiData = transformUITrainingForAPI(trainingData);
      return trainingApi.updateTraining(
        trainingId,
        apiData as UpdateTrainingData,
        files
      );
    },
    onSuccess: (_, { trainingId }) => {
      queryClient.invalidateQueries({
        queryKey: TRAINING_QUERY_KEYS.detail(trainingId),
      });
      queryClient.invalidateQueries({
        queryKey: TRAINING_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to update training:', error);
    },
  });
}

/**
 * Hook to delete a training
 */
export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trainingId: string) => trainingApi.deleteTraining(trainingId),
    onSuccess: (_, trainingId) => {
      queryClient.removeQueries({
        queryKey: TRAINING_QUERY_KEYS.detail(trainingId),
      });
      queryClient.invalidateQueries({
        queryKey: TRAINING_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to delete training:', error);
    },
  });
}

/**
 * Hook to prefetch training data (useful for hover effects, navigation)
 */
export function usePrefetchTraining() {
  const queryClient = useQueryClient();

  return (trainingId: string) => {
    queryClient.prefetchQuery({
      queryKey: TRAINING_QUERY_KEYS.detail(trainingId),
      queryFn: async () => {
        const response = await trainingApi.getTrainingById(trainingId);
        return transformTrainingForUI(response.data);
      },
      staleTime: 1000 * 60 * 5,
    });
  };
}

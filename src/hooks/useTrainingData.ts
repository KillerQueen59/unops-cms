import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrainingData } from '@/types/training';

// Mock API functions - replace with actual API calls
const mockApi = {
  getTrainings: async (): Promise<TrainingData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        trainingName: 'Advanced Project Management',
        trainingType: 'Online',
        startDate: '2024-08-25',
        village: 'Bandung',
        communityParticipationMale: 100,
        communityParticipationFemale: 120,
        elderlyMale: 30,
        elderlyFemale: 40,
        youthMale: 50,
        youthFemale: 60,
        disabilityMale: 10,
        disabilityFemale: 15,
        preTestScoreMale: 80,
        preTestScoreFemale: 85,
        postTestScoreMale: 90,
        postTestScoreFemale: 95,
        endDate: '2024-08-30',
      },
      {
        id: '2',
        trainingName: 'Leadership Development',
        trainingType: 'In-Person',
        startDate: '2024-09-01',
        village: 'Jakarta',
        communityParticipationMale: 150,
        communityParticipationFemale: 170,
        elderlyMale: 40,
        elderlyFemale: 50,
        youthMale: 60,
        youthFemale: 70,
        disabilityMale: 15,
        disabilityFemale: 20,
        preTestScoreMale: 85,
        preTestScoreFemale: 90,
        postTestScoreMale: 95,
        postTestScoreFemale: 100,
        endDate: '2024-10-01',
      },
    ];
  },

  createTraining: async (
    training: Omit<TrainingData, 'id'>
  ): Promise<TrainingData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      trainingName: training.trainingName as string,
      trainingType: training.trainingType as string,
      startDate: training.startDate as string,
      endDate: training.endDate as string,
      village: training.village as string,
      communityParticipationMale: training.communityParticipationMale as number,
      communityParticipationFemale:
        training.communityParticipationFemale as number,
      elderlyMale: training.elderlyMale as number,
      elderlyFemale: training.elderlyFemale as number,
      youthMale: training.youthMale as number,
      youthFemale: training.youthFemale as number,
      disabilityMale: training.disabilityMale as number,
      disabilityFemale: training.disabilityFemale as number,
      preTestScoreMale: training.preTestScoreMale as number,
      preTestScoreFemale: training.preTestScoreFemale as number,
      postTestScoreMale: training.postTestScoreMale as number,
      postTestScoreFemale: training.postTestScoreFemale as number,
    };
  },

  updateTraining: async (
    id: string,
    training: Partial<TrainingData>
  ): Promise<TrainingData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      trainingName: (training.trainingName as string) || '',
      trainingType: (training.trainingType as string) || '',
      startDate: (training.startDate as string) || '',
      endDate: (training.endDate as string) || '',
      village: (training.village as string) || '',
      communityParticipationMale:
        (training.communityParticipationMale as number) || 0,
      communityParticipationFemale:
        (training.communityParticipationFemale as number) || 0,
      elderlyMale: (training.elderlyMale as number) || 0,
      elderlyFemale: (training.elderlyFemale as number) || 0,
      youthMale: (training.youthMale as number) || 0,
      youthFemale: (training.youthFemale as number) || 0,
      disabilityMale: (training.disabilityMale as number) || 0,
      disabilityFemale: (training.disabilityFemale as number) || 0,
      preTestScoreMale: (training.preTestScoreMale as number) || 0,
      preTestScoreFemale: (training.preTestScoreFemale as number) || 0,
      postTestScoreMale: (training.postTestScoreMale as number) || 0,
      postTestScoreFemale: (training.postTestScoreFemale as number) || 0,
      ...training,
    } as TrainingData;
  },

  deleteTraining: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Query keys
export const trainingKeys = {
  all: ['trainings'] as const,
  lists: () => [...trainingKeys.all, 'list'] as const,
  list: (filters: string) => [...trainingKeys.lists(), { filters }] as const,
  details: () => [...trainingKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainingKeys.details(), id] as const,
};

// Custom hooks
export function useTrainings(filters?: string) {
  return useQuery({
    queryKey: trainingKeys.list(filters || ''),
    queryFn: () => mockApi.getTrainings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createTraining,
    onSuccess: () => {
      // Invalidate and refetch training list
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create training:', error);
    },
  });
}

export function useUpdateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingData> }) =>
      mockApi.updateTraining(id, data),
    onSuccess: (updatedTraining) => {
      // Update the cache
      queryClient.setQueryData(
        trainingKeys.detail(updatedTraining.id),
        updatedTraining
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update training:', error);
    },
  });
}

export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteTraining,
    onSuccess: () => {
      // Invalidate and refetch training list
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete training:', error);
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrainingData, TrainingFilters } from '@/types/training';

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
        date: '2024-08-25',
        village: 'Bandung',
        villageId: 'VIL001',
        // Number of beneficiaries
        male: 100,
        female: 120,
        elderly: 70,
        youth: 110,
        disability: 25,
        widow: 35,
        // Training Assessment
        pretest: 75,
        posttest: 88,
        // Stakeholders Involved
        ngo: 3,
        government: 2,
        privateSector: 1,
        academics: 2,
        localCommunity: 5,
        others: 1,
      },
      {
        id: '2',
        trainingName: 'Leadership Development',
        trainingType: 'In-Person',
        date: '2024-09-01',
        village: 'Jakarta',
        villageId: 'VIL002',
        // Number of beneficiaries
        male: 150,
        female: 170,
        elderly: 90,
        youth: 130,
        disability: 35,
        widow: 45,
        // Training Assessment
        pretest: 80,
        posttest: 92,
        // Stakeholders Involved
        ngo: 4,
        government: 3,
        privateSector: 2,
        academics: 1,
        localCommunity: 6,
        others: 2,
      },
      {
        id: '3',
        trainingName: 'Digital Literacy Workshop',
        trainingType: 'Hybrid',
        date: '2024-09-15',
        village: 'Surabaya',
        villageId: 'VIL003',
        // Number of beneficiaries
        male: 80,
        female: 95,
        elderly: 40,
        youth: 135,
        disability: 20,
        widow: 25,
        // Training Assessment
        pretest: 70,
        posttest: 85,
        // Stakeholders Involved
        ngo: 2,
        government: 1,
        privateSector: 3,
        academics: 3,
        localCommunity: 4,
        others: 1,
      },
      {
        id: '4',
        trainingName: 'Community Health Training',
        trainingType: 'In-Person',
        date: '2024-10-01',
        village: 'Yogyakarta',
        villageId: 'VIL004',
        // Number of beneficiaries
        male: 120,
        female: 140,
        elderly: 80,
        youth: 100,
        disability: 30,
        widow: 40,
        // Training Assessment
        pretest: 78,
        posttest: 90,
        // Stakeholders Involved
        ngo: 5,
        government: 4,
        privateSector: 1,
        academics: 2,
        localCommunity: 7,
        others: 0,
      },
    ];
  },

  createTraining: async (
    training: Omit<TrainingData, 'id'>
  ): Promise<TrainingData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      ...training,
    };
  },

  updateTraining: async (
    id: string,
    training: Partial<TrainingData>
  ): Promise<TrainingData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For mock purposes, return a complete TrainingData object
    // In a real API, you'd merge with existing data from the database
    return {
      id,
      trainingName: training.trainingName || '',
      trainingType: training.trainingType || '',
      date: training.date || '',
      village: training.village || '',
      villageId: training.villageId || '',
      // Number of beneficiaries
      male: training.male || 0,
      female: training.female || 0,
      elderly: training.elderly || 0,
      youth: training.youth || 0,
      disability: training.disability || 0,
      widow: training.widow || 0,
      // Training Assessment
      pretest: training.pretest || 0,
      posttest: training.posttest || 0,
      // Stakeholders Involved
      ngo: training.ngo || 0,
      government: training.government || 0,
      privateSector: training.privateSector || 0,
      academics: training.academics || 0,
      localCommunity: training.localCommunity || 0,
      others: training.others || 0,
      ...training,
    } as TrainingData;
  },

  deleteTraining: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Training with id ${id} deleted`);
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
export function useTrainings(filters?: TrainingFilters) {
  return useQuery({
    queryKey: trainingKeys.list(JSON.stringify(filters)),
    queryFn: () => mockApi.getTrainings(),
    staleTime: 5 * 60 * 1000,
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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VillageData } from '@/types/village';

// Mock API functions - replace with actual API calls
const mockApi = {
  getVillages: async (): Promise<VillageData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        villageName: 'Desa Harapan Baru',
        villageCode: 'DHB001',
        totalPopulation: 2500,
        villageAddress:
          'Jl. Harapan No. 123, Kecamatan Suka Maju, Kabupaten Sentosa',
        villageLat: -6.2088,
        villageLng: 106.8456,
        totalLandManage: 850.5,
        totalCarbonEmissions: 125.3,
        isMitigationIntervention: true,
        isAdaptationIntervention: false,
        fireIncidents: [
          { month: 'January', year: 2024, data: 2 },
          { month: 'February', year: 2024, data: 1 },
          { month: 'March', year: 2024, data: 0 },
        ],
        incomes: [
          { month: 'January', year: 2024, data: 45000000 },
          { month: 'February', year: 2024, data: 47500000 },
          { month: 'March', year: 2024, data: 52000000 },
        ],
        localInitiatives: [
          {
            month: 'January',
            year: 2024,
            stakeholder: {
              government: 3,
              localCommunity: 8,
              privateSector: 2,
              ngo: 1,
              academics: 0,
              other: 1,
            },
          },
        ],
      },
      {
        id: '2',
        villageName: 'Desa Maju Sejahtera',
        villageCode: 'DMS002',
        totalPopulation: 3200,
        villageAddress:
          'Jl. Sejahtera Raya No. 456, Kecamatan Maju Jaya, Kabupaten Makmur',
        villageLat: -6.1751,
        villageLng: 106.865,
        totalLandManage: 1200.8,
        totalCarbonEmissions: 89.7,
        isMitigationIntervention: false,
        isAdaptationIntervention: true,
        fireIncidents: [
          { month: 'January', year: 2024, data: 0 },
          { month: 'February', year: 2024, data: 1 },
          { month: 'March', year: 2024, data: 1 },
        ],
        incomes: [
          { month: 'January', year: 2024, data: 62000000 },
          { month: 'February', year: 2024, data: 65500000 },
          { month: 'March', year: 2024, data: 68000000 },
        ],
        localInitiatives: [
          {
            month: 'February',
            year: 2024,
            stakeholder: {
              government: 5,
              localCommunity: 12,
              privateSector: 4,
              ngo: 2,
              academics: 1,
              other: 0,
            },
          },
        ],
      },
      {
        id: '3',
        villageName: 'Desa Harmoni Alam',
        villageCode: 'DHA003',
        totalPopulation: 1800,
        villageAddress:
          'Jl. Harmoni Alam No. 789, Kecamatan Damai, Kabupaten Hijau',
        villageLat: -6.2297,
        villageLng: 106.8123,
        totalLandManage: 650.2,
        totalCarbonEmissions: 67.1,
        isMitigationIntervention: true,
        isAdaptationIntervention: true,
        fireIncidents: [
          { month: 'January', year: 2024, data: 1 },
          { month: 'February', year: 2024, data: 0 },
          { month: 'March', year: 2024, data: 0 },
        ],
        incomes: [
          { month: 'January', year: 2024, data: 38000000 },
          { month: 'February', year: 2024, data: 41200000 },
          { month: 'March', year: 2024, data: 43800000 },
        ],
        localInitiatives: [
          {
            month: 'March',
            year: 2024,
            stakeholder: {
              government: 2,
              localCommunity: 6,
              privateSector: 1,
              ngo: 3,
              academics: 2,
              other: 1,
            },
          },
        ],
      },
    ];
  },

  createVillage: async (
    village: Omit<VillageData, 'id'>
  ): Promise<VillageData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      ...village,
    };
  },

  updateVillage: async (
    id: string,
    village: Partial<VillageData>
  ): Promise<VillageData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      villageName: village.villageName || '',
      villageCode: village.villageCode || '',
      totalPopulation: village.totalPopulation || 0,
      villageAddress: village.villageAddress || '',
      villageLat: village.villageLat || 0,
      villageLng: village.villageLng || 0,
      totalLandManage: village.totalLandManage || 0,
      totalCarbonEmissions: village.totalCarbonEmissions || 0,
      isMitigationIntervention: village.isMitigationIntervention || false,
      isAdaptationIntervention: village.isAdaptationIntervention || false,
      fireIncidents: village.fireIncidents || [],
      incomes: village.incomes || [],
      localInitiatives: village.localInitiatives || [],
      ...village,
    } as VillageData;
  },

  deleteVillage: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Query keys
export const villageKeys = {
  all: ['villages'] as const,
  lists: () => [...villageKeys.all, 'list'] as const,
  list: (filters: string) => [...villageKeys.lists(), { filters }] as const,
  details: () => [...villageKeys.all, 'detail'] as const,
  detail: (id: string) => [...villageKeys.details(), id] as const,
};

// Custom hooks
export function useVillages(filters?: string) {
  return useQuery({
    queryKey: villageKeys.list(filters || ''),
    queryFn: () => mockApi.getVillages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateVillage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createVillage,
    onSuccess: () => {
      // Invalidate and refetch village list
      queryClient.invalidateQueries({ queryKey: villageKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create village:', error);
    },
  });
}

export function useUpdateVillage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VillageData> }) =>
      mockApi.updateVillage(id, data),
    onSuccess: (updatedVillage) => {
      // Update the cache
      queryClient.setQueryData(
        villageKeys.detail(updatedVillage.id),
        updatedVillage
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: villageKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update village:', error);
    },
  });
}

export function useDeleteVillage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteVillage,
    onSuccess: () => {
      // Invalidate and refetch village list
      queryClient.invalidateQueries({ queryKey: villageKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete village:', error);
    },
  });
}

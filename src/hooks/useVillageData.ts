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
        villageCategory: 'Category 1',
        totalPopulation: 2500,
        villageLat: -6.2088,
        villageLng: 106.8456,
        landManageStart: 850,
        landManageEnd: 920,
        carbonEmisionStart: 125,
        carbonEmisionEnd: 98,
        potency:
          'High agricultural potential with sustainable farming practices',
        climateIssue: 'Occasional flooding during rainy season',
        mainSourceOfEconomy: 'Agriculture and livestock',
        srnStatus: 'Active',
        // Category 1 fields
        incomesStart: 45000000,
        incomesEnd: 52000000,
        unsustainableLandClearings: [
          { month: 'January', year: 2024, data: 2 },
          { month: 'February', year: 2024, data: 1 },
          { month: 'March', year: 2024, data: 0 },
        ],
      },
      {
        id: '2',
        villageName: 'Desa Maju Sejahtera',
        villageCode: 'DMS002',
        villageCategory: 'Category 2',
        totalPopulation: 3200,
        villageLat: -6.1751,
        villageLng: 106.865,
        landManageStart: 1200,
        landManageEnd: 1350,
        carbonEmisionStart: 89,
        carbonEmisionEnd: 65,
        potency: 'Strong community-based economy with diverse income sources',
        climateIssue: 'Drought risk during dry season',
        mainSourceOfEconomy: 'Small business and trade',
        srnStatus: 'Active',
        // Category 2 fields
        incomes: [
          { month: 'January', year: 2024, data: 62000000 },
          { month: 'February', year: 2024, data: 65500000 },
          { month: 'March', year: 2024, data: 68000000 },
        ],
        seedCapital: 25000000,
      },
      {
        id: '3',
        villageName: 'Desa Harmoni Alam',
        villageCode: 'DHA003',
        villageCategory: 'Category 1',
        totalPopulation: 1800,
        villageLat: -6.2297,
        villageLng: 106.8123,
        landManageStart: 650,
        landManageEnd: 720,
        carbonEmisionStart: 67,
        carbonEmisionEnd: 45,
        potency: 'Eco-tourism potential with natural forest conservation',
        climateIssue: 'Deforestation pressure from surrounding areas',
        mainSourceOfEconomy: 'Forestry and eco-tourism',
        srnStatus: 'Active',
        // Category 1 fields
        incomesStart: 38000000,
        incomesEnd: 43800000,
        unsustainableLandClearings: [
          { month: 'January', year: 2024, data: 1 },
          { month: 'February', year: 2024, data: 0 },
          { month: 'March', year: 2024, data: 0 },
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

  addVillage: async (
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
      villageCategory: village.villageCategory || '',
      totalPopulation: village.totalPopulation || 0,
      villageLat: village.villageLat || 0,
      villageLng: village.villageLng || 0,
      landManageStart: village.landManageStart || 0,
      landManageEnd: village.landManageEnd,
      carbonEmisionStart: village.carbonEmisionStart || 0,
      carbonEmisionEnd: village.carbonEmisionEnd,
      potency: village.potency || '',
      climateIssue: village.climateIssue || '',
      mainSourceOfEconomy: village.mainSourceOfEconomy || '',
      srnStatus: village.srnStatus || '',
      incomesStart: village.incomesStart,
      incomesEnd: village.incomesEnd,
      unsustainableLandClearings: village.unsustainableLandClearings || [],
      incomes: village.incomes || [],
      seedCapital: village.seedCapital,
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

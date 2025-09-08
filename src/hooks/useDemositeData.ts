import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VillageData } from '@/types/village';
import { DemositeData, DemositeType } from '@/types/demosite';

// Mock API functions - replace with actual API calls
const mockApi = {
  getDemosites: async (): Promise<DemositeData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data - replace with actual API call
    return [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        header: 'Smart City Solutions',
        title: 'UrbanSync 2025',
        type: DemositeType.LocalHeroes,
        name: 'CitySync Demo',
        description:
          'A demo showcasing smart city technologies for sustainable urban living.',
        photos: [
          'https://example.com/photos/citysync1.jpg',
          'https://example.com/photos/citysync2.jpg',
        ],
        story:
          'UrbanSync 2025 integrates IoT, AI, and green tech to revolutionize city planning.',
        link: 'https://example.com/urbansync2025',
        createdAt: '2025-08-01T09:00:00Z',
        updatedAt: '2025-09-01T14:20:00Z',
        createdBy: 'admin_user_01',
        updatedBy: 'admin_user_02',
        isTop10: true,
      },
      {
        id: '223e4567-e89b-12d3-a456-426614174002',
        header: 'AI Healthcare',
        title: 'HealthBot 2025',
        type: DemositeType.StoryOfVillage,
        name: 'MediCare AI',
        description:
          'An AI-driven platform for real-time health diagnostics and monitoring.',
        photos: [
          'https://example.com/photos/healthbot1.jpg',
          'https://example.com/photos/healthbot2.jpg',
          'https://example.com/photos/healthbot3.jpg',
        ],
        story:
          'HealthBot 2025 uses AI to provide personalized healthcare solutions for patients.',
        link: 'https://example.com/healthbot2025',
        createdAt: '2025-07-15T12:00:00Z',
        updatedAt: '2025-09-02T10:10:00Z',
        createdBy: 'admin_user_03',
        updatedBy: 'admin_user_04',
        isTop10: false,
      },
      {
        id: '323e4567-e89b-12d3-a456-426614174003',
        header: 'Green Energy',
        title: 'EcoPower Demo',
        type: DemositeType.LocalHeroes,
        name: 'SolarWind 2025',
        description:
          'A demo of hybrid solar and wind energy systems for sustainable power.',
        photos: ['https://example.com/photos/ecopower1.jpg'],
        story:
          'SolarWind 2025 combines renewable energy sources for efficient power generation.',
        link: 'https://example.com/solarwind2025',
        createdAt: '2025-06-20T08:30:00Z',
        updatedAt: '2025-09-03T16:45:00Z',
        createdBy: 'admin_user_01',
        updatedBy: 'admin_user_05',
        isTop10: true,
      },
    ];
  },

  createDemosite: async (
    demosite: Omit<DemositeData, 'id'>
  ): Promise<DemositeData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      ...demosite,
    };
  },

  updateDemosite: async (
    id: string,
    demosite: Partial<DemositeData>
  ): Promise<DemositeData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      header: demosite.header || '',
      title: demosite.title || '',
      type: demosite.type || DemositeType.LocalHeroes,
      name: demosite.name || '',
      description: demosite.description || '',
      photos: demosite.photos || [],
      story: demosite.story || '',
      link: demosite.link || '',
      createdAt: demosite.createdAt || new Date().toISOString(),
      updatedAt: demosite.updatedAt || new Date().toISOString(),
      createdBy: demosite.createdBy || '',
      updatedBy: demosite.updatedBy || '',
      isTop10: demosite.isTop10 || false,
    };
  },

  deleteDemosite: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Query keys
export const demositeKeys = {
  all: ['demosites'] as const,
  lists: () => [...demositeKeys.all, 'list'] as const,
  list: (filters: string) => [...demositeKeys.lists(), { filters }] as const,
  details: () => [...demositeKeys.all, 'detail'] as const,
  detail: (id: string) => [...demositeKeys.details(), id] as const,
};

// Custom hooks
export function useDemosites(filters?: string) {
  return useQuery({
    queryKey: demositeKeys.list(filters || ''),
    queryFn: () => mockApi.getDemosites(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateDemosite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createDemosite,
    onSuccess: () => {
      // Invalidate and refetch demosite list
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create demosite:', error);
    },
  });
}

export function useUpdateDemosite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DemositeData> }) =>
      mockApi.updateDemosite(id, data),
    onSuccess: (updatedDemosite) => {
      // Update the cache
      queryClient.setQueryData(
        demositeKeys.detail(updatedDemosite.id),
        updatedDemosite
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update demosite:', error);
    },
  });
}

export function useDeleteDemosite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteDemosite,
    onSuccess: () => {
      // Invalidate and refetch demosite list
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete demosite:', error);
    },
  });
}

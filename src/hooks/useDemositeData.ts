import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  demositeService,
  CreateDemositeData,
  UpdateDemositeData,
  DemositeQueryParams,
} from '@/services/demositeService';
import { DemositeData } from '@/types/demosite';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/common';

// Query Keys
export const demositeKeys = {
  all: ['demosites'] as const,
  lists: () => [...demositeKeys.all, 'list'] as const,
  list: (filters: string) => [...demositeKeys.lists(), { filters }] as const,
  details: () => [...demositeKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...demositeKeys.details(), id] as const,
} as const;

export const useDemosites = (params?: DemositeQueryParams) => {
  return useQuery({
    queryKey: demositeKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<DemositeData>> => {
      try {
        const result = await demositeService.getDemosites(params);
        return result;
      } catch (error) {
        toast.error('Failed to fetch demosites');
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

export const useDemosite = (
  id: string | null,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: demositeKeys.detail(id),
    queryFn: () => demositeService.getDemositeById(id!),
    enabled: enabled && !!id,
  });
};

export const useCreateDemosite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ demositeData }: { demositeData: CreateDemositeData }) =>
      demositeService.createDemosite(demositeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
    },
  });
};

export const useUpdateDemosite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ demositeData }: { demositeData: UpdateDemositeData }) =>
      demositeService.updateDemosite(demositeData),
    onSuccess: (updatedDemosite) => {
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
      queryClient.setQueryData(
        demositeKeys.detail(updatedDemosite.id),
        updatedDemosite
      );
    },
  });
};

export const useDeleteDemosite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => demositeService.deleteDemosite(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
      queryClient.removeQueries({ queryKey: demositeKeys.detail(deletedId) });
    },
  });
};

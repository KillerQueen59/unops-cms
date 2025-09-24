/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  villagerService,
  CreateVillagerData,
  UpdateVillagerData,
  VillagerListParams,
  Villager,
} from '@/services/villagerService';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/common';

// Query Keys
export const villagerKeys = {
  all: ['villagers'] as const,
  lists: () => [...villagerKeys.all, 'list'] as const,
  list: (filters: string) => [...villagerKeys.lists(), { filters }] as const,
  details: () => [...villagerKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...villagerKeys.details(), id] as const,
} as const;

export const useVillagers = (params?: VillagerListParams) => {
  return useQuery({
    queryKey: villagerKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<Villager>> => {
      try {
        const result = await villagerService.getVillagers(params);
        return result;
      } catch (error) {
        toast.error('Failed to fetch villagers');
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

export const useVillager = (
  id: string | null,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: villagerKeys.detail(id),
    queryFn: () => villagerService.getVillagerById(id!),
    enabled: enabled && !!id,
    refetchOnMount: 'always',
    staleTime: 0,
  });
};

export const useCreateVillager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (villagerData: CreateVillagerData) =>
      villagerService.createVillager(villagerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: villagerKeys.lists() });
      toast.success('Villager added successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to add villager');
    },
  });
};

export const useUpdateVillager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      villagerData,
    }: {
      id: string;
      villagerData: UpdateVillagerData;
    }) => villagerService.updateVillager(id, villagerData),
    onSuccess: (updatedVillager) => {
      queryClient.invalidateQueries({ queryKey: villagerKeys.lists() });
      queryClient.setQueryData(
        villagerKeys.detail(updatedVillager._id),
        updatedVillager
      );
      toast.success('Villager updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update villager');
    },
  });
};

export const useDeleteVillager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => villagerService.deleteVillager(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: villagerKeys.lists() });
      queryClient.removeQueries({ queryKey: villagerKeys.detail(deletedId) });
      toast.success('Villager deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete villager');
    },
  });
};

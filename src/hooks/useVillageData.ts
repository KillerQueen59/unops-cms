import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  villageService,
  CreateVillageData,
  UpdateVillageData,
  CreateMonthlyDataRequest,
  CreateIncomeRequest,
  PaginationParams,
  CreateBulkIncomeRequest,
} from '@/services/villageService';
import { VillageData } from '@/types/village';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/common';

// Query Keys
export const villageKeys = {
  all: ['villages'] as const,
  lists: () => [...villageKeys.all, 'list'] as const,
  list: (filters: string) => [...villageKeys.lists(), { filters }] as const,
  details: () => [...villageKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...villageKeys.details(), id] as const,
  unsustainableLand: (villageId: string) =>
    [...villageKeys.all, 'unsustainable-land', villageId] as const,
  incomeTracking: (villageId: string) =>
    [...villageKeys.all, 'income-tracking', villageId] as const,
} as const;

export const useVillages = (params?: PaginationParams) => {
  return useQuery({
    queryKey: villageKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<VillageData>> => {
      try {
        const result = await villageService.getVillages(params);
        return result;
      } catch (error) {
        toast.error('Failed to fetch villages');
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

export const useVillage = (
  id: string | null,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: villageKeys.detail(id),
    queryFn: () => villageService.getVillageById(id!),
    enabled: enabled && !!id,
  });
};

export const useCreateVillage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ villageData }: { villageData: CreateVillageData }) =>
      villageService.createVillage(villageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: villageKeys.lists() });
    },
  });
};

export const useUpdateVillage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ villageData }: { villageData: UpdateVillageData }) =>
      villageService.updateVillage(villageData),
    onSuccess: (updatedVillage) => {
      queryClient.invalidateQueries({ queryKey: villageKeys.lists() });
      queryClient.setQueryData(
        villageKeys.detail(updatedVillage.id),
        updatedVillage
      );
    },
  });
};

export const useDeleteVillage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => villageService.deleteVillage(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: villageKeys.lists() });
      queryClient.removeQueries({ queryKey: villageKeys.detail(deletedId) });
    },
  });
};

// Category 1: Unsustainable Land Hooks
export const useUnsustainableLandData = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ['unsustainable-land', params],
    queryFn: () => villageService.getUnsustainableLandData(params),
  });
};

export const useAddUnsustainableLandData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMonthlyDataRequest) =>
      villageService.addUnsustainableLandData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unsustainable-land'],
      });
    },
  });
};

export const useUpdateUnsustainableLandData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      unsustainableLandId,
      data,
    }: {
      unsustainableLandId: string;
      data: CreateMonthlyDataRequest;
    }) => villageService.updateUnsustainableLandData(unsustainableLandId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unsustainable-land'],
      });
    },
  });
};

export const useDeleteUnsustainableLandData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unsustainableLandId: string) =>
      villageService.deleteUnsustainableLandData(unsustainableLandId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unsustainable-land'],
      });
    },
  });
};

// Category 2: Income Tracking Hooks
export const useIncomeTrackingData = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ['income-tracking', params],
    queryFn: () => villageService.getIncomeTrackingData(params),
  });
};

export const useAddIncomeTrackingData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBulkIncomeRequest) =>
      villageService.addIncomeTrackingData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['income-tracking'],
      });
    },
  });
};

export const useUpdateIncomeTrackingData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incomeId,
      data,
    }: {
      incomeId: string;
      data: CreateIncomeRequest;
    }) => villageService.updateIncomeTrackingData(incomeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['income-tracking'],
      });
    },
  });
};

export const useDeleteIncomeTrackingData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incomeId: string) =>
      villageService.deleteIncomeTrackingData(incomeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['income-tracking'],
      });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  villageService,
  CreateVillageData,
  UpdateVillageData,
  CreateMonthlyDataRequest,
  CreateIncomeRequest,
  PaginationParams,
  PaginatedResponse,
} from '@/services/villageService';
import { VillageData } from '@/types/village';

// Query Keys
export const villageKeys = {
  all: ['villages'] as const,
  lists: () => [...villageKeys.all, 'list'] as const,
  list: (filters: string) => [...villageKeys.lists(), { filters }] as const,
  details: () => [...villageKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...villageKeys.details(), id] as const,
  // Category-specific data
  unsustainableLand: (villageId: string) =>
    [...villageKeys.all, 'unsustainable-land', villageId] as const,
  incomeTracking: (villageId: string) =>
    [...villageKeys.all, 'income-tracking', villageId] as const,
} as const;

// Village CRUD Hooks
export const useVillages = (params?: PaginationParams) => {
  return useQuery({
    queryKey: villageKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<VillageData>> => {
      try {
        const result = await villageService.getVillages(params);
        console.log('Fetched villages:', result);
        return result;
      } catch (error) {
        console.error('Failed to fetch villages:', error);
        // Return empty paginated response on error to prevent crashes
        return {
          data: [],
          totalData: 0,
          page: params?.page || 1,
          limit: params?.pageSize || 10,
          totalPages: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
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
    mutationFn: ({
      villageData,
      files,
    }: {
      villageData: UpdateVillageData;
      files?: File[];
    }) => villageService.updateVillage(villageData, files),
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
    mutationFn: (data: CreateIncomeRequest) =>
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

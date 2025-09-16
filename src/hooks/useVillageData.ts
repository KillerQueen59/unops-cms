import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  villageService,
  CreateVillageData,
  UpdateVillageData,
  UnsustainableLandData,
  IncomeTrackingData,
} from '@/services/villageService';

// Query Keys
export const villageKeys = {
  all: ['villages'] as const,
  lists: () => [...villageKeys.all, 'list'] as const,
  list: (filters: string) => [...villageKeys.lists(), { filters }] as const,
  details: () => [...villageKeys.all, 'detail'] as const,
  detail: (id: string) => [...villageKeys.details(), id] as const,
  // Category-specific data
  unsustainableLand: (villageId: string) =>
    [...villageKeys.all, 'unsustainable-land', villageId] as const,
  incomeTracking: (villageId: string) =>
    [...villageKeys.all, 'income-tracking', villageId] as const,
} as const;

// Village CRUD Hooks
export const useVillages = () => {
  return useQuery({
    queryKey: villageKeys.lists(),
    queryFn: villageService.getVillages,
  });
};

export const useVillage = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: villageKeys.detail(id),
    queryFn: () => villageService.getVillageById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateVillage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      villageData,
      files,
    }: {
      villageData: CreateVillageData;
      files?: File[];
    }) => villageService.createVillage(villageData, files),
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
export const useUnsustainableLandData = () => {
  return useQuery({
    queryKey: ['unsustainable-land'],
    queryFn: villageService.getUnsustainableLandData,
  });
};

export const useAddUnsustainableLandData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnsustainableLandData) =>
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
      data: Partial<UnsustainableLandData>;
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
export const useIncomeTrackingData = () => {
  return useQuery({
    queryKey: ['income-tracking'],
    queryFn: villageService.getIncomeTrackingData,
  });
};

export const useAddIncomeTrackingData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IncomeTrackingData) =>
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
      data: Partial<IncomeTrackingData>;
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

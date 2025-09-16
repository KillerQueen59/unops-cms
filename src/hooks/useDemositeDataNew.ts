import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  demositeService,
  CreateDemositeData,
  UpdateDemositeData,
  DemositeQueryParams,
} from '@/services/demositeService';

// Query Keys
export const demositeKeys = {
  all: ['demosites'] as const,
  lists: () => [...demositeKeys.all, 'list'] as const,
  list: (params: DemositeQueryParams) =>
    [...demositeKeys.lists(), params] as const,
  details: () => [...demositeKeys.all, 'detail'] as const,
  detail: (id: string) => [...demositeKeys.details(), id] as const,
} as const;

// Demosite CRUD Hooks
export const useDemosites = (params?: DemositeQueryParams) => {
  return useQuery({
    queryKey: demositeKeys.list(params || {}),
    queryFn: () => demositeService.getDemosites(params),
  });
};

export const useDemosite = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: demositeKeys.detail(id),
    queryFn: () => demositeService.getDemositeById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateDemosite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (demositeData: CreateDemositeData) =>
      demositeService.createDemosite(demositeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: demositeKeys.lists() });
    },
  });
};

export const useUpdateDemosite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (demositeData: UpdateDemositeData) =>
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

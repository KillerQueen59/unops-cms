import { useQuery } from '@tanstack/react-query';
import { roleService, RolePaginationParams } from '@/services/roleService';
import { Role } from '@/types/role';
import { PaginatedResponse } from '@/types/common';
import toast from 'react-hot-toast';

// Query Keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: string) => [...roleKeys.lists(), { filters }] as const,
} as const;

// React Query hooks
export const useRoles = (params?: RolePaginationParams) => {
  return useQuery({
    queryKey: roleKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<Role>> => {
      try {
        const result = await roleService.getRoles(params);
        return result;
      } catch {
        toast.error('Failed to fetch roles');
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

export const useAllRoles = () => {
  return useQuery({
    queryKey: roleKeys.list('all'),
    queryFn: async (): Promise<Role[]> => {
      try {
        return await roleService.getAllRoles();
      } catch {
        toast.error('Failed to fetch roles');
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import { Role, RoleApiResponse } from '@/types/role';

// Pagination interfaces
export interface RolePaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
}

// Role service methods
export const roleService = {
  getRoles: async (
    params?: RolePaginationParams
  ): Promise<PaginatedResponse<Role>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const response = await apiClient.get<RoleApiResponse>(
        `/role/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      );

      // response should be the full RoleApiResponse structure
      const roles = response.data?.roles || [];
      const totalData = response.data?.totalData || 0;

      return {
        data: roles.map((role) => ({
          id: role._id,
          name: role.name,
          description: role.description,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        })),
        totalData,
        page: params?.page || 1,
        limit: params?.pageSize || totalData,
        totalPages: Math.ceil(totalData / (params?.pageSize || totalData || 1)),
      };
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await roleService.getRoles({ pageSize: 100 }); // Get all roles
      return response.data;
    } catch (error) {
      console.error('Error fetching all roles:', error);
      return [];
    }
  },
};

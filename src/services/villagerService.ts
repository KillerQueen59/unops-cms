import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';

// Villager interfaces
export interface Villager {
  _id: string;
  name: string;
  nik: string;
  villageId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVillagerData {
  villageId: string;
  name: string;
  nik: string;
}

export interface UpdateVillagerData {
  villageId?: string;
  name?: string;
  nik?: string;
}

export interface VillagerListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  villageId?: string;
  search?: string;
}

// API Response interfaces
interface VillagerApiResponse {
  status: boolean;
  message: string;
  data: {
    villagers: Villager[];
    totalData: number;
  };
}

// Villager API Service
export const villagerService = {
  async getVillagers(
    params?: VillagerListParams
  ): Promise<PaginatedResponse<Villager>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.villageId) queryParams.append('villageId', params.villageId);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/villager/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<VillagerApiResponse>(url);

      if (response.status && response.data?.villagers) {
        const villagers = response.data.villagers;
        const totalData = response.data.totalData || villagers.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;

        return {
          data: villagers,
          totalData,
          page,
          limit: pageSize,
          totalPages: Math.ceil(totalData / pageSize),
        };
      }

      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Failed to fetch villagers:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    }
  },

  async getVillagerById(id: string): Promise<Villager> {
    try {
      const response = await apiClient.get<{
        status: boolean;
        message: string;
        data: Villager;
      }>(`/villager/${id}`);

      if (response.status && response.data) {
        return response.data;
      }
      throw new Error('Villager not found');
    } catch (error) {
      console.error('Failed to fetch villager by ID:', error);
      throw error;
    }
  },

  async createVillager(villagerData: CreateVillagerData): Promise<Villager> {
    return await apiClient.post<Villager>('/villager', villagerData);
  },

  async updateVillager(
    id: string,
    villagerData: UpdateVillagerData
  ): Promise<Villager> {
    return await apiClient.put<Villager>(`/villager/${id}`, villagerData);
  },

  async deleteVillager(id: string): Promise<void> {
    await apiClient.delete(`/villager/${id}`);
  },
};

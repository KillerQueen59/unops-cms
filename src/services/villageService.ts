import { apiClient } from '@/lib/api';
import { VillageData } from '@/types/village';

// Village API interfaces
export interface CreateVillageData {
  name: string;
  id: string;
  category?: string;
  // totalPopulation: number;
  latitude: string;
  longitude: string;
  startLandManaged: number;
  endLandManaged?: number;
  startCarbonEmission: number;
  endCarbonEmission?: number;
  potency?: string;
  climateIssue?: string;
  sourceEconomy?: string;
  srnStatus?: string;
  // Category 1 fields
  startIncome?: number;
  endIncome?: number;
  // Category 2 fields
  seedCapital?: number;
  categoryId: string;
}

export interface UpdateVillageData extends CreateVillageData {
  id: string;
}

export interface MonthlyData {
  _id?: string;
  id?: number;
  villageId?: string;
  month: string;
  date: string;
  count: number;
}

export interface UnsustainableLandData {
  unsustainableLands?: MonthlyData[];
  totalData?: number;
}

export interface CreateMonthlyDataRequest {
  villageId: string;
  month: string;
  count: number;
}

export interface UnsustainableLandApiResponse {
  status: boolean;
  message: string;
  data: UnsustainableLandData;
}

export interface IncomeTrackingData {
  _id?: string; // Optional for create operations, present for updates/deletes
  villageId: string;
  month: string; // Format: "MM-YYYY" (e.g., "09-2025")
  count: number;
}

export interface IncomeApiResponse {
  status: boolean;
  message: string;
  data: {
    incomes: IncomeTrackingData[];
  };
  totalData: number;
}

export interface CreateIncomeRequest {
  villageId: string;
  month: string; // Format: "MM-YYYY"
  income: number;
}

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalData: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response interfaces
interface VillageApiResponse {
  status: boolean;
  message: string;
  data: {
    villages: Array<{
      _id: string;
      id: string;
      longitude: number;
      latitude: number;
      name: string;
      category?: string;
      startLandManaged?: number;
      endLandManaged?: number;
      startCarbonEmission?: number;
      endCarbonEmission?: number;
      potency?: string;
      climateIssue?: string;
      sourceEconomy?: string;
      srnStatus?: string;
      startIncome?: number;
      endIncome?: number;
      seedCapital?: number;
    }>;
    totalData: number;
  };
}

// Transform API response to our internal format
const transformVillageFromAPI = (
  apiVillage: VillageApiResponse['data']['villages'][0]
): VillageData => {
  return {
    id: apiVillage._id,
    villageName: apiVillage.name || '',
    villageCode: apiVillage.id || '',
    villageCategory: apiVillage.category || '',
    totalPopulation: 0, // Default value since not in API response yet
    villageLat: apiVillage.latitude || 0,
    villageLng: apiVillage.longitude || 0,
    landManageStart: apiVillage.startLandManaged || 0,
    landManageEnd: apiVillage.endLandManaged,
    carbonEmisionStart: apiVillage.startCarbonEmission || 0,
    carbonEmisionEnd: apiVillage.endCarbonEmission,
    potency: apiVillage.potency || '',
    climateIssue: apiVillage.climateIssue || '',
    mainSourceOfEconomy: apiVillage.sourceEconomy || '',
    srnStatus: apiVillage.srnStatus || '',
    incomesStart: apiVillage.startIncome,
    incomesEnd: apiVillage.endIncome,
    seedCapital: apiVillage.seedCapital,
    unsustainableLandClearings: [],
    incomes: [],
  };
};

// Village API Service
export const villageService = {
  async getVillages(
    params?: PaginationParams
  ): Promise<PaginatedResponse<VillageData>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.categoryId)
        queryParams.append('categoryId', params.categoryId);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const url = `/village/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<VillageApiResponse>(url);

      if (response.status && response.data?.villages) {
        const villages = response.data.villages.map(transformVillageFromAPI);
        const totalData = response.data.totalData || villages.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;

        return {
          data: villages,
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
      console.error('Failed to fetch villages:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    }
  },

  async getVillageById(id: string): Promise<VillageData> {
    try {
      const response = await apiClient.get<{
        status: boolean;
        message: string;
        data: VillageApiResponse['data']['villages'][0];
      }>(`/village/${id}`);

      if (response.status && response.data) {
        return transformVillageFromAPI(response.data);
      }
      throw new Error('Village not found');
    } catch (error) {
      console.error('Failed to fetch village by ID:', error);
      throw error;
    }
  },

  async createVillage(villageData: CreateVillageData): Promise<VillageData> {
    return await apiClient.post<VillageData>('/village', villageData);
  },

  async updateVillage(villageData: UpdateVillageData): Promise<VillageData> {
    return await apiClient.put<VillageData>(
      `/village/${villageData.id}`,
      villageData
    );
  },

  async deleteVillage(id: string): Promise<void> {
    await apiClient.delete(`/village/${id}`);
  },

  // Category 1: Unsustainable Land operations using "🌱 Monthly Unsustainable Land" collection

  async getUnsustainableLandData(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
  }): Promise<UnsustainableLandApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `/village/unsustainableland/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<UnsustainableLandApiResponse>(url);
  },

  async addUnsustainableLandData(
    data: CreateMonthlyDataRequest
  ): Promise<UnsustainableLandData> {
    return await apiClient.post<UnsustainableLandData>(
      '/village/unsustainableLand',
      data
    );
  },

  async updateUnsustainableLandData(
    unsustainableLandId: string,
    data: CreateMonthlyDataRequest
  ): Promise<UnsustainableLandData> {
    return await apiClient.put<UnsustainableLandData>(
      `/village/unsustainableLand/${unsustainableLandId}`,
      data
    );
  },

  async deleteUnsustainableLandData(
    unsustainableLandId: string
  ): Promise<void> {
    await apiClient.delete(`/village/unsustainableland/${unsustainableLandId}`);
  },

  // Category 2: Income Tracking operations using "💰 Monthly Income Tracking" collection

  async getIncomeTrackingData(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
  }): Promise<IncomeApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `/village/income/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<IncomeApiResponse>(url);
  },

  async addIncomeTrackingData(
    data: CreateIncomeRequest
  ): Promise<IncomeTrackingData> {
    return await apiClient.post<IncomeTrackingData>('/village/income', data);
  },

  async updateIncomeTrackingData(
    incomeId: string,
    data: CreateIncomeRequest
  ): Promise<IncomeTrackingData> {
    return await apiClient.put<IncomeTrackingData>(
      `/village/income/${incomeId}`,
      data
    );
  },

  async deleteIncomeTrackingData(incomeId: string): Promise<void> {
    await apiClient.delete(`/village/income/${incomeId}`);
  },
};

// Helper function to transform UI data to API format
export const transformUIVillageForAPI = (
  village: Partial<VillageData>
): UpdateVillageData => {
  return {
    id: village.villageCode || '',
    name: village.villageName || '',
    category: village.villageCategory || '',
    latitude: village.villageLat?.toString() || '0',
    longitude: village.villageLng?.toString() || '0',
    startLandManaged: village.landManageStart || 0,
    endLandManaged: village.landManageEnd,
    startCarbonEmission: village.carbonEmisionStart || 0,
    endCarbonEmission: village.carbonEmisionEnd,
    potency: village.potency || '',
    climateIssue: village.climateIssue || '',
    sourceEconomy: village.mainSourceOfEconomy || '',
    srnStatus: village.srnStatus || '',
    // Category specific fields
    startIncome: village.incomesStart,
    endIncome: village.incomesEnd,
    seedCapital: village.seedCapital,

    categoryId: village.villageCategory || '',
  };
};

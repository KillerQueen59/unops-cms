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
  incomesStart?: number;
  incomesEnd?: number;
  // Category 2 fields
  seedCapital?: number;
  categoryId: string;
}

export interface UpdateVillageData extends CreateVillageData {
  id: string;
}

// Monthly data interfaces for category-specific endpoints
export interface UnsustainableLandData {
  id?: string; // Optional for create operations, present for updates/deletes
  villageId: string;
  month: number;
  year: number;
  unsustainableLand: number;
}

export interface IncomeTrackingData {
  id?: string; // Optional for create operations, present for updates/deletes
  villageId: string;
  month: number;
  year: number;
  income: number;
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
  // Basic Village CRUD operations using "🏘️ Villages" collection

  async getVillages(): Promise<VillageData[]> {
    try {
      const response = await apiClient.get<VillageApiResponse>('/village/all');
      if (response.status && response.data?.villages) {
        return response.data.villages.map(transformVillageFromAPI);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch villages:', error);
      return [];
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

  async updateVillage(
    villageData: UpdateVillageData,
    files?: File[]
  ): Promise<VillageData> {
    const formData = createVillageFormData(villageData, files);
    return await apiClient.put<VillageData>(
      `/village/${villageData.id}`,
      formData
    );
  },

  async deleteVillage(id: string): Promise<void> {
    await apiClient.delete(`/village/${id}`);
  },

  // Category 1: Unsustainable Land operations using "🌱 Monthly Unsustainable Land" collection

  async getUnsustainableLandData(): Promise<UnsustainableLandData[]> {
    return await apiClient.get<UnsustainableLandData[]>(
      '/village/monthly-unsustainable-land/all'
    );
  },

  async addUnsustainableLandData(
    data: UnsustainableLandData
  ): Promise<UnsustainableLandData> {
    return await apiClient.post<UnsustainableLandData>(
      '/village/monthly-unsustainable-land',
      data
    );
  },

  async updateUnsustainableLandData(
    unsustainableLandId: string,
    data: Partial<UnsustainableLandData>
  ): Promise<UnsustainableLandData> {
    return await apiClient.put<UnsustainableLandData>(
      `/village/monthly-unsustainable-land/${unsustainableLandId}`,
      data
    );
  },

  async deleteUnsustainableLandData(
    unsustainableLandId: string
  ): Promise<void> {
    await apiClient.delete(
      `/village/monthly-unsustainable-land/${unsustainableLandId}`
    );
  },

  // Category 2: Income Tracking operations using "💰 Monthly Income Tracking" collection

  async getIncomeTrackingData(): Promise<IncomeTrackingData[]> {
    return await apiClient.get<IncomeTrackingData[]>(
      '/village/monthly-income/all'
    );
  },

  async addIncomeTrackingData(
    data: IncomeTrackingData
  ): Promise<IncomeTrackingData> {
    return await apiClient.post<IncomeTrackingData>(
      '/village/monthly-income',
      data
    );
  },

  async updateIncomeTrackingData(
    incomeId: string,
    data: Partial<IncomeTrackingData>
  ): Promise<IncomeTrackingData> {
    return await apiClient.put<IncomeTrackingData>(
      `/village/monthly-income/${incomeId}`,
      data
    );
  },

  async deleteIncomeTrackingData(incomeId: string): Promise<void> {
    await apiClient.delete(`/village/monthly-income/${incomeId}`);
  },
};

// Helper function to transform UI data to API format
export const transformUIVillageForAPI = (
  village: Partial<VillageData>
): UpdateVillageData => {
  return {
    id: village.id || '',
    name: village.villageName || '',
    areaId: village.villageCode || '',
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
    incomesStart: village.incomesStart,
    incomesEnd: village.incomesEnd,
    seedCapital: village.seedCapital,

    categoryId: '68c687806fe5698b8689b060',
  };
};

// Helper function to create FormData for village operations
export const createVillageFormData = (
  data: CreateVillageData | UpdateVillageData,
  files?: File[]
): FormData => {
  const formData = new FormData();

  // Basic fields
  if (data.name) formData.append('name', data.name);
  if (data.areaId) formData.append('areaId', data.areaId);
  if (data.category) formData.append('category', data.category);
  if (data.latitude) formData.append('latitude', data.latitude);
  if (data.longitude) formData.append('longitude', data.longitude);
  formData.append('startLandManaged', data.startLandManaged.toString());
  if (data.endLandManaged !== undefined) {
    formData.append('endLandManaged', data.endLandManaged.toString());
  }
  formData.append('startCarbonEmission', data.startCarbonEmission.toString());
  if (data.endCarbonEmission !== undefined) {
    formData.append('endCarbonEmission', data.endCarbonEmission.toString());
  }
  if (data.potency) formData.append('potency', data.potency);
  if (data.climateIssue) formData.append('climateIssue', data.climateIssue);
  if (data.sourceEconomy) formData.append('sourceEconomy', data.sourceEconomy);
  if (data.srnStatus) formData.append('srnStatus', data.srnStatus);

  // Category specific fields
  if (data.incomesStart !== undefined) {
    formData.append('incomesStart', data.incomesStart.toString());
  }
  if (data.incomesEnd !== undefined) {
    formData.append('incomesEnd', data.incomesEnd.toString());
  }
  if (data.seedCapital !== undefined) {
    formData.append('seedCapital', data.seedCapital.toString());
  }
  if (data.categoryId) formData.append('categoryId', data.categoryId);

  // File handling
  if (files) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  return formData;
};

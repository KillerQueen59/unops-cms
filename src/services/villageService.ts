import { apiClient } from '@/lib/api';
import { VillageData } from '@/types/village';

// Village API interfaces
export interface CreateVillageData {
  villageName: string;
  villageCode: string;
  villageCategory: string;
  totalPopulation: number;
  villageLat: number;
  villageLng: number;
  landManageStart: number;
  landManageEnd?: number;
  carbonEmisionStart: number;
  carbonEmisionEnd?: number;
  potency: string;
  climateIssue: string;
  mainSourceOfEconomy: string;
  srnStatus: string;
  // Category 1 fields
  incomesStart?: number;
  incomesEnd?: number;
  // Category 2 fields
  seedCapital?: number;
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

// Village API Service
export const villageService = {
  // Basic Village CRUD operations using "🏘️ Villages" collection

  async getVillages(): Promise<VillageData[]> {
    return await apiClient.get<VillageData[]>('/village');
  },

  async getVillageById(id: string): Promise<VillageData> {
    return await apiClient.get<VillageData>(`/village/${id}`);
  },

  async createVillage(
    villageData: CreateVillageData,
    files?: File[]
  ): Promise<VillageData> {
    const formData = createVillageFormData(villageData, files);
    return await apiClient.post<VillageData>('/village', formData);
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
    villageName: village.villageName || '',
    villageCode: village.villageCode || '',
    villageCategory: village.villageCategory || '',
    totalPopulation: village.totalPopulation || 0,
    villageLat: village.villageLat || 0,
    villageLng: village.villageLng || 0,
    landManageStart: village.landManageStart || 0,
    landManageEnd: village.landManageEnd,
    carbonEmisionStart: village.carbonEmisionStart || 0,
    carbonEmisionEnd: village.carbonEmisionEnd,
    potency: village.potency || '',
    climateIssue: village.climateIssue || '',
    mainSourceOfEconomy: village.mainSourceOfEconomy || '',
    srnStatus: village.srnStatus || '',
    // Category specific fields
    incomesStart: village.incomesStart,
    incomesEnd: village.incomesEnd,
    seedCapital: village.seedCapital,
  };
};

// Helper function to create FormData for village operations
export const createVillageFormData = (
  data: CreateVillageData | UpdateVillageData,
  files?: File[]
): FormData => {
  const formData = new FormData();

  // Basic fields
  if (data.villageName) formData.append('villageName', data.villageName);
  if (data.villageCode) formData.append('villageCode', data.villageCode);
  if (data.villageCategory)
    formData.append('villageCategory', data.villageCategory);
  formData.append('totalPopulation', data.totalPopulation.toString());
  formData.append('villageLat', data.villageLat.toString());
  formData.append('villageLng', data.villageLng.toString());
  formData.append('landManageStart', data.landManageStart.toString());
  if (data.landManageEnd !== undefined) {
    formData.append('landManageEnd', data.landManageEnd.toString());
  }
  formData.append('carbonEmisionStart', data.carbonEmisionStart.toString());
  if (data.carbonEmisionEnd !== undefined) {
    formData.append('carbonEmisionEnd', data.carbonEmisionEnd.toString());
  }
  if (data.potency) formData.append('potency', data.potency);
  if (data.climateIssue) formData.append('climateIssue', data.climateIssue);
  if (data.mainSourceOfEconomy)
    formData.append('mainSourceOfEconomy', data.mainSourceOfEconomy);
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

  // File handling
  if (files) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  return formData;
};

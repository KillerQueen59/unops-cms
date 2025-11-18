import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import { DemositeData } from '@/types/demosite';

// Demosite API interfaces based on Postman collection
export interface CreateDemositeData {
  header: File;
  title: string;
  name: string;
  story: string;
  link?: string;
  photos?: File[];
}

export interface UpdateDemositeData {
  id: string;
  header?: File;
  title: string;
  name: string;
  story: string;
  link?: string;
  photos?: File[];
  existingPhotoUrls?: string[];
}

// Query parameters for getting demosites
export interface DemositeQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
}

// API Response interfaces
interface DemositeApiResponse {
  status: boolean;
  message: string;
  data: {
    demosites: Array<{
      _id: string;
      header: string;
      title: string;
      name: string;
      story: string;
      link: string;
      photos?: string[];
    }>;
    totalData: number;
    page: number;
    totalPages: number;
  };
}

// Transform API response to our internal format
const transformDemositeFromAPI = (
  apiDemosite: DemositeApiResponse['data']['demosites'][0]
): DemositeData => {
  return {
    id: apiDemosite._id,
    header: apiDemosite.header || '',
    title: apiDemosite.title || '',
    name: apiDemosite.name || '',
    story: apiDemosite.story || '',
    link: apiDemosite.link || '',
    photos: apiDemosite.photos || [],
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: '',
    description: '',
    isTop10: false,
  };
};

// Demosite API Service
export const demositeService = {
  // Get all demosites with optional filtering
  async getDemosites(
    params?: DemositeQueryParams
  ): Promise<PaginatedResponse<DemositeData>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      // Always add sortBy for consistent results
      queryParams.append('sortBy', params?.sortBy || 'createdAt');
      if (params?.search) queryParams.append('search', params.search);

      const url = `/demosite/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<DemositeApiResponse>(url);

      if (response.status && response.data?.demosites) {
        const demosites = response.data.demosites.map(transformDemositeFromAPI);
        const totalData = response.data.totalData || 0;
        const page = response.data.page || params?.page || 1;
        const pageSize = params?.pageSize || 16;
        const totalPages =
          response.data.totalPages || Math.ceil(totalData / pageSize);

        return {
          data: demosites,
          totalData,
          page,
          limit: pageSize,
          totalPages,
        };
      }

      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 16,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Failed to fetch demosites:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 16,
        totalPages: 0,
      };
    }
  },

  // Get demosite by ID
  async getDemositeById(id: string): Promise<DemositeData> {
    try {
      const response = await apiClient.get<{
        status: boolean;
        message: string;
        data: DemositeApiResponse['data']['demosites'][0];
      }>(`/demosite/${id}`);

      if (response.status && response.data) {
        return transformDemositeFromAPI(response.data);
      }
      throw new Error('Demosite not found');
    } catch (error) {
      console.error('Failed to fetch demosite by ID:', error);
      throw error;
    }
  },

  // Create new demosite with file upload support
  async createDemosite(
    demositeData: CreateDemositeData
  ): Promise<DemositeData> {
    const formData = createDemositeFormData(demositeData);
    return await apiClient.post<DemositeData>('/demosite', formData);
  },

  // Update existing demosite with file upload support
  async updateDemosite(
    demositeData: UpdateDemositeData
  ): Promise<DemositeData> {
    const formData = createDemositeFormData(demositeData);
    return await apiClient.put<DemositeData>(
      `/demosite/${demositeData.id}`,
      formData
    );
  },

  // Delete demosite
  async deleteDemosite(id: string): Promise<void> {
    await apiClient.delete(`/demosite/${id}`);
  },
};

// Helper function to create FormData for demosite operations
export const createDemositeFormData = (
  data: CreateDemositeData | UpdateDemositeData
): FormData => {
  const formData = new FormData();

  // Add text fields
  if (data.header) formData.append('header', data.header);
  if (data.title) formData.append('title', data.title);
  if (data.name) formData.append('name', data.name);
  if (data.story) formData.append('story', data.story);
  if (data.link) formData.append('link', data.link);

  // Add photo files
  if (data.photos) {
    data.photos.forEach((photo) => {
      formData.append('photos', photo);
    });
  }

  // Add existing photo URLs for updates
  if ('existingPhotoUrls' in data && data.existingPhotoUrls) {
    data.existingPhotoUrls.forEach((url) => {
      formData.append('existingPhotoUrls', url);
    });
  }

  return formData;
};

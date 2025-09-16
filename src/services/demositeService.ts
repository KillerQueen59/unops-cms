import { apiClient } from '@/lib/api';
import { DemositeData } from '@/types/demosite';

// Demosite API interfaces based on Postman collection
export interface CreateDemositeData {
  header: string;
  title: string;
  type: 'hero' | 'location'; // Based on Postman collection query params
  name: string;
  story: string;
  link: string;
  photos?: File[]; // File array for form data
}

export interface UpdateDemositeData extends CreateDemositeData {
  id: string;
}

// Query parameters for getting demosites
export interface DemositeQueryParams {
  page?: number;
  pageSize?: number;
  type?: 'hero' | 'location';
  sortBy?: string;
}

// Demosite API Service
export const demositeService = {
  // Get all demosites with optional filtering
  async getDemosites(params?: DemositeQueryParams): Promise<DemositeData[]> {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = params.page.toString();
    if (params?.pageSize) queryParams.pageSize = params.pageSize.toString();
    if (params?.type) queryParams.type = params.type;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;

    return await apiClient.get<DemositeData[]>('/demosite/all', queryParams);
  },

  // Get demosite by ID
  async getDemositeById(id: string): Promise<DemositeData> {
    return await apiClient.get<DemositeData>(`/demosite/${id}`);
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
  if (data.type) formData.append('type', data.type);
  if (data.name) formData.append('name', data.name);
  if (data.story) formData.append('story', data.story);
  if (data.link) formData.append('link', data.link);

  // Add photo files
  if (data.photos) {
    data.photos.forEach((photo) => {
      formData.append('photos', photo);
    });
  }

  return formData;
};

// Helper function to transform UI data to API format
export const transformUIDemositeForAPI = (
  demosite: Partial<DemositeData>,
  photos?: File[]
): UpdateDemositeData => {
  // Map DemositeType enum to API type
  const getApiType = (type?: string): 'hero' | 'location' => {
    if (type === 'Local Heroes') return 'hero';
    if (type === 'Story of Village') return 'location';
    return 'hero'; // default
  };

  return {
    id: demosite.id || '',
    header: demosite.header || '',
    title: demosite.title || '',
    type: getApiType(demosite.type?.toString()),
    name: demosite.name || '',
    story: demosite.story || '',
    link: demosite.link || '',
    photos: photos,
  };
};

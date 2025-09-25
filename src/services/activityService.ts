import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import {
  ActivityData,
  ApiFile,
  UnifiedFile,
  isApiFile,
} from '@/types/activity';

// Activity API interfaces based on the curl commands
export interface Activity {
  _id: string;
  villageId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  percentage: number;
  files?: ApiFile[];
  createdAt: string;
  updatedAt: string;
  village?: {
    _id: string;
    name: string;
    areaId: string;
  };
}

export interface CreateActivityData {
  villageId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  percentage: number;
}

export interface UpdateActivityData {
  villageId?: string;
  name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  percentage?: number;
}

// Pagination interfaces
export interface ActivityListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
  village?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
}

// API Response interfaces
interface ActivityApiResponse {
  status: boolean;
  message: string;
  data: {
    activities: Activity[];
    totalData: number;
    page: number;
    totalPages: number;
  };
}

interface SingleActivityApiResponse {
  status: boolean;
  message: string;
  data: Activity;
}

interface ActivityCategoriesResponse {
  status: boolean;
  message: string;
  data: string[];
}

// Transform API response to our internal format
const transformActivityFromAPI = (apiActivity: Activity): ActivityData => {
  return {
    id: apiActivity._id,
    villageId: apiActivity.villageId,
    activityName: apiActivity.name,
    description: apiActivity.description,
    startDate: apiActivity.start_date,
    endDate: apiActivity.end_date,
    status: apiActivity.status,
    percentage: apiActivity.percentage.toString(),
    files:
      apiActivity.files?.map((file) => ({
        url: file.url,
        title: file.title,
        mimetype: file.mimetype,
        isExisting: true,
      })) || [],
    type: apiActivity.type,
    category: apiActivity.type,
  };
};

// Activity API Service
export const activityService = {
  async getActivities(
    params?: ActivityListParams
  ): Promise<PaginatedResponse<ActivityData>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      // Always add sortBy for consistent results
      queryParams.append('sortBy', params?.sortBy || 'createdAt');
      if (params?.search) queryParams.append('search', params.search);
      if (params?.village) queryParams.append('search', params.village);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = `/village/activity/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<ActivityApiResponse>(url);

      if (response.status && response.data?.activities) {
        const activities = response.data.activities.map(
          transformActivityFromAPI
        );
        const totalData = response.data.totalData || 0;
        const page = response.data.page || params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const totalPages =
          response.data.totalPages || Math.ceil(totalData / pageSize);

        return {
          data: activities,
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
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    }
  },

  async getActivityById(id: string): Promise<ActivityData> {
    try {
      const response = await apiClient.get<SingleActivityApiResponse>(
        `/village/activity/${id}`
      );

      if (response.status && response.data) {
        return transformActivityFromAPI(response.data);
      }
      throw new Error('Activity not found');
    } catch (error) {
      console.error('Failed to fetch activity by ID:', error);
      throw error;
    }
  },

  async getCategories(): Promise<ActivityCategoriesResponse> {
    const endpoint = '/village/activity/categories';
    return apiClient.get<ActivityCategoriesResponse>(endpoint);
  },

  async createActivity(
    activityData: CreateActivityData,
    files?: File[]
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    // Use FormData for consistency with API (since it supports file uploads)
    const formData = createActivityFormData(activityData, files);
    const response = await apiClient.post<SingleActivityApiResponse>(
      '/village/activity',
      formData
    );

    return {
      status: response.status,
      message: response.message,
    };
  },

  async updateActivity(
    activityId: string,
    activityData: UpdateActivityData,
    files?: UnifiedFile[]
  ): Promise<Activity> {
    // Separate existing files from new files
    const existingFiles = files?.filter(isApiFile) || [];
    const newFiles =
      files?.filter((file): file is File => !isApiFile(file)) || [];

    // Use FormData for consistency with API (since it supports file uploads)
    const formData = createActivityFormData(
      activityData,
      newFiles,
      existingFiles
    );
    return await apiClient.put<Activity>(
      `/village/activity/${activityId}`,
      formData
    );
  },

  async deleteActivity(activityId: string): Promise<void> {
    await apiClient.delete(`/village/activity/${activityId}`);
  },
};

// Helper function to create FormData for activity creation/update
export const createActivityFormData = (
  data: CreateActivityData | UpdateActivityData,
  files?: File[],
  existingFiles?: ApiFile[]
): FormData => {
  const formData = new FormData();
  // Add activity data fields
  if (data.villageId) formData.append('villageId', data.villageId);
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.start_date) formData.append('start_date', data.start_date);
  if (data.end_date) formData.append('end_date', data.end_date);
  if (data.status) formData.append('status', data.status);
  if (data.type) formData.append('type', data.type);

  if (data.percentage !== undefined)
    formData.append('percentage', data.percentage.toString());

  // Add existing files (URLs only) for updates
  if (existingFiles && existingFiles.length > 0) {
    existingFiles.forEach((file) => {
      formData.append('existingFileUrls', file.url);
    });
  }

  // Add new files if provided
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  return formData;
};

// Helper function to transform UI data to API format
export const transformUIActivityForAPI = (
  activity: Partial<ActivityData>
): UpdateActivityData => {
  return {
    name: activity.activityName,
    description: activity.description,
    start_date: activity.startDate,
    end_date: activity.endDate,
    status: activity.status,
    percentage: activity.percentage ? Number(activity.percentage) : 0,
    villageId: activity.villageId,
  };
};

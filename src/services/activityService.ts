import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import { ActivityData } from '@/types/activity';
import { CategoryEnum } from '@/constants/category';

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
  attachments?: string[]; // File URLs from API
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
  category?: string;
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
  category?: string;
}

// Pagination interfaces
export interface ActivityListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  sortBy?: string;
}

// API Response interfaces
interface ActivityApiResponse {
  status: boolean;
  message: string;
  data: {
    activities: Activity[];
    totalData: number;
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
    files: apiActivity.attachments || [],
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
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const url = `/village/activity/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<ActivityApiResponse>(url);

      if (response.status && response.data?.activities) {
        const activities = response.data.activities.map(
          transformActivityFromAPI
        );
        const totalData = response.data.totalData || activities.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;

        return {
          data: activities,
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
    files?: File[]
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    // Use FormData for consistency with API (since it supports file uploads)
    const formData = createActivityFormData(activityData, files);
    const response = await apiClient.put<SingleActivityApiResponse>(
      `/village/activity/${activityId}`,
      formData
    );

    return {
      status: response.status,
      message: response.message,
    };
  },

  async deleteActivity(activityId: string): Promise<void> {
    await apiClient.delete(`/village/activity/${activityId}`);
  },
};

// Helper function to create FormData for activity creation/update
export const createActivityFormData = (
  data: CreateActivityData | UpdateActivityData,
  files?: File[]
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
  if (data.category) {
    formData.append('category', 'capacity_building'); //DUMMY
  }
  if (data.percentage !== undefined)
    formData.append('percentage', data.percentage.toString());

  // Add files if provided
  if (files) {
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

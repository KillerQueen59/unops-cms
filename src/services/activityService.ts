import { apiClient } from '@/lib/api';

// Activity types based on actual API response structure from Postman collection
export interface Activity {
  _id: string;
  villageId: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  category:
    | 'capacity_building'
    | 'infrastructure'
    | 'environmental'
    | 'social'
    | 'economic'
    | 'other';
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
  startDate: string;
  endDate: string;
  description: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  category:
    | 'capacity_building'
    | 'infrastructure'
    | 'environmental'
    | 'social'
    | 'economic'
    | 'other';
  percentage: number;
  attachments?: File[]; // Files for upload
}

export interface UpdateActivityData {
  name?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  category?:
    | 'capacity_building'
    | 'infrastructure'
    | 'environmental'
    | 'social'
    | 'economic'
    | 'other';
  percentage?: number;
  attachments?: File[]; // Files for upload
}

export interface ActivityListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  category?:
    | 'capacity_building'
    | 'infrastructure'
    | 'environmental'
    | 'social'
    | 'economic'
    | 'other';
  sortBy?: string;
}

interface ActivityListResponse {
  data: Activity[];
  total: number;
  page: number;
  pageSize: number;
}

interface ActivityCategoriesResponse {
  data: string[];
}

export interface ActivityResponse {
  status: boolean;
  message: string;
  data: Activity;
}

// Activity API Service
export const activityApi = {
  // Read Operations (activities.read permission)

  /**
   * Get all activities - GET /village/activity/all
   */
  getActivities: async (
    params: ActivityListParams = {}
  ): Promise<ActivityListResponse> => {
    // Filter out undefined/null values for cleaner query strings
    const cleanParams = Object.fromEntries(
      Object.entries(params)
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
        .map(([key, value]) => [key, value.toString()])
    );

    return apiClient.get<ActivityListResponse>(
      '/village/activity/all',
      cleanParams
    );
  },

  /**
   * Get activity by ID
   */
  getActivityById: async (activityId: string): Promise<ActivityResponse> => {
    return apiClient.get<ActivityResponse>(`/activity/${activityId}`);
  },

  /**
   * Get activity categories - GET /village/activity/categories
   */
  getCategories: async (): Promise<ActivityCategoriesResponse> => {
    const endpoint = '/village/activity/categories';

    return apiClient.get<ActivityCategoriesResponse>(endpoint);
  },

  // Write Operations (activities.write permission)

  /**
   * Create new activity - POST /village/activity (with FormData support)
   */
  createActivity: async (
    activityData: CreateActivityData,
    files?: File[]
  ): Promise<ActivityResponse> => {
    if (files && files.length > 0) {
      // Use FormData for file uploads
      const formData = createActivityFormData(activityData, files);
      return apiClient.post<ActivityResponse>('/village/activity', formData);
    }

    // Use JSON for data-only requests
    return apiClient.post<ActivityResponse>('/village/activity', activityData);
  },

  /**
   * Update existing activity - PUT /village/activity/:id (with FormData support)
   */
  updateActivity: async (
    activityId: string,
    activityData: UpdateActivityData,
    files?: File[]
  ): Promise<ActivityResponse> => {
    if (files && files.length > 0) {
      // Use FormData for file uploads
      const formData = createActivityFormData(activityData, files);
      return apiClient.put<ActivityResponse>(
        `/village/activity/${activityId}`,
        formData
      );
    }

    // Use JSON for data-only requests
    return apiClient.put<ActivityResponse>(
      `/village/activity/${activityId}`,
      activityData
    );
  },

  // Delete Operations (activities.delete permission)

  /**
   * Delete activity - DELETE /village/activity/:id
   */
  deleteActivity: async (
    activityId: string
  ): Promise<{ status: boolean; message: string }> => {
    return apiClient.delete(`/village/activity/${activityId}`);
  },
};

// Helper functions for data transformation
export const transformActivityForUI = (activity: Activity): ActivityData => {
  // Map API status to UI status
  const mapStatus = (apiStatus: Activity['status']): 'active' | 'inactive' => {
    switch (apiStatus) {
      case 'ongoing':
        return 'active';
      case 'completed':
      case 'not yet':
      default:
        return 'inactive';
    }
  };

  return {
    id: activity._id,
    activityName: activity.name,
    activityCategory: activity.category,
    description: activity.description,
    startDate: activity.startDate,
    endDate: activity.endDate,
    status: mapStatus(activity.status),
    progress: 0, // Progress not in API response, default to 0
    files: [], // Files would need separate API handling
  };
};

export const transformUIActivityForAPI = (
  activity: Partial<ActivityData>
): UpdateActivityData => {
  // Map UI status to API status
  const mapStatus = (uiStatus?: 'active' | 'inactive'): Activity['status'] => {
    switch (uiStatus) {
      case 'active':
        return 'ongoing';
      case 'inactive':
        return 'not yet';
      default:
        return 'not yet';
    }
  };

  return {
    name: activity.activityName,
    description: activity.description,
    startDate: activity.startDate,
    endDate: activity.endDate,
    status: mapStatus(activity.status),
  };
};

// Import the existing ActivityData type for backwards compatibility
import { ActivityData } from '@/types/activity';

// Helper function to create FormData for activity creation/update
export const createActivityFormData = (
  data: CreateActivityData | UpdateActivityData,
  files?: File[]
): FormData => {
  const formData = new FormData();

  // Add activity data fields
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.endDate) formData.append('endDate', data.endDate);
  if (data.status) formData.append('status', data.status);
  if (data.type) formData.append('type', data.type);
  if (data.category) formData.append('category', data.category);

  // Add files if provided
  if (files) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  return formData;
};

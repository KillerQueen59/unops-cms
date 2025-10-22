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
  remarks?: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  percentage: number;
  files?: ApiFile[];
  calendarEventIds?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  village?: {
    _id: string;
    name: string;
    areaId: string;
  };
  category?: {
    _id: string;
    name: string;
  };
}

export interface CreateActivityData {
  villageId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  remarks?: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  percentage: number;
  categoryId?: string;
}

export interface UpdateActivityData {
  villageId?: string;
  name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  remarks?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  percentage?: number;
  categoryId?: string;
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
  data?: Activity;
}

interface CreateActivityApiResponse {
  status: boolean;
  message: string;
  data?: {
    _id?: string;
  };
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
    category: apiActivity.category?._id,
    remarks: apiActivity.remarks || '',
    calendarEventIds: apiActivity.calendarEventIds,
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

  async getActivityByIdRaw(id: string): Promise<Activity> {
    try {
      const response = await apiClient.get<SingleActivityApiResponse>(
        `/village/activity/${id}`
      );

      if (response.status && response.data) {
        return response.data;
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
    calendarSyncStatus?: string;
  }> {
    // Use FormData for consistency with API (since it supports file uploads)
    const formData = createActivityFormData(activityData, files);
    const response = await apiClient.post<CreateActivityApiResponse>(
      '/village/activity',
      formData
    );

    // Sync to Google Calendar (non-blocking) using the submitted form data
    let calendarSyncStatus = 'skipped';

    if (response.status && activityData) {
      calendarSyncStatus = 'pending';
      // Use the activity data we just submitted to create calendar event
      this.syncCalendarCreateFromFormData(activityData)
        .then(() => {
          calendarSyncStatus = 'synced';
          console.log('Activity synced to Google Calendar');
        })
        .catch((error) => {
          console.error('Calendar sync failed:', error);
          calendarSyncStatus = 'failed';
        });
    }

    return {
      status: response.status,
      message: response.message,
      calendarSyncStatus,
    };
  },

  /**
   * Sync created activity to Google Calendar from form data
   */
  async syncCalendarCreateFromFormData(activityData: CreateActivityData): Promise<void> {
    try {
      const attendeesList = ['fauzanramadhan59@gmail.com']; // Add your attendees here

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${attendeesList.join(', ')}\n\nVillage: ${activityData.villageId}`,
        location: '', // Village name not available in form data
        startDate: activityData.start_date,
        endDate: activityData.end_date,
        // Note: Service accounts cannot invite attendees without Domain-Wide Delegation
        // Users can view events by accessing the shared calendar directly
      };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', eventData }),
      });

      const result = await response.json();

      if (result.success && result.eventIds && Object.keys(result.eventIds).length > 0) {
        console.log('Activity synced to Google Calendar:', result.eventIds);
        // Note: Calendar event IDs won't be saved to the activity since we don't have the activity ID
        // They will be synced on the first update
      } else if (result.errors && result.errors.length > 0) {
        console.warn('Some calendar syncs failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to sync activity to calendar:', error);
    }
  },

  /**
   * Sync created activity to Google Calendar
   */
  async syncCalendarCreate(activity: Activity): Promise<void> {
    try {
      const eventData = {
        summary: `${activity.type ? `[${activity.type.toUpperCase()}] ` : ''}${activity.name}`,
        description: `${activity.description}\n\nActivity ID: ${activity._id}\nStatus: ${activity.status}\nProgress: ${activity.percentage}%${activity.remarks ? `\n\nRemarks: ${activity.remarks}` : ''}`,
        location: activity.village?.name || '',
        startDate: activity.start_date,
        endDate: activity.end_date,
        // Note: No attendees - service accounts cannot invite without Domain-Wide Delegation
      };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', eventData }),
      });

      const result = await response.json();

      if (result.success && result.eventIds && Object.keys(result.eventIds).length > 0) {
        // Update the activity with calendar event IDs
        await this.updateActivity(activity._id, {}, [], result.eventIds);
        console.log('Activity synced to Google Calendar:', result.eventIds);
      } else if (result.errors && result.errors.length > 0) {
        console.warn('Some calendar syncs failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to sync activity to calendar:', error);
    }
  },

  async updateActivity(
    activityId: string,
    activityData: UpdateActivityData,
    files?: UnifiedFile[],
    calendarEventIds?: Record<string, string>
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

    // Add calendar event IDs if provided
    if (calendarEventIds) {
      formData.append('calendarEventIds', JSON.stringify(calendarEventIds));
    }

    const response = await apiClient.put<Activity>(
      `/village/activity/${activityId}`,
      formData
    );

    // Sync to Google Calendar if activity data was updated (non-blocking)
    if (Object.keys(activityData).length > 0) {
      this.syncCalendarUpdate(response, activityData).catch((error) => {
        console.error('Calendar sync failed:', error);
      });
    }

    return response;
  },

  /**
   * Sync updated activity to Google Calendar
   */
  async syncCalendarUpdate(
    activity: Activity,
    updatedData: UpdateActivityData
  ): Promise<void> {
    try {
      // If no calendar event IDs exist, create new calendar events
      if (!activity.calendarEventIds || Object.keys(activity.calendarEventIds).length === 0) {
        console.log('No calendar event IDs found - creating new calendar event');
        await this.syncCalendarCreate(activity);
        return;
      }

      const eventData = {
        summary: `${activity.type ? `[${activity.type.toUpperCase()}] ` : ''}${activity.name}`,
        description: `${activity.description}\n\nActivity ID: ${activity._id}\nStatus: ${activity.status}\nProgress: ${activity.percentage}%${activity.remarks ? `\n\nRemarks: ${activity.remarks}` : ''}`,
        location: activity.village?.name || '',
        startDate: activity.start_date,
        endDate: activity.end_date,
        // Note: No attendees - service accounts cannot invite without Domain-Wide Delegation
      };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          eventIds: activity.calendarEventIds,
          eventData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Activity updated in Google Calendar');
      } else if (result.errors && result.errors.length > 0) {
        console.warn('Some calendar updates failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to update calendar event:', error);
    }
  },

  async deleteActivity(activityId: string): Promise<void> {
    // Get activity details first to retrieve calendar event IDs
    try {
      const activity = await this.getActivityById(activityId);

      // Delete the activity from the database
      await apiClient.delete(`/village/activity/${activityId}`);

      // Sync deletion to Google Calendar (non-blocking)
      if (activity.calendarEventIds && Object.keys(activity.calendarEventIds).length > 0) {
        this.syncCalendarDelete(activity.calendarEventIds).catch((error) => {
          console.error('Calendar delete sync failed:', error);
        });
      }
    } catch (error) {
      // If getting activity details fails, still try to delete
      await apiClient.delete(`/village/activity/${activityId}`);
      throw error;
    }
  },

  /**
   * Sync deleted activity to Google Calendar
   */
  async syncCalendarDelete(calendarEventIds: Record<string, string>): Promise<void> {
    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          eventIds: calendarEventIds,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Activity deleted from Google Calendar');
      } else if (result.errors && result.errors.length > 0) {
        console.warn('Some calendar deletions failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
    }
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
  if (data.categoryId) formData.append('categoryId', data.categoryId);
  if (data.remarks) formData.append('remarks', data.remarks);

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

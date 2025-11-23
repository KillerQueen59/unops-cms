import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import {
  Activity,
  ActivityApiResponse,
  ActivityCategoriesResponse,
  ActivityData,
  ActivityListParams,
  ApiFile,
  CreateActivityApiResponse,
  CreateActivityData,
  SingleActivityApiResponse,
  UnifiedFile,
  UpdateActivityData,
  isApiFile,
} from '@/types/activity';
import { calendarService } from './calendarService';

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
    event_id: apiActivity.event_id,
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
    activityId?: string;
  }> {
    let calendarSyncStatus = 'skipped';
    let eventId: string | undefined;

    try {
      const calendarResult =
        await calendarService.createCalendarEvent(activityData);
      if (calendarResult.success && calendarResult.eventIds) {
        const eventIds = Object.values(calendarResult.eventIds);
        if (eventIds.length > 0) {
          eventId = eventIds[0];
          calendarSyncStatus = 'synced';
          console.log('Google Calendar event created:', eventId);
        }
      } else {
        console.warn('Calendar creation had errors:', calendarResult.errors);
        calendarSyncStatus = 'partial';
      }
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      calendarSyncStatus = 'failed';
    }

    const formData = createActivityFormData(activityData, files);

    if (eventId) {
      formData.append('event_id', eventId);
    }

    const response = await apiClient.post<CreateActivityApiResponse>(
      '/village/activity',
      formData
    );

    return {
      status: response.status,
      message: response.message,
      calendarSyncStatus,
      activityId: response.data?._id,
    };
  },

  async updateActivity(
    activityId: string,
    activityData: UpdateActivityData,
    files?: UnifiedFile[],
    eventId?: string
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

    // Add calendar event ID if provided
    if (eventId) {
      formData.append('event_id', eventId);
    }

    await apiClient.put(`/village/activity/${activityId}`, formData);

    const updatedActivity = await this.getActivityByIdRaw(activityId);

    // Sync to Google Calendar if activity data was updated (non-blocking)
    if (Object.keys(activityData).length > 0) {
      calendarService.syncCalendarUpdate(updatedActivity).catch((error) => {
        console.error('Calendar sync failed:', error);
      });
    }

    return updatedActivity;
  },

  async deleteActivity(activityId: string): Promise<void> {
    // Get activity details first to retrieve calendar event ID
    try {
      const activity = await this.getActivityById(activityId);

      // Delete the activity from the database
      await apiClient.delete(`/village/activity/${activityId}`);

      // Sync deletion to Google Calendar (non-blocking)
      if (activity.event_id) {
        calendarService.syncCalendarDelete(activity.event_id).catch((error) => {
          console.error('Calendar delete sync failed:', error);
        });
      }
    } catch (error) {
      // If getting activity details fails, still try to delete
      await apiClient.delete(`/village/activity/${activityId}`);
      throw error;
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

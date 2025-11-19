import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import {
  ActivityData,
  ApiFile,
  UnifiedFile,
  isApiFile,
} from '@/types/activity';
import { villageService } from './villageService';

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
  event_id?: string;
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
    event_id: apiActivity.event_id,
  };
};

// Helper function to get village name by ID
const getVillageName = async (villageId: string): Promise<string> => {
  try {
    const village = await villageService.getVillageById(villageId);
    return village.villageName || '';
  } catch (error) {
    console.error('Failed to fetch village name:', error);
    return '';
  }
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
      const calendarResult = await this.createCalendarEvent(activityData);
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

  /**
   * Create Google Calendar event and return event IDs
   */
  async createCalendarEvent(activityData: CreateActivityData): Promise<{
    success: boolean;
    eventIds?: Record<string, string>;
    errors?: string[];
  }> {
    try {
      const attendeesList = ['fauzanramadhan59@gmail.com']; // Add your attendees here

      // Fetch village name
      const villageName = await getVillageName(activityData.villageId);

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nVillage: ${villageName || activityData.villageId}\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${attendeesList.join(', ')}`,
        location: villageName,
        startDate: activityData.start_date,
        endDate: activityData.end_date,
      };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', eventData }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },

  /**
   * Sync created activity to Google Calendar and store event IDs (deprecated - use createCalendarEvent)
   */
  async syncCalendarCreateAndStore(
    activityId: string,
    activityData: CreateActivityData
  ): Promise<void> {
    try {
      const attendeesList = ['fauzanramadhan59@gmail.com']; // Add your attendees here

      // Fetch village name
      const villageName = await getVillageName(activityData.villageId);

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nVillage: ${villageName || activityData.villageId}\nActivity ID: ${activityId}\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${attendeesList.join(', ')}`,
        location: villageName,
        startDate: activityData.start_date,
        endDate: activityData.end_date,
      };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', eventData }),
      });

      const result = await response.json();

      if (
        result.success &&
        result.eventIds &&
        Object.keys(result.eventIds).length > 0
      ) {
        console.log('Activity synced to Google Calendar:', result.eventIds);
        await this.updateActivity(activityId, {}, [], result.eventIds);
        console.log('Calendar event IDs stored in activity:', activityId);
      } else if (result.errors && result.errors.length > 0) {
        console.warn('Some calendar syncs failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to sync activity to calendar:', error);
      throw error;
    }
  },

  /**
   * Sync created activity to Google Calendar from form data (deprecated - use syncCalendarCreateAndStore)
   */
  async syncCalendarCreateFromFormData(
    activityData: CreateActivityData
  ): Promise<void> {
    try {
      const attendeesList = ['fauzanramadhan59@gmail.com']; // Add your attendees here

      // Fetch village name
      const villageName = await getVillageName(activityData.villageId);

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nVillage: ${villageName || activityData.villageId}\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${attendeesList.join(', ')}`,
        location: villageName,
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

      if (
        result.success &&
        result.eventIds &&
        Object.keys(result.eventIds).length > 0
      ) {
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
      const extractDate = (dateString: string): string => {
        return dateString.split('T')[0];
      };

      const eventData = {
        summary: `${activity.type ? `[${activity.type.toUpperCase()}] ` : ''}${activity.name}`,
        description: `${activity.description}\n\nActivity ID: ${activity._id}\nStatus: ${activity.status}\nProgress: ${activity.percentage}%${activity.remarks ? `\n\nRemarks: ${activity.remarks}` : ''}`,
        location: activity.village?.name || '',
        startDate: extractDate(activity.start_date),
        endDate: extractDate(activity.end_date),
        // Note: No attendees - service accounts cannot invite without Domain-Wide Delegation
      };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', eventData }),
      });

      const result = await response.json();

      if (
        result.success &&
        result.eventIds &&
        Object.keys(result.eventIds).length > 0
      ) {
        // Extract the first event ID
        const eventId = Object.values(result.eventIds)[0] as string;
        await this.updateActivity(activity._id, {}, [], eventId);
        console.log('Activity synced to Google Calendar:', eventId);
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
      this.syncCalendarUpdate(updatedActivity).catch((error) => {
        console.error('Calendar sync failed:', error);
      });
    }

    return updatedActivity;
  },

  /**
   * Sync updated activity to Google Calendar
   */
  async syncCalendarUpdate(activity: Activity): Promise<void> {
    try {
      if (!activity.event_id) {
        await this.syncCalendarCreate(activity);
        return;
      }

      const extractDate = (dateString: string): string => {
        return dateString.split('T')[0];
      };

      // Get village name - use populated village.name or fetch by villageId
      let villageName = activity.village?.name || '';
      if (!villageName && activity.villageId) {
        villageName = await getVillageName(activity.villageId);
      }

      const eventData = {
        summary: `${activity.type ? `[${activity.type.toUpperCase()}] ` : ''}${activity.name}`,
        description: `${activity.description}\n\nVillage: ${villageName}\nActivity ID: ${activity._id}\nStatus: ${activity.status}\nProgress: ${activity.percentage}%${activity.remarks ? `\n\nRemarks: ${activity.remarks}` : ''}`,
        location: villageName,
        startDate: extractDate(activity.start_date),
        endDate: extractDate(activity.end_date),
      };

      const calendarConfigResponse = await fetch('/api/calendar/config');
      const calendarConfig = await calendarConfigResponse.json();
      const calendarId = calendarConfig.calendars?.[0]?.calendarId;

      if (!calendarId) {
        return;
      }

      // Build eventIds object for the API
      const eventIds = { [calendarId]: activity.event_id };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          eventIds,
          eventData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Activity updated in Google Calendar successfully');
      } else if (result.errors && result.errors.length > 0) {
        console.error('⚠️ Some calendar updates failed:', result.errors);
      }
    } catch (error) {
      console.error('❌ Failed to update calendar event:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
    }
  },

  async deleteActivity(activityId: string): Promise<void> {
    // Get activity details first to retrieve calendar event ID
    try {
      const activity = await this.getActivityById(activityId);

      // Delete the activity from the database
      await apiClient.delete(`/village/activity/${activityId}`);

      // Sync deletion to Google Calendar (non-blocking)
      if (activity.event_id) {
        this.syncCalendarDelete(activity.event_id).catch((error) => {
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
  async syncCalendarDelete(eventId: string): Promise<void> {
    try {
      // Get the calendar ID from config (use the first enabled calendar)
      const calendarConfigResponse = await fetch('/api/calendar/config');
      const calendarConfig = await calendarConfigResponse.json();
      const calendarId = calendarConfig.calendars?.[0]?.calendarId;

      if (!calendarId) {
        console.warn('No calendar ID found in config');
        return;
      }

      // Build eventIds object for the API
      const eventIds = { [calendarId]: eventId };

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          eventIds,
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

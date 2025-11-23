import {
  Activity,
  CreateActivityData,
  UpdateActivityData,
} from '@/types/activity';
import {
  PROVINCE_NAME,
  southSumatraRegencies,
  allVillages,
} from '@/app/(main)/village/constants';
import { CALENDAR_ATTENDEES } from '@/constants/calendar';

/**
 * Calendar Service
 * Handles all Google Calendar sync operations for activities
 */
export const calendarService = {
  /**
   * Build location name from village code (not ID)
   * Extracts province, regency, and village names from the village code
   * @param villageCode - The village code (e.g., "16", "16.05", "16.05.01.2001")
   */
  getLocationNameFromCode(villageCode: string): string {
    if (!villageCode) {
      return PROVINCE_NAME;
    }

    const parts: string[] = [PROVINCE_NAME];

    // Extract regency from village code (first two parts: e.g., "16.05")
    const codeParts = villageCode.split('.');
    if (codeParts.length >= 2) {
      const regencyCode = codeParts.slice(0, 2).join('.');
      const regency = southSumatraRegencies.find((r) => r.code === regencyCode);
      if (regency) {
        parts.push(regency.name);
      }
    }

    // Add village name if available (full code with 4 parts)
    if (codeParts.length >= 4) {
      const village = allVillages.find((v) => v.code === villageCode);
      if (village) {
        parts.push(village.name);
      }
    }

    return parts.join(', ');
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
      // Build location name from village code (villageId is actually the village code)
      const locationName = this.getLocationNameFromCode(activityData.villageId);

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nLocation: ${locationName}\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${CALENDAR_ATTENDEES.join(', ')}`,
        location: locationName,
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
    activityData: CreateActivityData,
    updateActivityFn: (
      id: string,
      data: UpdateActivityData,
      files?: unknown[],
      eventId?: string
    ) => Promise<Activity>
  ): Promise<void> {
    try {
      // Build location name from village code (villageId is actually the village code)
      const locationName = this.getLocationNameFromCode(activityData.villageId);

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nLocation: ${locationName}\nActivity ID: ${activityId}\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${CALENDAR_ATTENDEES.join(', ')}`,
        location: locationName,
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
        await updateActivityFn(activityId, {}, [], result.eventIds);
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
      // Build location name from village code (villageId is actually the village code)
      const locationName = this.getLocationNameFromCode(activityData.villageId);

      const eventData = {
        summary: `${activityData.type ? `[${activityData.type.toUpperCase()}] ` : ''}${activityData.name}`,
        description: `${activityData.description}\n\nLocation: ${locationName}\nStatus: ${activityData.status}\nProgress: ${activityData.percentage}%${activityData.remarks ? `\n\nRemarks: ${activityData.remarks}` : ''}\n\nAttendees: ${CALENDAR_ATTENDEES.join(', ')}`,
        location: locationName,
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
  async syncCalendarCreate(
    activity: Activity,
    updateActivityFn: (
      id: string,
      data: UpdateActivityData,
      files?: unknown[],
      eventId?: string
    ) => Promise<Activity>
  ): Promise<void> {
    try {
      const extractDate = (dateString: string): string => {
        return dateString.split('T')[0];
      };

      // Build location name from village code (villageId is actually the village code)
      const locationName = this.getLocationNameFromCode(activity.villageId);

      const eventData = {
        summary: `${activity.type ? `[${activity.type.toUpperCase()}] ` : ''}${activity.name}`,
        description: `${activity.description}\n\nLocation: ${locationName}\nActivity ID: ${activity._id}\nStatus: ${activity.status}\nProgress: ${activity.percentage}%${activity.remarks ? `\n\nRemarks: ${activity.remarks}` : ''}`,
        location: locationName,
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
        await updateActivityFn(activity._id, {}, [], eventId);
        console.log('Activity synced to Google Calendar:', eventId);
      } else if (result.errors && result.errors.length > 0) {
        console.warn('Some calendar syncs failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to sync activity to calendar:', error);
    }
  },

  /**
   * Sync updated activity to Google Calendar
   */
  async syncCalendarUpdate(activity: Activity): Promise<void> {
    try {
      if (!activity.event_id) {
        // Note: Cannot call syncCalendarCreate here as it needs updateActivityFn
        // This should be handled by the calling code
        console.warn(
          'No event_id found for activity, skipping calendar update'
        );
        return;
      }

      const extractDate = (dateString: string): string => {
        return dateString.split('T')[0];
      };

      // Build location name from village code (villageId is actually the village code)
      const locationName = this.getLocationNameFromCode(activity.villageId);

      const eventData = {
        summary: `${activity.type ? `[${activity.type.toUpperCase()}] ` : ''}${activity.name}`,
        description: `${activity.description}\n\nLocation: ${locationName}\nActivity ID: ${activity._id}\nStatus: ${activity.status}\nProgress: ${activity.percentage}%${activity.remarks ? `\n\nRemarks: ${activity.remarks}` : ''}`,
        location: locationName,
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

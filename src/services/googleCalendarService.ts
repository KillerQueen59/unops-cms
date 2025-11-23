import { google } from 'googleapis';
import { CalendarEventData, CalendarSyncResult } from '@/types/calendar';
import {
  getEnabledCalendars,
  isCalendarSyncEnabled,
} from '@/config/calendar.config';

/**
 * Google Calendar Service
 *
 * This service handles all interactions with the Google Calendar API.
 * It uses Service Account authentication for server-to-server communication.
 *
 * Required Environment Variables:
 * - GOOGLE_CALENDAR_ENABLED: Set to 'true' to enable calendar sync
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL: Service account email
 * - GOOGLE_PRIVATE_KEY: Service account private key (in base64 or direct format)
 * - GOOGLE_CALENDAR_TIMEZONE: Default timezone (e.g., 'Asia/Jakarta')
 */

class GoogleCalendarService {
  private calendar: ReturnType<typeof google.calendar> | null = null;
  private isInitialized = false;

  /**
   * Initialize Google Calendar API client with Service Account credentials
   */
  private async initialize() {
    if (this.isInitialized || !isCalendarSyncEnabled()) {
      return;
    }

    try {
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      let privateKey = process.env.GOOGLE_PRIVATE_KEY;

      if (!serviceAccountEmail || !privateKey) {
        console.warn(
          'Google Calendar: Missing credentials. Calendar sync will be disabled.'
        );
        return;
      }

      // Handle base64 encoded private key
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        try {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        } catch (error) {
          console.error('Failed to decode base64 private key:', error);
        }
      }

      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.isInitialized = true;

      console.log('Google Calendar API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Create a calendar event for a specific user
   */
  private async createEventForCalendar(
    calendarId: string,
    eventData: CalendarEventData
  ): Promise<CalendarSyncResult> {
    try {
      await this.initialize();

      if (!this.calendar) {
        return {
          success: false,
          error: 'Calendar API not initialized',
        };
      }

      const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'Asia/Jakarta';

      const event: {
        summary: string;
        description: string;
        location?: string;
        start: { date: string; timeZone: string };
        end: { date: string; timeZone: string };
        attendees?: Array<{ email: string }>;
        reminders: {
          useDefault: boolean;
          overrides: Array<{ method: string; minutes: number }>;
        };
      } = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          date: eventData.startDate,
          timeZone: timezone,
        },
        end: {
          date: eventData.endDate,
          timeZone: timezone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 },
          ],
        },
      };

      if (eventData.attendees && eventData.attendees.length > 0) {
        event.attendees = eventData.attendees.map((email) => ({ email }));
      }

      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
        sendUpdates:
          event.attendees && event.attendees.length > 0 ? 'all' : 'none',
      });

      return {
        success: true,
        eventId: response.data.id ?? undefined,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create calendar event';
      console.error(`Failed to create event in calendar ${calendarId}:`, error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Create calendar events for all enabled users
   */
  async createEvent(eventData: CalendarEventData): Promise<{
    success: boolean;
    eventIds: Record<string, string>;
    errors: string[];
  }> {
    if (!isCalendarSyncEnabled()) {
      console.log('Calendar sync is disabled');
      return { success: true, eventIds: {}, errors: [] };
    }

    const calendars = getEnabledCalendars();
    const eventIds: Record<string, string> = {};
    const errors: string[] = [];

    const results = await Promise.allSettled(
      calendars.map((config) =>
        this.createEventForCalendar(config.calendarId, eventData)
      )
    );

    results.forEach((result, index) => {
      const config = calendars[index];

      if (result.status === 'fulfilled' && result.value.success) {
        if (result.value.eventId) {
          eventIds[config.calendarId] = result.value.eventId;
        }
      } else {
        const error =
          result.status === 'fulfilled'
            ? result.value.error
            : (result.reason as Error).message;
        errors.push(`${config.email}: ${error}`);
      }
    });

    return {
      success: errors.length === 0,
      eventIds,
      errors,
    };
  }

  /**
   * Update a calendar event for a specific user
   */
  private async updateEventForCalendar(
    calendarId: string,
    eventId: string,
    eventData: CalendarEventData
  ): Promise<CalendarSyncResult> {
    try {
      await this.initialize();

      if (!this.calendar) {
        return {
          success: false,
          error: 'Calendar API not initialized',
        };
      }

      const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'Asia/Jakarta';

      const event: {
        summary: string;
        description: string;
        location?: string;
        start: { date: string; timeZone: string };
        end: { date: string; timeZone: string };
        attendees?: Array<{ email: string }>;
      } = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          date: eventData.startDate,
          timeZone: timezone,
        },
        end: {
          date: eventData.endDate,
          timeZone: timezone,
        },
      };

      // Only add attendees if provided and not empty
      if (eventData.attendees && eventData.attendees.length > 0) {
        event.attendees = eventData.attendees.map((email) => ({ email }));
      }

      await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
        sendUpdates:
          event.attendees && event.attendees.length > 0 ? 'all' : 'none',
      });

      return {
        success: true,
        eventId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update calendar event';
      console.error(
        `❌ Failed to update event ${eventId} in calendar ${calendarId}:`,
        error
      );
      console.error('Error details:', JSON.stringify(error, null, 2));
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update calendar events for all users
   */
  async updateEvent(
    eventIds: Record<string, string>,
    eventData: CalendarEventData
  ): Promise<{ success: boolean; errors: string[] }> {
    console.log('updateEvent eventIds:', eventIds, 'eventData:', eventData);

    if (!isCalendarSyncEnabled()) {
      console.log('Calendar sync is disabled');
      return { success: true, errors: [] };
    }

    const errors: string[] = [];
    const calendars = getEnabledCalendars();

    const updatePromises = calendars
      .filter((config) => eventIds[config.calendarId])
      .map((config) =>
        this.updateEventForCalendar(
          config.calendarId,
          eventIds[config.calendarId],
          eventData
        )
      );

    const results = await Promise.allSettled(updatePromises);

    results.forEach((result, index) => {
      const config = calendars[index];

      if (result.status === 'rejected' || !result.value.success) {
        const error =
          result.status === 'fulfilled'
            ? result.value.error
            : (result.reason as Error).message;
        errors.push(`${config.email}: ${error}`);
      }
    });
    console.log('updateEvent errors:', errors);

    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * Delete a calendar event for a specific user
   */
  private async deleteEventForCalendar(
    calendarId: string,
    eventId: string
  ): Promise<CalendarSyncResult> {
    try {
      await this.initialize();

      if (!this.calendar) {
        return {
          success: false,
          error: 'Calendar API not initialized',
        };
      }

      await this.calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: 'all',
      });

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete calendar event';
      console.error(
        `Failed to delete event ${eventId} from calendar ${calendarId}:`,
        error
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete calendar events from all users
   */
  async deleteEvent(
    eventIds: Record<string, string>
  ): Promise<{ success: boolean; errors: string[] }> {
    if (
      !isCalendarSyncEnabled() ||
      !eventIds ||
      Object.keys(eventIds).length === 0
    ) {
      console.log('Calendar sync is disabled or no event IDs provided');
      return { success: true, errors: [] };
    }

    const errors: string[] = [];

    const deletePromises = Object.entries(eventIds).map(
      ([calendarId, eventId]) =>
        this.deleteEventForCalendar(calendarId, eventId)
    );

    const results = await Promise.allSettled(deletePromises);

    results.forEach((result, index) => {
      const [calendarId] = Object.entries(eventIds)[index];

      if (result.status === 'rejected' || !result.value.success) {
        const error =
          result.status === 'fulfilled'
            ? result.value.error
            : (result.reason as Error).message;
        errors.push(`${calendarId}: ${error}`);
      }
    });

    return {
      success: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();

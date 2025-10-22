import { CalendarConfig } from '@/types/calendar';

/**
 * Google Calendar Configuration
 *
 * Add user emails and their corresponding calendar IDs here.
 * When an activity is created/updated/deleted, events will be synced to these calendars.
 *
 * To get a calendar ID:
 * 1. Go to Google Calendar settings
 * 2. Select the calendar
 * 3. Scroll to "Integrate calendar" section
 * 4. Copy the "Calendar ID" (usually looks like an email address)
 *
 * Note: For primary calendar, the calendar ID is the same as the user's email
 */
export const CALENDAR_USERS: CalendarConfig[] = [
  {
    email: 'simelaproklim@gmail.com', // Main calendar
    calendarId: 'simelaproklim@gmail.com',
    enabled: true,
  },
  // Uncomment and configure if you have access to other calendars:
  // {
  //   email: 'fauzanramadhan59@gmail.com',
  //   calendarId: 'fauzanramadhan59@gmail.com', // Only works if this calendar is shared with service account
  //   enabled: true,
  // },
];

/**
 * Get all enabled calendar configurations
 */
export const getEnabledCalendars = (): CalendarConfig[] => {
  return CALENDAR_USERS.filter((config) => config.enabled);
};

/**
 * Check if calendar sync is enabled
 */
export const isCalendarSyncEnabled = (): boolean => {
  return (
    process.env.GOOGLE_CALENDAR_ENABLED === 'true' &&
    getEnabledCalendars().length > 0
  );
};

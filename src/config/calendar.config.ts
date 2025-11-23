import { CalendarConfig } from '@/types/calendar';

export const CALENDAR_USERS: CalendarConfig[] = [
  {
    email: 'simelaproklim@gmail.com',
    calendarId: 'simelaproklim@gmail.com',
    enabled: true,
  },
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

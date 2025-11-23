// Google Calendar event interfaces
export interface CalendarEventData {
  summary: string;
  description: string;
  location?: string;
  startDate: string;
  endDate: string;
  attendees?: string[];
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  end: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export interface CalendarSyncResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

export interface CalendarConfig {
  email: string;
  calendarId: string;
  enabled: boolean;
}

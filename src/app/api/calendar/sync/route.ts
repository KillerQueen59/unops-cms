import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarService } from '@/services/googleCalendarService';
import { CalendarEventData } from '@/types/calendar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, eventData, eventIds } = body;

    switch (action) {
      case 'create': {
        const result = await googleCalendarService.createEvent(
          eventData as CalendarEventData
        );
        return NextResponse.json(result);
      }

      case 'update': {
        if (!eventIds) {
          return NextResponse.json(
            { success: false, error: 'Event IDs required for update' },
            { status: 400 }
          );
        }
        const result = await googleCalendarService.updateEvent(
          eventIds,
          eventData as CalendarEventData
        );
        return NextResponse.json(result);
      }

      case 'delete': {
        if (!eventIds) {
          return NextResponse.json(
            { success: false, error: 'Event IDs required for delete' },
            { status: 400 }
          );
        }
        const result = await googleCalendarService.deleteEvent(eventIds);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Calendar sync failed',
      },
      { status: 500 }
    );
  }
}

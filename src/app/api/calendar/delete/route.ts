import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarService } from '@/services/googleCalendarService';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const calendarId = searchParams.get('calendarId');

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    if (!calendarId) {
      return NextResponse.json(
        { success: false, error: 'Calendar ID is required' },
        { status: 400 }
      );
    }

    // Build eventIds object for the service
    const eventIds = { [calendarId]: eventId };

    const result = await googleCalendarService.deleteEvent(eventIds);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Calendar event deleted successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.errors.join(', '),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Calendar delete error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete calendar event',
      },
      { status: 500 }
    );
  }
}

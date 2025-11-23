import { NextResponse } from 'next/server';
import { getEnabledCalendars } from '@/config/calendar.config';

export async function GET() {
  try {
    const calendars = getEnabledCalendars();

    return NextResponse.json({
      success: true,
      calendars,
    });
  } catch (error) {
    console.error('Failed to get calendar config:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get config',
      },
      { status: 500 }
    );
  }
}

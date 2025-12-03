// ============================================
// WEBHOOK API ROUTE (Google Sheets Integration)
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// Google Sheets Webhook URL (set this in your environment)
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, timestamp, data } = body;

    // Validate required fields
    if (!event || !timestamp || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare payload for Google Sheets
    const sheetsPayload = {
      timestamp: new Date(timestamp).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      event,
      ...data,
    };

    // Send to Google Sheets if webhook URL is configured
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        const sheetsResponse = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetsPayload),
        });

        if (!sheetsResponse.ok) {
          console.error('Google Sheets webhook failed:', await sheetsResponse.text());
        }
      } catch (webhookError) {
        console.error('Error sending to Google Sheets:', webhookError);
        // Don't fail the main request if webhook fails
      }
    } else {
      console.log('No GOOGLE_SHEETS_WEBHOOK_URL configured. Payload:', sheetsPayload);
    }

    // Also log to console for debugging
    console.log(`[${event}] at ${timestamp}:`, data);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Webhook received successfully',
      event,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

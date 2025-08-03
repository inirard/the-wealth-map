import { NextResponse } from 'next/server';

// This API route is temporarily disabled to prevent server crashes.
// The Genkit implementation caused build failures and runtime errors.
// This will be fixed in a future update.

export async function POST(req: Request) {
  try {
    // Immediately return an error to any component that calls this endpoint.
    return NextResponse.json(
      { error: 'AI features are temporarily unavailable. The application is being updated.' },
      { status: 503 } // Service Unavailable
    );
  } catch (error: any) {
    console.error(`Error in disabled /api/ai route:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

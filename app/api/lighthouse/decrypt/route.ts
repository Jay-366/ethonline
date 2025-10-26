import { NextResponse } from 'next/server';

// This route is currently not used - functionality moved to main lighthouse route
export async function GET() {
  return NextResponse.json({ message: 'Decrypt endpoint - use PATCH /api/lighthouse instead' });
}

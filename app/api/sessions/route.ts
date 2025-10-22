import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Start/run session (pay-per-use)
  const body = await request.json();
  return NextResponse.json({ message: 'Session started', session: body });
}









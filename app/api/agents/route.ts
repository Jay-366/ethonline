import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // List agents
  return NextResponse.json({ agents: [] });
}

export async function POST(request: NextRequest) {
  // Create new agent
  const body = await request.json();
  return NextResponse.json({ message: 'Agent created', agent: body });
}







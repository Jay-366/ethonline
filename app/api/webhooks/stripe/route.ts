import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Handle Stripe webhooks
  const body = await request.json();
  console.log('Stripe webhook received:', body);
  return NextResponse.json({ message: 'Webhook processed' });
}







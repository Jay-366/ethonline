import { NextRequest, NextResponse } from 'next/server'
import lighthouse from '@lighthouse-web3/sdk'

// POST: Get auth message from Lighthouse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAddress = body.userAddress as string | undefined;

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    // Get auth message from Lighthouse
    const authResponse = await lighthouse.getAuthMessage(userAddress);
    
    if (!authResponse || !authResponse.data || !authResponse.data.message) {
      return NextResponse.json(
        { error: 'Failed to get auth message from Lighthouse' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: authResponse.data.message,
      userAddress: userAddress
    });

  } catch (error) {
    console.error('Auth endpoint error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get auth message' },
      { status: 500 }
    );
  }
}
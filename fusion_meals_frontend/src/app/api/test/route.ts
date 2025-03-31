import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Test API route called!');
  return NextResponse.json({ message: 'API route is working!' });
}

export async function POST(request: NextRequest) {
  console.log('Test API POST route called!');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    return NextResponse.json({ 
      message: 'POST API route is working!',
      receivedData: body 
    });
  } catch (error) {
    console.error('Error in test API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 
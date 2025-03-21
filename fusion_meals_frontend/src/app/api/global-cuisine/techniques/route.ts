import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_URL || 'http://127.0.0.1:8001'}/global-cuisine/techniques`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // If the response is not ok, handle it appropriately
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { detail: errorData.detail || 'Failed to fetch cooking techniques' }, 
        { status: response.status }
      );
    }
    
    // Return the successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in fetching cooking techniques:', error);
    return NextResponse.json(
      { detail: 'An error occurred while fetching cooking techniques' },
      { status: 500 }
    );
  }
} 
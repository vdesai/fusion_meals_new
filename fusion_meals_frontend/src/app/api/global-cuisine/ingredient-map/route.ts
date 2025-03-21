import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'}/global-cuisine/ingredient-map`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // If the response is not ok, handle it appropriately
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { detail: errorData.detail || 'Failed to fetch ingredient map' }, 
        { status: response.status }
      );
    }
    
    // Return the successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in fetching ingredient map:', error);
    return NextResponse.json(
      { detail: 'An error occurred while fetching ingredient map' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the session cookie to pass to the backend
    const sessionCookie = request.cookies.get('session_id');
    
    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_URL || 'http://127.0.0.1:8000'}/ai-chef/subscription/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Pass session cookie if available
        ...(sessionCookie ? { 'Cookie': `session_id=${sessionCookie.value}` } : {})
      },
    });
    
    // Get the response data
    const data = await response.json();
    
    // If the response is not ok, handle it appropriately
    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Failed to get subscription status' }, 
        { status: response.status }
      );
    }
    
    // Return the successful response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in subscription status API route:', error);
    return NextResponse.json(
      { detail: 'An error occurred while fetching your subscription status' },
      { status: 500 }
    );
  }
} 
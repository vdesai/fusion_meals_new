import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the session cookie to pass to the backend
    const sessionCookie = request.cookies.get('session_id');
    
    // Demo mode: create a session for testing purposes
    if (!sessionCookie) {
      console.log("Creating a demo session for subscription update");
      
      // Create a demo response
      const response = NextResponse.json({
        success: true,
        user_id: "demo_user",
        subscription: {
          subscription_level: body.subscription_level || "premium",
          expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          preferences: body.preferences || {}
        }
      });
      
      // Set a demo session cookie
      response.cookies.set({
        name: "session_id",
        value: "demo_session_" + Date.now(),
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/"
      });
      
      return response;
    }
    
    // Forward the request to the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/ai-chef/subscription/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionCookie.value}`
      },
      body: JSON.stringify(body),
    });
    
    // Get the response data
    const data = await response.json();
    
    // If the response is not ok, handle it appropriately
    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Failed to update subscription' }, 
        { status: response.status }
      );
    }
    
    // Return the successful response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in subscription update API route:', error);
    return NextResponse.json(
      { detail: 'An error occurred while updating your subscription' },
      { status: 500 }
    );
  }
} 
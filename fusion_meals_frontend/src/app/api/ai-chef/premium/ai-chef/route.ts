import { NextRequest, NextResponse } from 'next/server';

// Always use the production backend URL for consistent behavior in all environments
const BACKEND_URL = 'https://fusion-meals-new.onrender.com';
// Ensure our api endpoint is correctly set
const API_ENDPOINT = '/ai-chef/premium/ai-chef';

// TODO: AFFILIATE MARKETING SETUP
// 1. Sign up for affiliate programs with each partner
// 2. Replace "fusionmeals-20" and other placeholder IDs with your actual affiliate IDs
// 3. Create or request proper banner images for each partner and place them in /public/images/sponsors/
// 4. Once all partners are set up, enable tracking analytics in the renderSponsoredContent function

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log request information for debugging
    console.log("AI Chef Premium API Request:", {
      requestType: body.request_type,
      cuisineType: body.cuisine_type, // Explicitly log cuisine type
      timeframe: body.timeframe, // Log timeframe to debug day vs. week
      occasion: body.occasion, // Log occasion for special events
      timestamp: new Date().toISOString()
    });
    
    console.log("Attempting to connect to backend API for AI Chef:", body.request_type);
    
    // Always use the hardcoded backend URL - don't rely on environment variables in production
    console.log("Using backend URL:", BACKEND_URL);
    
    // Construct the full URL with the correct API endpoint
    const fullUrl = `${BACKEND_URL}${API_ENDPOINT}`;
    console.log("Full API URL being called:", fullUrl);
    
    // Get request headers for debugging
    const requestHeaders = Object.fromEntries(request.headers);
    console.log("Request headers:", JSON.stringify(requestHeaders, null, 2));
    
    // Extract cookies from request to pass along
    const cookies = request.cookies.getAll();
    console.log("Cookies from request:", cookies);
    
    // Extract potential authentication tokens from cookies or headers
    let authToken = '';
    if (cookies.some(cookie => cookie.name === 'auth_token')) {
      authToken = cookies.find(cookie => cookie.name === 'auth_token')?.value || '';
    } else if (request.headers.has('authorization')) {
      authToken = request.headers.get('authorization') || '';
    }
    
    // Ensure the request_type is preserved exactly as sent by the client
    // This fixes cases where recipe_curation might be misinterpreted as student_meals
    const requestBody = { ...body };
    console.log("Request body being sent to backend:", JSON.stringify(requestBody, null, 2));
    
    // Implement retry logic with exponential backoff
    let response: Response | undefined;
    let retryCount = 0;
    const maxRetries = 2; // Maximum number of retries (will attempt up to 3 times total)
    
    while (retryCount <= maxRetries) {
      try {
        if (retryCount > 0) {
          console.log(`Retry attempt ${retryCount}/${maxRetries} for backend connection...`);
        }
        
        // Connect to backend without requiring authentication
        // But include any authentication headers that might be needed
        console.log("Sending fetch request to:", fullUrl);
        console.log("With request body:", JSON.stringify(requestBody));
        
        response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization header if we have a token
            ...(authToken ? { 'Authorization': authToken } : {}),
            // Add referrer and origin headers that might be required
            'Referer': request.headers.get('referer') || 'https://fusion-meals-new.vercel.app',
            'Origin': 'https://fusion-meals-new.vercel.app'
          },
          body: JSON.stringify(requestBody),
          // Set a longer timeout for production (increase to 60 seconds)
          signal: AbortSignal.timeout(60000) // 60 seconds timeout (increased from 30 seconds)
        });
        
        // If we get a response (even an error response), break out of the retry loop
        break;
      } catch (error: unknown) {
        // Only retry on timeout errors
        const retryError = error as { code?: number };
        if (retryError.code === 23) { // TIMEOUT_ERR
          retryCount++;
          
          if (retryCount > maxRetries) {
            console.log("Maximum retries reached, giving up on backend connection");
            throw error; // Re-throw to be caught by the outer catch block
          }
          
          // Exponential backoff (1s, 2s, 4s, etc.)
          const backoffTime = Math.pow(2, retryCount - 1) * 1000;
          console.log(`Timeout error, waiting ${backoffTime}ms before retry ${retryCount}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        } else {
          // For non-timeout errors, stop retrying
          console.error("Non-timeout error during fetch:", error);
          throw error; // Re-throw to be caught by the outer catch block
        }
      }
    }

    // If we don't have a response after all retries, throw an error
    if (!response) {
      throw new Error("Failed to get response from backend after multiple attempts");
    }
    
    console.log("Backend response status:", response.status);
    
    // Log response headers for debugging
    const responseHeaders = Object.fromEntries(response.headers);
    console.log("Response headers:", JSON.stringify(responseHeaders, null, 2));
    
    // If the backend responds successfully, return the backend response
    if (response.ok) {
      const data = await response.json();
      console.log("Backend API response received successfully");
      return NextResponse.json(data);
    } else {
      // For 403 errors, log more detailed information
      if (response.status === 403) {
        console.error("Backend returned 403 Forbidden - Authentication issue detected");
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        console.error("This likely means the backend API requires authentication");
      } else {
        console.log("Backend returned error status:", response.status);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
      }
      
      // Return the error from the backend instead of falling back to demo data
      return NextResponse.json(
        { 
          error: "Backend API error", 
          status: response.status,
          message: "The backend server returned an error. Please try again later."
        },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    console.error('Error in AI Chef premium API route:', error);
    return NextResponse.json(
      { 
        error: "API connection error",
        message: "Could not connect to the backend API. The server might be busy or unavailable. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
# API Testing Guide

To help diagnose issues with the production API, follow these steps to test the API directly.

## Check the Render Backend Status

1. Visit https://fusion-meals-new.onrender.com to check if the backend is running:
   - You should see a JSON response with `status: "online"` and a list of available endpoints
   - Make sure `/recipes` is in the list of available endpoints

## Test API Endpoints Directly

### Test the Recipes Endpoint

```bash
# Using curl from the command line
curl https://fusion-meals-new.onrender.com/recipes

# Or with query parameter
curl https://fusion-meals-new.onrender.com/recipes?query=chicken
```

The response should be a JSON array or object containing recipe data.

### Test in the Browser

Open these URLs in your browser to see the responses directly:

1. [API Root](https://fusion-meals-new.onrender.com) - Check if the API is online
2. [Recipes Endpoint](https://fusion-meals-new.onrender.com/recipes) - Should return recipes data

## Debugging the Frontend

In your deployed frontend application:

1. Open the browser's developer tools (F12 or Right-click → Inspect)
2. Go to the Console tab
3. Look for errors or request failures
4. Check the Network tab to see if API requests are being made correctly
5. Click on the "Run API Diagnostics" button in the Restaurant Recreator page to see detailed connection information

## Common Issues and Solutions

1. **CORS Issues**: If you see CORS errors in the console, the backend may need CORS configuration
   - Solution: Add appropriate CORS headers in the backend server

2. **Endpoint Structure Mismatch**: If the frontend is calling different endpoints than what's available
   - Solution: Update the frontend service to use the correct endpoints

3. **Mock Mode Enabled**: If `USE_MOCK_DATA` is set to true, the application will always use mock data
   - Solution: Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in environment variables

4. **Cold Start Delays**: Render free tier services may go to sleep after inactivity
   - Solution: The first request might be slow, try accessing the API directly to wake it up

5. **Empty Responses**: If the API returns empty arrays or objects
   - Solution: Make sure there's data in the database/JSON files on the backend

## Manual Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new request to `https://fusion-meals-new.onrender.com/recipes`
3. Send the request and examine the response
4. Try different endpoints and parameters

Remember to check the HTTP status codes:
- 200: Success
- 404: Endpoint not found
- 500: Server error 
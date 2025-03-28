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
    
    // Handle micronutrient analysis requests separately (these are lightweight and don't need the backend)
    if (body.request_type === "micronutrient_analysis") {
      console.log("Handling micronutrient analysis request");
      return handleMicronutrientAnalysis(body);
    }
    
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

// Function to handle micronutrient analysis requests locally
// This avoids making backend calls for these requests
async function handleMicronutrientAnalysis(body: any) {
  console.log("Generating micronutrient analysis for meals:", body.meals);
  
  try {
    // Use OpenAI API directly for micronutrient analysis
    // In a real app, you would use your OpenAI API key here
    // For now, we'll generate an estimated response
    
    // Extract meal info
    const { breakfast, lunch, dinner, snacks } = body.meals;
    
    // Simple analysis based on meal names and descriptions
    // This is a demo implementation - in production, you would use more sophisticated analysis
    const micronutrientAnalysis = generateEstimatedMicronutrients(breakfast, lunch, dinner, snacks);
    
    return NextResponse.json({
      premium_content: {
        micronutrient_analysis: micronutrientAnalysis
      },
      user_subscription: {
        level: "premium",
        expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      },
      request_remaining: 25
    });
  } catch (error) {
    console.error("Error generating micronutrient analysis:", error);
    return NextResponse.json(
      { 
        error: "Micronutrient analysis error",
        message: "Could not analyze the meals for micronutrients. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Function to generate estimated micronutrients based on meal info
function generateEstimatedMicronutrients(breakfast: string, lunch: string, dinner: string, snacks: string[]) {
  // This function creates reasonably realistic micronutrient estimates
  // based on keywords in the meal descriptions
  
  // Combine all meal info for keyword matching
  const allMeals = [breakfast, lunch, dinner, ...(snacks || [])].join(" ").toLowerCase();
  
  // Initialize micronutrient values
  const micronutrients: Record<string, string> = {};
  
  // Generate varying percentages based on meal content
  // Vitamin A
  const vitaminAPercentage = 
    allMeals.includes("carrot") || allMeals.includes("sweet potato") ? "95% DV" :
    allMeals.includes("spinach") || allMeals.includes("kale") ? "85% DV" :
    allMeals.includes("squash") || allMeals.includes("bell pepper") ? "75% DV" : 
    "65% DV";
  micronutrients.vitamin_a = vitaminAPercentage;
  
  // Vitamin C
  const vitaminCPercentage = 
    allMeals.includes("orange") || allMeals.includes("grapefruit") ? "120% DV" :
    allMeals.includes("strawberr") || allMeals.includes("kiwi") ? "110% DV" :
    allMeals.includes("broccoli") || allMeals.includes("bell pepper") ? "85% DV" : 
    "65% DV";
  micronutrients.vitamin_c = vitaminCPercentage;
  
  // Calcium
  const calciumPercentage = 
    allMeals.includes("milk") || allMeals.includes("yogurt") ? "85% DV" :
    allMeals.includes("cheese") || allMeals.includes("sardine") ? "75% DV" :
    allMeals.includes("tofu") || allMeals.includes("almond") ? "65% DV" : 
    "45% DV";
  micronutrients.calcium = calciumPercentage;
  
  // Iron
  const ironPercentage = 
    allMeals.includes("beef") || allMeals.includes("liver") ? "95% DV" :
    allMeals.includes("spinach") || allMeals.includes("lentil") ? "70% DV" :
    allMeals.includes("quinoa") || allMeals.includes("bean") ? "60% DV" : 
    "45% DV";
  micronutrients.iron = ironPercentage;
  
  // Add B vitamins
  micronutrients.vitamin_b1 = allMeals.includes("pork") || allMeals.includes("sunflower") ? "85% DV" : "60% DV";
  micronutrients.vitamin_b2 = allMeals.includes("beef") || allMeals.includes("yogurt") ? "90% DV" : "70% DV";
  micronutrients.vitamin_b3 = allMeals.includes("chicken") || allMeals.includes("tuna") ? "95% DV" : "75% DV";
  micronutrients.vitamin_b5 = allMeals.includes("avocado") || allMeals.includes("mushroom") ? "80% DV" : "65% DV";
  micronutrients.vitamin_b6 = allMeals.includes("banana") || allMeals.includes("potato") ? "85% DV" : "70% DV";
  micronutrients.vitamin_b12 = allMeals.includes("beef") || allMeals.includes("salmon") ? "120% DV" : "85% DV";
  micronutrients.folate = allMeals.includes("spinach") || allMeals.includes("asparagus") ? "90% DV" : "75% DV";
  
  // Add fat-soluble vitamins
  micronutrients.vitamin_d = allMeals.includes("salmon") || allMeals.includes("egg") ? "70% DV" : "40% DV";
  micronutrients.vitamin_e = allMeals.includes("sunflower") || allMeals.includes("almond") ? "85% DV" : "65% DV";
  micronutrients.vitamin_k = allMeals.includes("kale") || allMeals.includes("spinach") ? "120% DV" : "80% DV";
  
  // Add minerals
  micronutrients.magnesium = allMeals.includes("almond") || allMeals.includes("spinach") ? "75% DV" : "60% DV";
  micronutrients.phosphorus = allMeals.includes("cheese") || allMeals.includes("yogurt") ? "90% DV" : "75% DV";
  micronutrients.potassium = allMeals.includes("banana") || allMeals.includes("potato") ? "70% DV" : "55% DV";
  micronutrients.sodium = allMeals.includes("salt") || allMeals.includes("cheese") ? "85% DV" : "70% DV";
  micronutrients.zinc = allMeals.includes("oyster") || allMeals.includes("beef") ? "100% DV" : "75% DV";
  micronutrients.copper = allMeals.includes("cashew") || allMeals.includes("sunflower") ? "80% DV" : "65% DV";
  micronutrients.manganese = allMeals.includes("tofu") || allMeals.includes("brown rice") ? "90% DV" : "70% DV";
  micronutrients.selenium = allMeals.includes("brazil nut") || allMeals.includes("tuna") ? "120% DV" : "80% DV";
  micronutrients.iodine = allMeals.includes("seaweed") || allMeals.includes("cod") ? "95% DV" : "60% DV";
  
  // Add sources
  micronutrients.vitamin_a_sources = getSourcesForVitaminA(allMeals);
  micronutrients.b_vitamins_sources = getSourcesForBVitamins(allMeals);
  micronutrients.vitamin_c_sources = getSourcesForVitaminC(allMeals);
  micronutrients.vitamin_d_sources = getSourcesForVitaminD(allMeals);
  micronutrients.calcium_sources = getSourcesForCalcium(allMeals);
  micronutrients.iron_sources = getSourcesForIron(allMeals);
  micronutrients.magnesium_sources = getSourcesForMagnesium(allMeals);
  micronutrients.zinc_sources = getSourcesForZinc(allMeals);
  
  return micronutrients;
}

// Helper functions to identify micronutrient sources from meals
function getSourcesForVitaminA(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("carrot")) sources.push("Carrots");
  if (allMeals.includes("sweet potato")) sources.push("Sweet potatoes");
  if (allMeals.includes("spinach")) sources.push("Spinach");
  if (allMeals.includes("kale")) sources.push("Kale");
  if (allMeals.includes("bell pepper")) sources.push("Bell peppers");
  if (sources.length === 0) sources.push("Various vegetables in your meals");
  return sources.join(", ");
}

function getSourcesForBVitamins(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("chicken")) sources.push("Chicken");
  if (allMeals.includes("tuna")) sources.push("Tuna");
  if (allMeals.includes("beef")) sources.push("Beef");
  if (allMeals.includes("egg")) sources.push("Eggs");
  if (allMeals.includes("yogurt")) sources.push("Yogurt");
  if (sources.length === 0) sources.push("Various protein sources in your meals");
  return sources.join(", ");
}

function getSourcesForVitaminC(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("orange")) sources.push("Oranges");
  if (allMeals.includes("strawberr")) sources.push("Strawberries");
  if (allMeals.includes("kiwi")) sources.push("Kiwi");
  if (allMeals.includes("broccoli")) sources.push("Broccoli");
  if (allMeals.includes("bell pepper")) sources.push("Bell peppers");
  if (sources.length === 0) sources.push("Various fruits and vegetables in your meals");
  return sources.join(", ");
}

function getSourcesForVitaminD(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("salmon")) sources.push("Salmon");
  if (allMeals.includes("tuna")) sources.push("Tuna");
  if (allMeals.includes("egg")) sources.push("Eggs");
  if (allMeals.includes("mushroom")) sources.push("Mushrooms");
  if (sources.length === 0) sources.push("Limited natural sources in your meals");
  return sources.join(", ");
}

function getSourcesForCalcium(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("milk")) sources.push("Milk");
  if (allMeals.includes("yogurt")) sources.push("Yogurt");
  if (allMeals.includes("cheese")) sources.push("Cheese");
  if (allMeals.includes("tofu")) sources.push("Tofu");
  if (allMeals.includes("spinach")) sources.push("Spinach");
  if (sources.length === 0) sources.push("Various dairy and plant sources in your meals");
  return sources.join(", ");
}

function getSourcesForIron(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("beef")) sources.push("Beef");
  if (allMeals.includes("spinach")) sources.push("Spinach");
  if (allMeals.includes("lentil")) sources.push("Lentils");
  if (allMeals.includes("bean")) sources.push("Beans");
  if (allMeals.includes("tofu")) sources.push("Tofu");
  if (sources.length === 0) sources.push("Various protein sources in your meals");
  return sources.join(", ");
}

function getSourcesForMagnesium(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("almond")) sources.push("Almonds");
  if (allMeals.includes("spinach")) sources.push("Spinach");
  if (allMeals.includes("cashew")) sources.push("Cashews");
  if (allMeals.includes("avocado")) sources.push("Avocado");
  if (allMeals.includes("bean")) sources.push("Beans");
  if (sources.length === 0) sources.push("Various nuts, seeds, and vegetables in your meals");
  return sources.join(", ");
}

function getSourcesForZinc(allMeals: string): string {
  const sources = [];
  if (allMeals.includes("oyster")) sources.push("Oysters");
  if (allMeals.includes("beef")) sources.push("Beef");
  if (allMeals.includes("crab")) sources.push("Crab");
  if (allMeals.includes("chicken")) sources.push("Chicken");
  if (allMeals.includes("cashew")) sources.push("Cashews");
  if (sources.length === 0) sources.push("Various protein sources in your meals");
  return sources.join(", ");
}
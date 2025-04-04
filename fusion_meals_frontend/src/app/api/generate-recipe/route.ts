import { NextRequest, NextResponse } from 'next/server';

// Update the interface to match the backend's expected format
interface RecipeRequest {
  ingredients: string;  // Changed from string[] to string
  cuisine1: string;     // Changed from cuisine_type to cuisine1
  cuisine2: string;     // Added as required by backend
  dietary_preference?: string; // Changed from dietary_restrictions
  is_premium?: boolean;
  serving_size?: number;
  cooking_skill?: string;
}

export async function POST(request: NextRequest) {
  console.log("[API] Starting /api/generate-recipe request");
  
  try {
    const body = await request.json();
    console.log("[API] Request body processed");
    
    // Transform the frontend request to match the backend format
    const backendRequest: RecipeRequest = {
      ingredients: Array.isArray(body.ingredients) ? body.ingredients.join(', ') : body.ingredients,
      cuisine1: body.cuisine_type || 'Italian',
      cuisine2: body.meal_type || 'Asian',  // Using meal_type as second cuisine for now
      dietary_preference: Array.isArray(body.dietary_restrictions) ? body.dietary_restrictions[0] : (body.dietary_restrictions || 'None')
    };
    
    // Add optional fields if present
    if (body.is_premium !== undefined) {
      backendRequest.is_premium = !!body.is_premium;
    }
    
    if (body.serving_size !== undefined && !isNaN(Number(body.serving_size))) {
      backendRequest.serving_size = Number(body.serving_size);
    }
    
    if (body.cooking_skill) {
      backendRequest.cooking_skill = body.cooking_skill;
    }
    
    // Log the transformed request
    console.log("[API] Transformed request:", JSON.stringify(backendRequest).substring(0, 100) + "...");
    console.log("[API] Full request body:", JSON.stringify(backendRequest));
    
    try {
      // Forward the request to the backend API - get URL from environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';
      console.log('[API] Using API URL for generate-recipe:', apiUrl);
      
      // Increase timeout to 60 seconds to account for free tier cold starts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
      
      try {
        console.log('[API] Sending request to backend recipes/generate endpoint');
        console.log('[API] Full backend URL:', `${apiUrl}/recipes/generate`);
        
        // Ping the backend to wake it up if it's sleeping - with longer timeout
        try {
          console.log('[API] Waking up backend at:', `${apiUrl}/recipes/`);
          
          // Try multiple wake-up attempts with longer timeouts
          for (let i = 0; i < 3; i++) {
            try {
              const wakeupController = new AbortController();
              const wakeupTimeout = setTimeout(() => wakeupController.abort(), 10000); // 10-second timeout for wake-up
              
              console.log(`[API] Wake-up attempt ${i+1}/3`);
              const wakeupResponse = await fetch(`${apiUrl}/recipes/`, {
                method: 'GET',
                signal: wakeupController.signal
              });
              
              clearTimeout(wakeupTimeout);
              
              if (wakeupResponse.ok) {
                console.log('[API] Backend successfully woken up');
                console.log('[API] Wake-up response status:', wakeupResponse.status);
                try {
                  const wakeupData = await wakeupResponse.text();
                  console.log('[API] Wake-up response text:', wakeupData.substring(0, 200));
                } catch (parseError) {
                  console.log('[API] Could not parse wake-up response:', parseError);
                }
                break;
              } else {
                console.log(`[API] Wake-up attempt ${i+1} returned status: ${wakeupResponse.status}`);
                try {
                  const errorText = await wakeupResponse.text();
                  console.log(`[API] Wake-up error response body:`, errorText.substring(0, 200));
                } catch (readError) {
                  console.log('[API] Could not read wake-up error response:', readError);
                }
                
                // Wait before next attempt
                if (i < 2) {
                  console.log('[API] Waiting before next wake-up attempt...');
                  await new Promise(resolve => setTimeout(resolve, 5000));
                }
              }
            } catch (wakeupError) {
              console.log(`[API] Wake-up attempt ${i+1} error:`, wakeupError);
              // Wait before next attempt
              if (i < 2) {
                console.log('[API] Waiting before next wake-up attempt...');
                await new Promise(resolve => setTimeout(resolve, 5000));
              }
            }
          }
          
          console.log('[API] Wake-up sequence complete, proceeding with main request');
        } catch (wakingError) {
          console.log('[API] Error during backend wake-up sequence:', wakingError);
          // Continue anyway, the main request will still try
        }
        
        // Make the main request with retry logic
        let response = null;
        let retries = 0;
        const MAX_RETRIES = 3;
        
        while (retries <= MAX_RETRIES) {
          try {
            if (retries > 0) {
              console.log(`[API] Retry attempt ${retries}/${MAX_RETRIES}`);
              // Add longer delays between retries
              await new Promise(resolve => setTimeout(resolve, 5000 * retries));
            }
            
            console.log('[API] Sending main request to:', `${apiUrl}/recipes/generate`);
            console.log('[API] Request headers:', JSON.stringify({
              'Content-Type': 'application/json',
            }));
            
            response = await fetch(`${apiUrl}/recipes/generate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(backendRequest),
              signal: controller.signal,
            });
            
            console.log('[API] Response received, status:', response.status);
            
            if (response.ok) {
              console.log('[API] Request succeeded with status:', response.status);
              break; // Success, exit the retry loop
            } else {
              console.log(`[API] Request failed with status: ${response.status}, retrying...`);
              
              // Try to log the error response for debugging
              try {
                const errorText = await response.text();
                console.log('[API] Error response body:', errorText);
                
                // If it's a validation error (422), return more specific information
                if (response.status === 422) {
                  try {
                    // Try to parse the error as JSON
                    const errorData = JSON.parse(errorText);
                    console.log('[API] Validation error details:', errorData);
                    
                    // If we've reached max retries with a 422 error, throw with specific message
                    if (retries >= MAX_RETRIES) {
                      throw new Error(`Backend validation error: ${JSON.stringify(errorData)}`);
                    }
                  } catch {
                    // If not valid JSON, just use the text
                    if (retries >= MAX_RETRIES) {
                      throw new Error(`Backend validation error: ${errorText}`);
                    }
                  }
                }
              } catch (error) {
                console.log('[API] Could not read error response body:', error);
              }
              
              retries++;
              
              if (retries <= MAX_RETRIES) {
                // Add exponential backoff with longer delays
                await new Promise(resolve => setTimeout(resolve, 5000 * retries));
              }
            }
          } catch (fetchRetryError) {
            console.error(`[API] Fetch retry ${retries} error:`, fetchRetryError);
            retries++;
            
            if (retries <= MAX_RETRIES) {
              // Add exponential backoff with longer delays
              await new Promise(resolve => setTimeout(resolve, 5000 * retries));
            }
          }
        }
      
        clearTimeout(timeoutId);
        
        if (!response || !response.ok) {
          throw new Error(`Request failed after ${MAX_RETRIES} retries. Status: ${response?.status || 'unknown'}`);
        }
        
        console.log("[API] Backend response status:", response.status);
      
        // Process the successful response
        let data;
        try {
          const textResponse = await response.text();
          console.log('[API] Raw response text:', textResponse.substring(0, 200));
          data = JSON.parse(textResponse);
          console.log("[API] Successfully parsed response JSON");
        } catch (parseError) {
          console.error('[API] Error parsing response JSON:', parseError);
          throw parseError;
        }
        
        console.log("[API] Successfully received backend data");
        
        // Transform the backend response format to what the frontend expects
        const recipe = data.recipe || '';
        const recipeLines = recipe.split('\n').filter(Boolean);
        
        // Extract title from "Recipe Name: [Title]" line
        const titleLine = recipeLines.find((line: string) => line.includes('🍴 **Recipe Name**:')) || '';
        const title = titleLine.replace('🍴 **Recipe Name**:', '').trim();
        
        // Extract ingredients from lines between "Ingredients" and "Instructions"
        const ingredientsStartIndex = recipeLines.findIndex((line: string) => line.includes('**Ingredients**:'));
        const instructionsStartIndex = recipeLines.findIndex((line: string) => line.includes('**Instructions**:'));
        const ingredientLines = recipeLines.slice(ingredientsStartIndex + 1, instructionsStartIndex)
          .filter((line: string) => line.includes('-'))
          .map((line: string) => line.trim());
        
        // Extract instructions from numbered steps
        const instructionsEndIndex = recipeLines.findIndex((line: string) => line.includes('**Cooking Time**:'));
        const instructionLines = recipeLines.slice(instructionsStartIndex + 1, instructionsEndIndex)
          .filter((line: string) => /^\d+\./.test(line))
          .map((line: string) => line.trim());
        
        // Extract prep time and cook time
        const cookingTimeLine = recipeLines.find((line: string) => line.includes('⏰ **Cooking Time**:')) || '';
        const cookTime = cookingTimeLine.replace('⏰ **Cooking Time**:', '').trim();
        const prepTime = '15 minutes'; // Default value as it's not clearly provided in the response
        
        // Extract macro nutrients
        const macroStartIndex = recipeLines.findIndex((line: string) => line.includes('**Macronutrients**:'));
        const healthScoreIndex = recipeLines.findIndex((line: string) => line.includes('**Health Score**:'));
        const macroLines = recipeLines.slice(macroStartIndex + 1, healthScoreIndex);
        
        // Get protein, carbs, fat values
        const proteinLine = macroLines.find((line: string) => line.includes('Protein:')) || '';
        const carbsLine = macroLines.find((line: string) => line.includes('Carbs:')) || '';
        const fatsLine = macroLines.find((line: string) => line.includes('Fats:')) || '';
        
        const protein = proteinLine.replace('- Protein:', '').trim();
        const carbs = carbsLine.replace('- Carbs:', '').trim();
        const fat = fatsLine.replace('- Fats:', '').trim();
        
        // Extract calories
        const caloriesLine = recipeLines.find((line: string) => line.includes('🔥 **Calories per Serving**:')) || '';
        const caloriesStr = caloriesLine.replace('🔥 **Calories per Serving**:', '').trim();
        const calories = parseInt(caloriesStr) || 0;
        
        // Create the frontendResponse with the structure the frontend component expects
        const frontendResponse = {
          title: title || 'Delicious Recipe',
          description: `A ${backendRequest.cuisine1}-${backendRequest.cuisine2} fusion recipe featuring ${backendRequest.ingredients}.`,
          ingredients: ingredientLines,
          instructions: instructionLines,
          prep_time: prepTime,
          cook_time: cookTime,
          servings: 4, 
          difficulty: 'medium',
          tags: [backendRequest.cuisine1, backendRequest.cuisine2, backendRequest.dietary_preference].filter(Boolean),
          nutrition_info: {
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
          },
          image_url: data.image_url
        };
        
        console.log("[API] Sending frontend response");
        return NextResponse.json(frontendResponse);
      } catch (fetchError) {
        console.error('[API] Final fetch error:', fetchError);
        clearTimeout(timeoutId);
        throw fetchError; // Propagate the error for the outer catch block
      }
    } catch (backendError) {
      console.error('[API] Backend error:', backendError);
      throw backendError; // Propagate the error for the outer catch block
    }
  } catch (error) {
    console.error('[API] Error generating recipe:', error);
    
    // Check if this is an abort error (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          detail: 'Request timed out. The backend service takes longer than expected to respond. Please try again.',
          error: 'Timeout Error'
        },
        { status: 504 }
      );
    }
    
    // Check if this error contains the word "timeout"
    if (error instanceof Error && error.message.toLowerCase().includes('timeout')) {
      return NextResponse.json(
        { 
          detail: 'Request timed out. The backend service takes longer than expected to respond. Please try again.',
          error: 'Timeout Error'
        },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { 
        detail: 'Failed to generate recipe. Please check the server logs for more details.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 
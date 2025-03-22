import { NextRequest, NextResponse } from 'next/server';

// Frontend interface (what our components send)
interface FrontendMealPlanRequest {
  days: number;
  people: number;
  diet_type?: string;
  preferences?: string[];
  exclude?: string[];
}

// Backend interface (what the backend API expects)
interface BackendMealPlanRequest {
  diet_type: string;
  preferences: string;
}

interface Meal {
  name: string;
  recipe_link: string;
  ingredients: string[];
  prep_time: string;
  cook_time: string;
}

interface DayPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

interface MealPlan {
  days: DayPlan[];
  grocery_list: {
    [category: string]: string[];
  };
}

export async function POST(request: NextRequest) {
  console.log("[API] Starting /api/generate-meal-plan request");
  
  try {
    const req = await request.json() as FrontendMealPlanRequest;
    console.log("[API] Request body processed");
    
    // Transform the request to match what the backend expects
    const backendRequest: BackendMealPlanRequest = {
      diet_type: req.diet_type || 'balanced',
      preferences: Array.isArray(req.preferences) ? req.preferences.join(', ') : (typeof req.preferences === 'string' ? req.preferences : '')
    };
    
    // Add exclude items to preferences if they exist
    if (req.exclude && Array.isArray(req.exclude) && req.exclude.length > 0) {
      backendRequest.preferences += ` (excluding: ${req.exclude.join(', ')})`;
    }
    
    // Log the transformed request
    console.log("[API] Transformed request:", JSON.stringify(backendRequest).substring(0, 100) + "...");
    
    try {
      // Forward the request to the backend API - always use the Render URL in production
      // The local URL is only used for development
      const apiUrl = 'https://fusion-meals-new.onrender.com';
      console.log('[API] Using API URL for generate-meal-plan:', apiUrl);
      
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
                break;
              } else {
                console.log(`[API] Wake-up attempt ${i+1} returned status: ${wakeupResponse.status}`);
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
            
            response = await fetch(`${apiUrl}/recipes/generate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...backendRequest,
                is_meal_plan: true // Add a flag to indicate this is a meal plan request
              }),
              signal: controller.signal,
            });
            
            if (response.ok) {
              break; // Success, exit the retry loop
            } else {
              console.log(`[API] Request failed with status: ${response.status}, retrying...`);
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
        const data = await response.json();
        console.log("[API] Successfully received backend data");
        
        if (data && data.meal_plan) {
          try {
            // Transform markdown meal plan into structured data
            console.log("[API] Transforming markdown to structured data");
            const transformedMealPlan = parseMealPlanMarkdown(data.meal_plan, req.days || 7);
            return NextResponse.json(transformedMealPlan);
          } catch (parseError) {
            console.error('[API] Error parsing meal plan markdown:', parseError);
            throw parseError;
          }
        } else {
          throw new Error("No meal plan data in response");
        }
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
    console.error('[API] Error generating meal plan:', error);
    return NextResponse.json(
      { 
        detail: 'Failed to generate meal plan. The backend service (hosted on Render free tier) may be experiencing a cold start delay or temporary downtime. Please try again in a minute.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 504 }
    );
  }
}

// Function to parse the markdown meal plan into a structured format
function parseMealPlanMarkdown(markdownText: string, numDays: number): MealPlan {
  const lines = markdownText.split('\n').filter(line => line.trim() !== '');
  
  // Initialize meal plan structure
  const mealPlan: MealPlan = {
    days: [],
    grocery_list: {}
  };
  
  // Find where the meal plan days end and grocery list begins
  const groceryListIndex = lines.findIndex(line => line.includes('# 🛒 Weekly Grocery List'));
  
  // If grocery list section exists, parse it
  if (groceryListIndex !== -1) {
    let currentCategory = '';
    
    // Process grocery list lines
    for (let i = groceryListIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for category heading
      if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '').trim();
        mealPlan.grocery_list[currentCategory] = [];
      } 
      // Check for grocery items
      else if (line.startsWith('- ') && currentCategory) {
        const item = line.replace('- ', '').trim();
        mealPlan.grocery_list[currentCategory].push(item);
      }
    }
  }
  
  // Parse meal plan days
  let currentDay = -1;
  let currentMeal = '';
  
  for (let i = 0; i < (groceryListIndex !== -1 ? groceryListIndex : lines.length); i++) {
    const line = lines[i].trim();
    
    // Check for day heading
    if (line.startsWith('# Day ')) {
      currentDay++;
      currentMeal = '';
      
      // Initialize new day
      if (currentDay < numDays) {
        mealPlan.days[currentDay] = {
          breakfast: createEmptyMeal(),
          lunch: createEmptyMeal(),
          dinner: createEmptyMeal(),
          snacks: []
        };
      }
    } 
    // Check for meal heading
    else if (line.startsWith('## 🍳 Breakfast') && currentDay >= 0 && currentDay < numDays) {
      currentMeal = 'breakfast';
    } 
    else if (line.startsWith('## 🥗 Lunch') && currentDay >= 0 && currentDay < numDays) {
      currentMeal = 'lunch';
    } 
    else if (line.startsWith('## 🍲 Dinner') && currentDay >= 0 && currentDay < numDays) {
      currentMeal = 'dinner';
    } 
    else if (line.startsWith('## 🍌 Snacks') && currentDay >= 0 && currentDay < numDays) {
      currentMeal = 'snacks';
    } 
    // Process meal content
    else if (currentDay >= 0 && currentDay < numDays && currentMeal && line.length > 0) {
      // If it's a meal name (not a detail line)
      if (line.startsWith('**') && line.endsWith('**')) {
        const mealName = line.replace(/\*\*/g, '').trim();
        
        if (currentMeal === 'snacks') {
          // Add a new snack
          mealPlan.days[currentDay].snacks.push({
            name: mealName,
            recipe_link: '#',
            ingredients: generateIngredientsFromName(mealName),
            prep_time: '5 mins',
            cook_time: '0 mins'
          });
        } else if (currentMeal === 'breakfast' || currentMeal === 'lunch' || currentMeal === 'dinner') {
          // Update the main meal
          mealPlan.days[currentDay][currentMeal] = {
            name: mealName,
            recipe_link: '#',
            ingredients: generateIngredientsFromName(mealName),
            prep_time: currentMeal === 'breakfast' ? '5 mins' : '10 mins',
            cook_time: currentMeal === 'breakfast' ? '10 mins' : '20 mins'
          };
        }
      }
    }
  }
  
  return mealPlan;
}

function createEmptyMeal(): Meal {
  return {
    name: '',
    recipe_link: '#',
    ingredients: [],
    prep_time: '',
    cook_time: ''
  };
}

function generateIngredientsFromName(mealName: string): string[] {
  // Generate plausible ingredients based on the meal name
  const ingredients: string[] = [];
  const words = mealName.toLowerCase().split(' ');
  
  // Extract potential food items from the name
  words.forEach(word => {
    if (word.length > 3 && !['with', 'and', 'the', 'for', 'from', 'over'].includes(word)) {
      ingredients.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
  });
  
  // Add some basic ingredients
  ingredients.push('Salt');
  ingredients.push('Pepper');
  
  // Add cooking fat
  ingredients.push('Olive oil');
  
  return ingredients;
} 
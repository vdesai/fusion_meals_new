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
  ingredients: string;
  cuisine1: string;
  cuisine2: string;
  dietary_preference: string;
  is_meal_plan: boolean;
  days?: number;
  people?: number;
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
      ingredients: Array.isArray(req.preferences) ? req.preferences.join(', ') : (typeof req.preferences === 'string' ? req.preferences : ''),
      cuisine1: 'International',
      cuisine2: 'Fusion',
      dietary_preference: req.diet_type || 'balanced',
      is_meal_plan: true,
      days: req.days || 7,
      people: req.people || 4
    };
    
    // Add exclude items to ingredients if they exist
    if (req.exclude && Array.isArray(req.exclude) && req.exclude.length > 0) {
      backendRequest.ingredients += ` (excluding: ${req.exclude.join(', ')})`;
    }
    
    // Log the transformed request
    console.log("[API] Transformed request:", JSON.stringify(backendRequest).substring(0, 100) + "...");
    console.log("[API] Full request body:", JSON.stringify(backendRequest));
    
    try {
      // Forward the request to the backend API - always use the Render URL in production
      // The local URL is only used for development
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';
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
        
        // Add before making the main request:
        console.log('[API] Sending main request to:', `${apiUrl}/recipes/generate`);
        console.log('[API] Request headers:', JSON.stringify({
          'Content-Type': 'application/json',
        }));
        
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
        } else if (data && data.recipe) {
          // Handle case where backend returns a recipe instead of a meal plan
          try {
            console.log("[API] Backend returned a recipe instead of meal plan, converting format");
            // Convert the recipe to a simple meal plan format
            const simpleMealPlan = convertRecipeToMealPlan(data.recipe, req.days || 7);
            return NextResponse.json(simpleMealPlan);
          } catch (convertError) {
            console.error('[API] Error converting recipe to meal plan:', convertError);
            throw convertError;
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
        detail: 'Failed to generate meal plan. Please check the server logs for more details.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
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

// New function to convert a recipe to a meal plan format
function convertRecipeToMealPlan(recipeMarkdown: string, numDays: number): MealPlan {
  // Initialize meal plan structure
  const mealPlan: MealPlan = {
    days: [],
    grocery_list: {}
  };

  // Extract recipe name and ingredients from markdown
  const recipeName = recipeMarkdown.match(/\*\*Recipe Name\*\*\s*:\s*(.*?)(?:\n|$)/i)?.[1] || 'Fusion Recipe';
  const cuisineMatch = recipeName.match(/(Indian|Italian|Mexican|Chinese|Thai|Japanese|Mediterranean|French|Greek|Spanish|American|Asian|African|Middle Eastern|fusion)/i);
  const cuisineType = cuisineMatch ? cuisineMatch[1] : 'International';
  
  // Extract ingredients section
  const ingredientsMatch = recipeMarkdown.match(/\*\*Ingredients\*\*\s*:([\s\S]*?)(?:\n\n|$)/i);
  const ingredientsText = ingredientsMatch ? ingredientsMatch[1] : '';
  
  // Parse ingredients into categories
  const ingredientLines = ingredientsText.split('\n').filter(line => line.trim().startsWith('-'));
  const ingredients = ingredientLines.map(line => line.replace(/^-\s*/, '').trim());

  // Define grocery list categories with type safety
  const groceryCategories: Record<string, string[]> = {
    'Proteins': ingredients.filter(i => 
      /chicken|beef|pork|lamb|fish|tofu|tempeh|seitan|beans|lentils|chickpeas|eggs|paneer|cheese/i.test(i)),
    'Vegetables': ingredients.filter(i => 
      /carrot|onion|tomato|pepper|spinach|kale|lettuce|broccoli|cauliflower|zucchini|eggplant|potato|garlic|ginger|vegetables/i.test(i)),
    'Fruits': ingredients.filter(i => 
      /apple|banana|orange|mango|berry|berries|fruit|lemon|lime|avocado/i.test(i)),
    'Grains & Starches': ingredients.filter(i => 
      /rice|pasta|noodle|bread|flour|oats|quinoa|couscous|tortilla|grain/i.test(i)),
    'Dairy': ingredients.filter(i => 
      /milk|cream|yogurt|cheese|butter|ghee|curd/i.test(i) && !/almond milk|coconut milk|soy milk/i.test(i)),
    'Herbs & Spices': ingredients.filter(i => 
      /salt|pepper|cumin|coriander|basil|oregano|thyme|rosemary|parsley|cilantro|cinnamon|cardamom|herb|spice/i.test(i)),
    'Oils & Condiments': ingredients.filter(i => 
      /oil|vinegar|sauce|mayonnaise|mustard|ketchup|syrup|honey|seasoning/i.test(i)),
    'Other Ingredients': [] as string[]
  };

  // Add any remaining ingredients to 'Other Ingredients'
  const categorizedIngredients = Object.values(groceryCategories).flat();
  groceryCategories['Other Ingredients'] = ingredients.filter(i => 
    !categorizedIngredients.includes(i) && !i.includes('optional'));
  
  // Add optional ingredients category if any exist
  const optionalIngredients = ingredients.filter(i => i.includes('optional'));
  if (optionalIngredients.length > 0) {
    groceryCategories['Optional Ingredients'] = optionalIngredients;
  }

  // Remove empty categories
  Object.keys(groceryCategories).forEach(key => {
    if (groceryCategories[key].length === 0) {
      delete groceryCategories[key];
    } else {
      // Clean up the ingredient text (remove optional mentions, etc.)
      groceryCategories[key] = groceryCategories[key].map(i => 
        i.replace(/\(optional\)/i, '').trim());
    }
  });

  // Add common breakfast ingredients based on breakfast options
  groceryCategories['Breakfast Essentials'] = [
    'Eggs',
    'Milk',
    'Bread',
    'Oats',
    'Yogurt',
    'Fresh fruits',
    'Coffee/Tea'
  ];

  // Add cuisine-specific ingredients
  if (/indian/i.test(cuisineType)) {
    if (!groceryCategories['Spices & Herbs']) {
      groceryCategories['Spices & Herbs'] = [];
    }
    groceryCategories['Spices & Herbs'] = [
      ...groceryCategories['Spices & Herbs'],
      'Garam masala',
      'Turmeric',
      'Cumin seeds',
      'Mustard seeds',
      'Coriander powder'
    ];
  } else if (/italian/i.test(cuisineType)) {
    if (!groceryCategories['Herbs & Spices']) {
      groceryCategories['Herbs & Spices'] = [];
    }
    groceryCategories['Herbs & Spices'] = [
      ...groceryCategories['Herbs & Spices'],
      'Basil',
      'Oregano',
      'Parsley',
      'Italian seasoning'
    ];
  } else if (/asian/i.test(cuisineType)) {
    if (!groceryCategories['Condiments']) {
      groceryCategories['Condiments'] = [];
    }
    groceryCategories['Condiments'] = [
      ...groceryCategories['Condiments'],
      'Soy sauce',
      'Rice vinegar',
      'Sesame oil',
      'Sriracha/hot sauce'
    ];
  }

  // Add basic snack ingredients if not already included
  const snackIngredients = [
    'Mixed nuts',
    'Dried fruits',
    'Hummus',
    'Carrot sticks',
    'Cucumber',
    'Bell peppers',
    'Greek yogurt',
    'Honey',
    'Granola'
  ];
  
  if (!groceryCategories['Snacks']) {
    groceryCategories['Snacks'] = [];
  }
  
  snackIngredients.forEach(item => {
    // Only add if not already in other categories
    const isAlreadyInList = Object.values(groceryCategories).some(category => 
      category.some(ingredient => ingredient.toLowerCase().includes(item.toLowerCase()))
    );
    
    if (!isAlreadyInList) {
      groceryCategories['Snacks'].push(item);
    }
  });

  mealPlan.grocery_list = groceryCategories;

  // Generate breakfast options based on cuisine
  const breakfastOptions = [
    // International options
    'Overnight Oats with Fresh Fruit',
    'Greek Yogurt Parfait with Granola',
    'Avocado Toast with Poached Eggs',
    'Protein Smoothie Bowl',
    'Whole Grain Cereal with Fruit',
    // Cuisine-specific options
  ];

  // Add cuisine-specific breakfast options
  if (/indian/i.test(cuisineType)) {
    breakfastOptions.push('Masala Dosa with Coconut Chutney', 'Poha with Vegetables', 'Paneer Paratha', 'Upma with Mixed Vegetables');
  } else if (/italian/i.test(cuisineType)) {
    breakfastOptions.push('Italian Frittata with Vegetables', 'Ricotta Toast with Honey', 'Cornetto with Espresso');
  } else if (/mexican/i.test(cuisineType)) {
    breakfastOptions.push('Huevos Rancheros', 'Breakfast Burrito', 'Chilaquiles with Salsa');
  } else if (/asian|chinese|japanese|thai/i.test(cuisineType)) {
    breakfastOptions.push('Congee with Toppings', 'Steamed Buns with Tea', 'Rice Porridge with Vegetables');
  }

  // Generate a diverse meal plan
  for (let dayIndex = 0; dayIndex < numDays; dayIndex++) {
    // Create a breakfast with rotation
    const breakfast = {
      name: breakfastOptions[dayIndex % breakfastOptions.length],
      recipe_link: '#',
      ingredients: generateIngredientsFromName(breakfastOptions[dayIndex % breakfastOptions.length]),
      prep_time: '10 mins',
      cook_time: '15 mins',
    };

    // Create lunch and dinner with the main recipe but alternate
    const lunchName = dayIndex % 3 === 0 ? 
      recipeName : 
      (dayIndex % 3 === 1 ? `Leftover ${recipeName}` : `${cuisineType} Inspired Salad`);
    
    const dinnerName = dayIndex % 3 === 0 ? 
      `Variation of ${recipeName}` : 
      (dayIndex % 3 === 1 ? recipeName : `Simple ${cuisineType} Bowl`);

    // Create different snack options
    const snackOptions = [
      {
        name: 'Fresh Fruit & Nut Mix',
        recipe_link: '#',
        ingredients: ['Mixed nuts', 'Dried fruits', 'Fresh seasonal fruit'],
        prep_time: '5 mins',
        cook_time: '0 mins',
      },
      {
        name: 'Veggie Sticks with Hummus',
        recipe_link: '#',
        ingredients: ['Carrot sticks', 'Cucumber', 'Bell pepper', 'Hummus'],
        prep_time: '5 mins',
        cook_time: '0 mins',
      },
      {
        name: 'Greek Yogurt with Honey',
        recipe_link: '#',
        ingredients: ['Greek yogurt', 'Honey', 'Granola'],
        prep_time: '2 mins',
        cook_time: '0 mins',
      }
    ];

    const dayPlan: DayPlan = {
      breakfast: breakfast,
      lunch: {
        name: lunchName,
        recipe_link: '#',
        ingredients: ingredients,
        prep_time: dayIndex % 3 === 1 ? '5 mins' : '15 mins', // Quicker for leftovers
        cook_time: dayIndex % 3 === 1 ? '5 mins' : '25 mins',
      },
      dinner: {
        name: dinnerName,
        recipe_link: '#',
        ingredients: ingredients,
        prep_time: '20 mins',
        cook_time: '30 mins',
      },
      snacks: [
        snackOptions[dayIndex % snackOptions.length]
      ]
    };
    
    mealPlan.days.push(dayPlan);
  }

  // Log the structure of the generated meal plan
  console.log("[API] Generated meal plan with days:", mealPlan.days.length);
  console.log("[API] Grocery list categories:", Object.keys(mealPlan.grocery_list));

  return mealPlan;
} 
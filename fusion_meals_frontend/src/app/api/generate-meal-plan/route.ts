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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
      console.log('[API] Using API URL for generate-meal-plan:', apiUrl);
      
      // Add a timeout to the fetch request - reduce to just 10 seconds for Render free tier
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
      try {
        console.log('[API] Sending request to backend with timeout of 10 seconds');
        const response = await fetch(`${apiUrl}/meal-plans/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(backendRequest),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log("[API] Backend response status:", response.status);

        if (!response.ok) {
          console.log(`[API] Backend returned error status: ${response.status}`);
          
          try {
            const errorData = await response.json();
            console.error('[API] Backend API error:', errorData);
          } catch {
            console.error('[API] Could not parse error JSON from backend');
          }
          
          // If the backend fails, return mock data for demo purposes
          console.log("[API] Returning mock data after error response");
          return NextResponse.json(getMockMealPlan(req));
        }

        // Parse the response from the backend
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
            console.log("[API] Returning mock data after parse error");
            return NextResponse.json(getMockMealPlan(req));
          }
        }
        
        console.log("[API] No meal plan data in response, returning mock");
        return NextResponse.json(getMockMealPlan(req));
      } catch (fetchError) {
        console.error('[API] Fetch error:', fetchError);
        // Clear timeout if fetch failed
        clearTimeout(timeoutId);
        
        // Check if this was a timeout error
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          console.log('[API] Request timed out - using mock data');
          // Return a specific error code for timeouts
          return NextResponse.json({
            error: 'timeout',
            message: 'The meal plan generation request timed out',
            data: getMockMealPlan(req)
          }, { status: 200 });
        }
        
        console.log("[API] Returning mock data after fetch error");
        return NextResponse.json(getMockMealPlan(req));
      }
    } catch (backendError) {
      console.error('[API] Backend error:', backendError);
      console.log("[API] Returning mock data after backend error");
      return NextResponse.json(getMockMealPlan(req));
    }
  } catch (error) {
    console.error('[API] Error generating meal plan:', error);
    
    // Return mock data in case of any error
    console.log("[API] Returning mock data after top-level error");
    return NextResponse.json(getMockMealPlan({
      days: 3,
      people: 2,
      diet_type: 'balanced',
      preferences: [],
      exclude: []
    }));
  }
}

function getMockMealPlan(req: FrontendMealPlanRequest): MealPlan {
  const { days, diet_type } = req;
  
  const dietTypes = {
    'vegetarian': {
      breakfast: ['Avocado Toast with Egg', 'Yogurt Parfait', 'Green Smoothie Bowl', 'Overnight Oats'],
      lunch: ['Mediterranean Salad', 'Caprese Sandwich', 'Quinoa Bowl', 'Vegetable Wrap'],
      dinner: ['Eggplant Parmesan', 'Vegetable Stir Fry', 'Mushroom Risotto', 'Bean Chili'],
      snacks: ['Hummus with Veggies', 'Trail Mix', 'Greek Yogurt', 'Apple with Nut Butter']
    },
    'vegan': {
      breakfast: ['Tofu Scramble', 'Chia Pudding', 'Acai Bowl', 'Avocado Toast'],
      lunch: ['Buddha Bowl', 'Lentil Soup', 'Falafel Wrap', 'Quinoa Salad'],
      dinner: ['Vegan Curry', 'Chickpea Pasta', 'Vegetable Stew', 'Stuffed Bell Peppers'],
      snacks: ['Roasted Chickpeas', 'Energy Balls', 'Mixed Nuts', 'Fruit Salad']
    },
    'keto': {
      breakfast: ['Bacon and Eggs', 'Avocado and Salmon', 'Keto Smoothie', 'Cheese Omelette'],
      lunch: ['Cobb Salad', 'Tuna Lettuce Wraps', 'Cauliflower Soup', 'Zucchini Boats'],
      dinner: ['Steak with Asparagus', 'Salmon with Broccoli', 'Stuffed Mushrooms', 'Chicken Alfredo with Zoodles'],
      snacks: ['Cheese Crisps', 'Deviled Eggs', 'Pork Rinds', 'Keto Fat Bombs']
    },
    'default': {
      breakfast: ['Scrambled Eggs', 'Pancakes', 'Oatmeal', 'Breakfast Burrito'],
      lunch: ['Chicken Salad', 'Turkey Sandwich', 'Tomato Soup', 'Caesar Salad'],
      dinner: ['Spaghetti Bolognese', 'Grilled Chicken', 'Beef Stir Fry', 'Fish Tacos'],
      snacks: ['Popcorn', 'Apple Slices', 'Granola Bar', 'String Cheese']
    }
  };
  
  // Select appropriate diet type or default to balanced meals
  const meals = dietTypes[diet_type as keyof typeof dietTypes] || dietTypes.default;
  
  // Generate meal plan for the requested number of days
  const mealPlan: MealPlan = {
    days: [],
    grocery_list: {
      'Produce': [],
      'Protein': [],
      'Dairy': [],
      'Grains': [],
      'Canned Goods': [],
      'Frozen': [],
      'Condiments': [],
      'Snacks': []
    }
  };
  
  // Common groceries for each category
  const groceries = {
    'Produce': ['Apples', 'Bananas', 'Spinach', 'Carrots', 'Bell Peppers', 'Onions', 'Garlic', 'Tomatoes', 'Avocados', 'Lemons'],
    'Protein': ['Chicken Breast', 'Ground Beef', 'Salmon', 'Tofu', 'Eggs', 'Chickpeas', 'Black Beans', 'Lentils'],
    'Dairy': ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream'],
    'Grains': ['Rice', 'Pasta', 'Bread', 'Quinoa', 'Oats'],
    'Canned Goods': ['Beans', 'Diced Tomatoes', 'Corn', 'Tuna', 'Coconut Milk', 'Soup'],
    'Frozen': ['Mixed Vegetables', 'Berries', 'Pizza', 'Veggie Burgers'],
    'Condiments': ['Olive Oil', 'Soy Sauce', 'Mustard', 'Mayonnaise', 'Salsa', 'Honey'],
    'Snacks': ['Nuts', 'Dried Fruit', 'Crackers', 'Popcorn', 'Granola Bars']
  };
  
  // Populate grocery list based on diet type
  for (const category in groceries) {
    const itemsInCategory = groceries[category as keyof typeof groceries];
    
    // Add 5-8 random items from each category
    const numItems = Math.floor(Math.random() * 4) + 5; // 5-8 items
    
    for (let i = 0; i < numItems && i < itemsInCategory.length; i++) {
      const randomIndex = Math.floor(Math.random() * itemsInCategory.length);
      const item = itemsInCategory[randomIndex];
      
      if (!mealPlan.grocery_list[category].includes(item)) {
        mealPlan.grocery_list[category].push(item);
      }
    }
  }
  
  // Generate a random meal with ingredients
  function generateMeal(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'): Meal {
    const mealOptions = meals[mealType];
    const randomIndex = Math.floor(Math.random() * mealOptions.length);
    const mealName = mealOptions[randomIndex];
    
    // Generate 3-6 random ingredients
    const ingredients = [];
    const numIngredients = Math.floor(Math.random() * 4) + 3; // 3-6 ingredients
    
    for (let i = 0; i < numIngredients; i++) {
      const categories = Object.keys(groceries);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const groceryItems = groceries[randomCategory as keyof typeof groceries];
      const randomItem = groceryItems[Math.floor(Math.random() * groceryItems.length)];
      
      // Add quantity
      const quantity = Math.floor(Math.random() * 3) + 1;
      const units = ['cup', 'tbsp', 'tsp', 'oz', 'g', ''];
      const randomUnit = units[Math.floor(Math.random() * units.length)];
      
      ingredients.push(`${quantity} ${randomUnit} ${randomItem}`.trim());
    }
    
    // Generate random prep and cook times
    const prepTime = `${Math.floor(Math.random() * 20) + 5} mins`;
    const cookTime = `${Math.floor(Math.random() * 30) + 10} mins`;
    
    return {
      name: mealName,
      recipe_link: '#', // Placeholder for actual recipe links
      ingredients,
      prep_time: prepTime,
      cook_time: cookTime
    };
  }
  
  // Generate meal plan for each day
  for (let i = 0; i < days; i++) {
    const breakfast = generateMeal('breakfast');
    const lunch = generateMeal('lunch');
    const dinner = generateMeal('dinner');
    
    // Generate 1-2 snacks
    const numSnacks = Math.floor(Math.random() * 2) + 1;
    const snacks = [];
    for (let j = 0; j < numSnacks; j++) {
      snacks.push(generateMeal('snacks'));
    }
    
    mealPlan.days.push({
      breakfast,
      lunch,
      dinner,
      snacks
    });
  }
  
  return mealPlan;
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
  
  // Process meal plan days
  let currentDay: DayPlan | null = null;
  
  for (let i = 0; i < (groceryListIndex !== -1 ? groceryListIndex : lines.length); i++) {
    const line = lines[i];
    
    // Check if this is a day header
    if (line.match(/^## Day \d+/)) {
      // If we already have a day object, add it to the meal plan
      if (currentDay !== null) {
        mealPlan.days.push(currentDay);
      }
      
      // Start a new day
      currentDay = {
        breakfast: createEmptyMeal(),
        lunch: createEmptyMeal(),
        dinner: createEmptyMeal(),
        snacks: []
      };
    } 
    // Process meal items
    else if (currentDay !== null && line.startsWith('- ')) {
      if (line.includes('**Breakfast**')) {
        currentDay.breakfast = parseMarkdownMeal(line);
      } else if (line.includes('**Lunch**')) {
        currentDay.lunch = parseMarkdownMeal(line);
      } else if (line.includes('**Dinner**')) {
        currentDay.dinner = parseMarkdownMeal(line);
      } else if (line.includes('**Snack**')) {
        currentDay.snacks.push(parseMarkdownMeal(line));
      }
    }
  }
  
  // Add the last day if it exists
  if (currentDay !== null) {
    mealPlan.days.push(currentDay);
  }
  
  // Process grocery list
  if (groceryListIndex !== -1) {
    let currentCategory = '';
    
    for (let i = groceryListIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is a category header
      if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '').trim();
        mealPlan.grocery_list[currentCategory] = [];
      } 
      // Process grocery item
      else if (currentCategory && line.startsWith('- ')) {
        const item = line.replace('- ', '').trim();
        mealPlan.grocery_list[currentCategory].push(item);
      }
    }
  }
  
  // Ensure we have the requested number of days
  while (mealPlan.days.length < numDays) {
    // Clone the last day if we have at least one
    if (mealPlan.days.length > 0) {
      const lastDay = mealPlan.days[mealPlan.days.length - 1];
      mealPlan.days.push(JSON.parse(JSON.stringify(lastDay)));
    } else {
      // Create an empty day if we somehow have no days
      mealPlan.days.push({
        breakfast: createEmptyMeal(),
        lunch: createEmptyMeal(),
        dinner: createEmptyMeal(),
        snacks: []
      });
    }
  }
  
  // Trim to requested number of days
  mealPlan.days = mealPlan.days.slice(0, numDays);
  
  return mealPlan;
}

// Helper function to create an empty meal object
function createEmptyMeal(): Meal {
  return {
    name: '',
    recipe_link: '#',
    ingredients: [],
    prep_time: '10 mins',
    cook_time: '20 mins'
  };
}

// Helper function to parse a meal from markdown
function parseMarkdownMeal(markdownMeal: string): Meal {
  // Extract meal name
  const nameMatch = markdownMeal.match(/\*\*(Breakfast|Lunch|Dinner|Snack)\*\*: (.*?)(\.|$)/);
  const name = nameMatch ? nameMatch[2].trim() : '';
  
  // Create a meal object
  return {
    name,
    recipe_link: '#', // Placeholder for actual links
    ingredients: generateIngredientsFromName(name), // Generate some plausible ingredients from the name
    prep_time: `${Math.floor(Math.random() * 15) + 5} mins`,
    cook_time: `${Math.floor(Math.random() * 30) + 10} mins`
  };
}

// Helper function to generate plausible ingredients from a meal name
function generateIngredientsFromName(mealName: string): string[] {
  // This is a simple approximation - in a real app, you'd have more sophisticated logic
  // or you'd extract these from the actual recipe
  const ingredients: string[] = [];
  
  // Split the meal name into words and use them to guess ingredients
  const words = mealName.toLowerCase().split(/\s+/);
  
  // Common cooking ingredients
  ingredients.push('Salt and pepper');
  ingredients.push('Olive oil');
  
  // Add words from the title that might be ingredients
  for (const word of words) {
    if (['with', 'and', 'a', 'of', 'the', 'topped', 'served', 'side'].includes(word)) {
      continue; // Skip common non-ingredient words
    }
    
    // Add the word as an ingredient if it's not already included
    const ingredient = word.charAt(0).toUpperCase() + word.slice(1);
    if (!ingredients.some(ing => ing.toLowerCase().includes(word))) {
      ingredients.push(ingredient);
    }
  }
  
  // Add some quantity approximations
  return ingredients.map(ing => {
    if (ing === 'Salt and pepper' || ing === 'Olive oil') {
      return ing;
    }
    const quantity = Math.floor(Math.random() * 3) + 1;
    const units = ['cup', 'tbsp', 'tsp', 'oz', 'g', ''];
    const unit = units[Math.floor(Math.random() * units.length)];
    return `${quantity} ${unit} ${ing}`.trim();
  });
} 
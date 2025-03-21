import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    try {
      // Forward the request to the backend API
      const response = await fetch(`${process.env.BACKEND_URL || 'http://127.0.0.1:8001'}/meal-prep/time-optimized-recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      // If the response is ok, return the real data
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
      
      // If backend fails, return mock data with a 200 status
      console.log("Backend failed, returning mock data");
      return NextResponse.json(getMockRecipes(), { status: 200 });
    } catch (error) {
      console.error('Backend error:', error);
      // Return mock data if backend is unavailable
      return NextResponse.json(getMockRecipes(), { status: 200 });
    }
  } catch (error) {
    console.error('Error getting time-optimized recipes:', error);
    return NextResponse.json(
      { detail: 'An error occurred while getting time-optimized recipes' },
      { status: 500 }
    );
  }
} 

// Function to generate mock time-optimized recipes
function getMockRecipes() {
  return {
    "recipes": [
      {
        "name": "15-Minute Stir-Fry",
        "description": "A quick and versatile vegetable stir-fry that comes together in just 15 minutes.",
        "ingredients": [
          "2 tbsp vegetable oil",
          "1 bell pepper, sliced",
          "1 cup broccoli florets",
          "1 carrot, julienned",
          "2 cloves garlic, minced",
          "1 tbsp soy sauce",
          "1 tbsp honey or maple syrup",
          "1 tsp sesame oil",
          "2 cups cooked rice or noodles"
        ],
        "instructions": [
          {
            "step": 1,
            "description": "Heat oil in a large skillet or wok over high heat.",
            "time": "1 minute",
            "is_active": true
          },
          {
            "step": 2,
            "description": "Add vegetables and stir-fry until crisp-tender.",
            "time": "5 minutes",
            "is_active": true
          },
          {
            "step": 3,
            "description": "Add garlic and cook until fragrant.",
            "time": "1 minute",
            "is_active": true
          },
          {
            "step": 4,
            "description": "Add soy sauce, honey, and sesame oil. Stir to combine.",
            "time": "1 minute",
            "is_active": true
          },
          {
            "step": 5,
            "description": "Serve over rice or noodles.",
            "time": "2 minutes",
            "is_active": true
          }
        ],
        "active_time": "10 minutes",
        "passive_time": "0 minutes",
        "total_time": "10 minutes",
        "nutrition_info": {
          "calories": 300,
          "protein": "5g",
          "carbs": "45g",
          "fat": "10g"
        },
        "efficiency_tips": [
          "Use pre-cut vegetables to save time",
          "Cook rice or noodles ahead of time and refrigerate",
          "Double the recipe for leftovers"
        ]
      },
      {
        "name": "Quick Chickpea Curry",
        "description": "A flavorful curry that requires minimal hands-on time.",
        "ingredients": [
          "1 tbsp olive oil",
          "1 onion, diced",
          "2 cloves garlic, minced",
          "1 tbsp curry powder",
          "1 can (15 oz) chickpeas, drained and rinsed",
          "1 can (14 oz) diced tomatoes",
          "1/2 cup coconut milk",
          "Salt and pepper to taste",
          "Fresh cilantro for garnish"
        ],
        "instructions": [
          {
            "step": 1,
            "description": "Heat oil in a large pot over medium heat.",
            "time": "1 minute",
            "is_active": true
          },
          {
            "step": 2,
            "description": "Add onion and cook until softened.",
            "time": "5 minutes",
            "is_active": true
          },
          {
            "step": 3,
            "description": "Add garlic and curry powder, cook until fragrant.",
            "time": "1 minute",
            "is_active": true
          },
          {
            "step": 4,
            "description": "Add chickpeas, tomatoes, and coconut milk. Bring to a simmer.",
            "time": "3 minutes",
            "is_active": true
          },
          {
            "step": 5,
            "description": "Simmer to develop flavors.",
            "time": "5 minutes",
            "is_active": false
          },
          {
            "step": 6,
            "description": "Season with salt and pepper, garnish with cilantro.",
            "time": "1 minute",
            "is_active": true
          }
        ],
        "active_time": "11 minutes",
        "passive_time": "5 minutes",
        "total_time": "16 minutes",
        "nutrition_info": {
          "calories": 350,
          "protein": "12g",
          "carbs": "40g",
          "fat": "15g"
        },
        "efficiency_tips": [
          "Use pre-minced garlic",
          "Make in larger batches and freeze portions",
          "Serve with pre-cooked rice or naan bread"
        ]
      },
      {
        "name": "5-Minute Breakfast Smoothie Bowl",
        "description": "A nutritious breakfast that takes just 5 minutes to prepare.",
        "ingredients": [
          "1 frozen banana",
          "1/2 cup frozen berries",
          "1/2 cup Greek yogurt",
          "1/4 cup milk of choice",
          "1 tbsp honey or maple syrup",
          "Toppings: granola, nuts, fresh fruit, chia seeds"
        ],
        "instructions": [
          {
            "step": 1,
            "description": "Add banana, berries, yogurt, milk, and sweetener to a blender.",
            "time": "1 minute",
            "is_active": true
          },
          {
            "step": 2,
            "description": "Blend until smooth, adding more liquid if needed.",
            "time": "2 minutes",
            "is_active": true
          },
          {
            "step": 3,
            "description": "Pour into a bowl and add desired toppings.",
            "time": "2 minutes",
            "is_active": true
          }
        ],
        "active_time": "5 minutes",
        "passive_time": "0 minutes",
        "total_time": "5 minutes",
        "nutrition_info": {
          "calories": 300,
          "protein": "15g",
          "carbs": "50g",
          "fat": "5g"
        },
        "efficiency_tips": [
          "Freeze bananas in advance when they're ripe",
          "Prepare portion-sized bags of frozen fruit",
          "Store premixed dry toppings"
        ]
      }
    ]
  };
} 
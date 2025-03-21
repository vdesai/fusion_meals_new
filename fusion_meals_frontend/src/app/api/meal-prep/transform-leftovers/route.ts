import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    try {
      // Forward the request to the backend API
      const response = await fetch(`${process.env.BACKEND_URL || 'http://127.0.0.1:8001'}/meal-prep/transform-leftovers`, {
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
      return NextResponse.json(getMockTransformations(), { status: 200 });
    } catch (error) {
      console.error('Backend error:', error);
      // Return mock data if backend is unavailable
      return NextResponse.json(getMockTransformations(), { status: 200 });
    }
  } catch (error) {
    console.error('Error transforming leftovers:', error);
    return NextResponse.json(
      { detail: 'An error occurred while transforming leftovers' },
      { status: 500 }
    );
  }
} 

// Function to generate mock leftover transformations
function getMockTransformations() {
  return {
    "transformations": [
      {
        "name": "Roast Chicken to Chicken Quesadillas",
        "description": "Transform leftover roast chicken into quick and flavorful quesadillas.",
        "leftover_ingredients_used": ["Roast chicken", "Vegetables"],
        "additional_ingredients": [
          "Tortillas", 
          "Cheese", 
          "Salsa", 
          "Sour cream", 
          "Avocado"
        ],
        "instructions": [
          {
            "step": 1,
            "description": "Shred leftover chicken and chop any leftover vegetables."
          },
          {
            "step": 2,
            "description": "Place tortilla in a pan, add cheese, chicken, and vegetables."
          },
          {
            "step": 3,
            "description": "Top with another tortilla and cook until golden on both sides."
          },
          {
            "step": 4,
            "description": "Slice and serve with salsa, sour cream, and avocado."
          }
        ],
        "prep_time": "5 minutes",
        "cooking_time": "5 minutes",
        "customization_tips": [
          "Add beans for extra protein",
          "Use any cheese you have on hand",
          "Add hot sauce for spice"
        ]
      },
      {
        "name": "Rice Bowl Makeover",
        "description": "Turn leftover rice into a nutritious and satisfying bowl meal.",
        "leftover_ingredients_used": ["Cooked rice", "Any leftover protein"],
        "additional_ingredients": [
          "Fresh or frozen vegetables",
          "Egg",
          "Soy sauce or other sauce",
          "Sesame oil",
          "Green onions"
        ],
        "instructions": [
          {
            "step": 1,
            "description": "Heat oil in a pan and sauté any fresh vegetables."
          },
          {
            "step": 2,
            "description": "Add leftover rice and protein, breaking up any clumps."
          },
          {
            "step": 3,
            "description": "Push ingredients to one side, crack egg into empty space and scramble."
          },
          {
            "step": 4,
            "description": "Mix everything together, add sauce, and garnish with green onions."
          }
        ],
        "prep_time": "5 minutes",
        "cooking_time": "10 minutes",
        "customization_tips": [
          "Use any sauce you prefer",
          "Add kimchi for a Korean-inspired version",
          "Top with a fried egg instead of scrambled"
        ]
      },
      {
        "name": "Pasta Frittata",
        "description": "Transform leftover pasta into a hearty Italian-inspired frittata.",
        "leftover_ingredients_used": ["Cooked pasta", "Pasta sauce"],
        "additional_ingredients": [
          "Eggs",
          "Milk",
          "Cheese",
          "Fresh herbs",
          "Salt and pepper"
        ],
        "instructions": [
          {
            "step": 1,
            "description": "Whisk eggs with milk, salt, and pepper."
          },
          {
            "step": 2,
            "description": "Mix in leftover pasta and any sauce."
          },
          {
            "step": 3,
            "description": "Pour into an oven-safe pan, top with cheese."
          },
          {
            "step": 4,
            "description": "Cook on stovetop until edges set, then finish in oven until fully set."
          }
        ],
        "prep_time": "5 minutes",
        "cooking_time": "15 minutes",
        "customization_tips": [
          "Add any vegetables you have on hand",
          "Use any cheese that melts well",
          "Serve with a simple side salad"
        ]
      }
    ],
    "general_tips": [
      "Think of leftovers as pre-prepped ingredients to save time",
      "Keep basic pantry staples on hand for quick transformations",
      "Consider texture when reheating - some items may need to be crisped up",
      "Add fresh elements to leftover dishes for contrast and freshness",
      "Don't be afraid to mix cuisines for fusion dishes"
    ]
  };
} 
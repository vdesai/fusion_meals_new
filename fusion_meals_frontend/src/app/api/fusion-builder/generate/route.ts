import { NextRequest, NextResponse } from 'next/server';

// Define the interface for the frontend request
interface FusionBuilderRequest {
  cuisines: string[];
  techniques: string[];
  flavorProfile: {
    sweet: number;
    salty: number;
    sour: number;
    spicy: number;
    umami: number;
    bitter: number;
  };
  preferences: {
    dietaryRestrictions: string[];
    mealType: string;
    complexity: string;
    prepTime: number;
    servings: number;
  };
}

// Backend request interface to match the existing backend route
interface BackendRecipeRequest {
  ingredients: string;  // We'll use techniques as ingredients
  cuisine1: string;     // Primary cuisine
  cuisine2: string;     // Secondary cuisine
  dietary_preference?: string; // From dietaryRestrictions
  is_premium?: boolean; // Always true for fusion builder
  serving_size?: number; // From preferences.servings
  cooking_skill?: string; // From preferences.complexity
  flavor_profile?: Record<string, number>; // From flavorProfile
  meal_type?: string; // From preferences.mealType
  prep_time?: number; // From preferences.prepTime
}

export async function POST(request: NextRequest) {
  console.log("[API] Starting /api/fusion-builder/generate request");
  
  try {
    const body = await request.json() as FusionBuilderRequest;
    console.log("[API] Request body processed");
    
    if (!body.cuisines || body.cuisines.length < 2) {
      return NextResponse.json(
        { error: "At least 2 cuisines are required" },
        { status: 400 }
      );
    }
    
    // Transform the frontend request to match the backend format
    const backendRequest: BackendRecipeRequest = {
      // Join techniques as "ingredients" string
      ingredients: body.techniques.join(', '),
      // Use the first two cuisines as primary and secondary
      cuisine1: body.cuisines[0],
      cuisine2: body.cuisines[1],
      // Take first dietary restriction or send "None"
      dietary_preference: body.preferences.dietaryRestrictions.length > 0 
        ? body.preferences.dietaryRestrictions[0] 
        : 'None',
      is_premium: true,
      serving_size: body.preferences.servings,
      cooking_skill: body.preferences.complexity === 'easy' 
        ? 'beginner' 
        : body.preferences.complexity === 'hard' 
          ? 'advanced' 
          : 'intermediate',
      flavor_profile: body.flavorProfile,
      meal_type: body.preferences.mealType,
      prep_time: body.preferences.prepTime
    };
    
    // Log the transformed request
    console.log("[API] Transformed request:", JSON.stringify(backendRequest).substring(0, 100) + "...");
    console.log("[API] Full request body:", JSON.stringify(backendRequest));
    
    try {
      // Forward the request to the backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';
      console.log('[API] Using API URL for fusion recipe:', apiUrl);
      
      // Increase timeout to 60 seconds to account for free tier cold starts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
      
      try {
        console.log('[API] Sending request to backend recipes/generate endpoint');
        console.log('[API] Full backend URL:', `${apiUrl}/recipes/generate`);
        
        // Ping the backend to wake it up if it's sleeping
        try {
          console.log('[API] Waking up backend at:', `${apiUrl}/recipes/`);
          await fetch(`${apiUrl}/recipes/`, { 
            method: 'GET',
            signal: AbortSignal.timeout(10000) // 10-second timeout for ping
          });
          console.log('[API] Backend ping completed');
        } catch (pingError) {
          console.log('[API] Backend ping failed, continuing anyway:', pingError);
          // Continue even if ping fails
        }
        
        // Call the backend API
        const response = await fetch(`${apiUrl}/recipes/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendRequest),
          signal: controller.signal,
        });
        
        console.log('[API] Response received, status:', response.status);
        
        if (!response.ok) {
          console.error('[API] Backend error:', response.status, response.statusText);
          throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        }
        
        // Parse the backend response
        const data = await response.json();
        console.log('[API] Response data received');
        
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        // Process the response data to extract important details
        const recipeText = data.recipe || '';
        
        // Extract recipe details from markdown
        const titleMatch = recipeText.match(/🍴\s*\*\*Recipe Name\*\*:\s*(.+?)(?=\n|$)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Fusion Recipe';
        
        // Extract ingredients
        const ingredientsSection = recipeText.match(/🛒\s*\*\*Ingredients\*\*:([\s\S]*?)(?=👩‍🍳\s*\*\*Instructions\*\*|$)/);
        const ingredientText = ingredientsSection ? ingredientsSection[1] : '';
        const ingredientLines = ingredientText
          .split('\n')
          .map((line: string) => line.replace(/^-\s*\*\*.*?\*\*:\s*/, '').replace(/^-\s*/, '').trim())
          .filter((line: string) => line.length > 0);
        
        // Extract instructions
        const instructionsSection = recipeText.match(/👩‍🍳\s*\*\*Instructions\*\*:([\s\S]*?)(?=⏰\s*\*\*Cooking Time\*\*|$)/);
        const instructionText = instructionsSection ? instructionsSection[1] : '';
        const instructionLines = instructionText
          .split('\n')
          .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
          .filter((line: string) => line.length > 0);
        
        // Extract cooking time
        const cookingTimeMatch = recipeText.match(/⏰\s*\*\*Cooking Time\*\*:\s*(.+?)(?=\n|$)/);
        const cookingTime = cookingTimeMatch ? cookingTimeMatch[1].trim() : '30 minutes';
        
        // Extract nutritional info
        const caloriesMatch = recipeText.match(/🔥\s*\*\*Calories per Serving\*\*:\s*(\d+)/);
        const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 400;
        
        const proteinMatch = recipeText.match(/Protein:\s*(\d+)g/);
        const protein = proteinMatch ? parseInt(proteinMatch[1]) : 15;
        
        const carbsMatch = recipeText.match(/Carbs:\s*(\d+)g/);
        const carbs = carbsMatch ? parseInt(carbsMatch[1]) : 45;
        
        const fatsMatch = recipeText.match(/Fats:\s*(\d+)g/);
        const fat = fatsMatch ? parseInt(fatsMatch[1]) : 15;
        
        // Create the frontendResponse with the structure our FusionResult component expects
        const frontendResponse = {
          name: title,
          description: `A fusion recipe combining ${body.cuisines[0]} and ${body.cuisines[1]} cuisines, featuring ${body.techniques.slice(0, 2).join(' and ')} techniques.`,
          ingredients: ingredientLines,
          instructions: instructionLines,
          cookingTime: cookingTime,
          servings: body.preferences.servings,
          difficultyLevel: body.preferences.complexity.charAt(0).toUpperCase() + body.preferences.complexity.slice(1),
          nutritionalInfo: {
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
          },
          cuisineFusion: {
            primary: body.cuisines[0],
            secondary: body.cuisines[1],
            techniques: body.techniques.slice(0, 3),
            flavorProfile: Object.entries(body.flavorProfile)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([flavor]) => flavor)
              .join(', ') + ' forward'
          },
          image: data.image_url || '/images/generated/thai-italian-fusion.jpg'
        };
        
        console.log("[API] Sending frontend response");
        return NextResponse.json(frontendResponse);
      } catch (fetchError) {
        console.error('[API] Fetch error:', fetchError);
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (backendError) {
      console.error('[API] Backend error:', backendError);
      
      // Return a fallback response with mock data
      console.log('[API] Returning fallback mock data due to backend error');
      return NextResponse.json({
        name: `${body.cuisines[0]}-${body.cuisines[1]} Fusion Recipe`,
        description: `A fusion recipe combining ${body.cuisines[0]} and ${body.cuisines[1]} cuisines, featuring ${body.techniques.slice(0, 2).join(' and ')} techniques.`,
        ingredients: [
          "8 oz linguine pasta",
          "1 cup coconut milk",
          "2 tbsp red curry paste",
          "1/4 cup fresh basil, chopped",
          "1/4 cup fresh cilantro, chopped",
          "2 tbsp olive oil",
          "3 cloves garlic, minced",
          "1 red bell pepper, sliced thin",
          "1 cup cherry tomatoes, halved",
          "2 tbsp fish sauce (or soy sauce for vegetarian)",
          "1 lime, juiced",
          "1/4 cup grated Parmesan cheese"
        ],
        instructions: [
          "Bring a large pot of salted water to a boil. Cook linguine according to package directions until al dente.",
          "While pasta cooks, heat olive oil in a large skillet over medium heat. Add garlic and sauté until fragrant.",
          "Add red bell pepper and cherry tomatoes, cooking until softened.",
          "Stir in red curry paste and cook for 1 minute until fragrant.",
          "Pour in coconut milk and bring to a simmer. Cook for 2-3 minutes until slightly thickened.",
          "Add drained pasta to the sauce, tossing to coat.",
          "Remove from heat and stir in fresh basil, cilantro, and half of the Parmesan cheese.",
          "Season with salt, pepper, and red pepper flakes to taste.",
          "Serve immediately, garnished with remaining Parmesan cheese."
        ],
        cookingTime: `${body.preferences.prepTime} minutes`,
        servings: body.preferences.servings,
        difficultyLevel: body.preferences.complexity.charAt(0).toUpperCase() + body.preferences.complexity.slice(1),
        nutritionalInfo: {
          calories: 450,
          protein: 12,
          carbs: 58,
          fat: 18
        },
        cuisineFusion: {
          primary: body.cuisines[0],
          secondary: body.cuisines[1],
          techniques: body.techniques.slice(0, 3),
          flavorProfile: Object.entries(body.flavorProfile)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([flavor]) => flavor)
            .join(', ') + ' forward'
        },
        image: '/images/generated/thai-italian-fusion.jpg'
      });
    }
  } catch (error) {
    console.error('Error generating fusion recipe:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the fusion recipe' },
      { status: 500 }
    );
  }
} 
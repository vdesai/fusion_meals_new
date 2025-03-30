/**
 * API Adapter Service
 * 
 * This service adapts our local API endpoint structure to the production API structure
 * on the Render deployment at https://fusion-meals-new.onrender.com
 */

import axios from 'axios';
import { DishTransformation } from '../types/restaurant';

// The actual production API URL
const PRODUCTION_API_URL = 'https://fusion-meals-new.onrender.com';

/**
 * Maps our local endpoints to production endpoints
 */
const endpointMap = {
  'search': '/recipes', // Map dish search to recipes endpoint
  'popular': '/recipes?popular=true', // Map popular dishes to recipes with a flag
  'dish': '/recipes', // Map individual dish to recipes endpoint
  'saved': '/recipe-sharing' // Map saved transformations to recipe sharing
};

/**
 * Checks if the API is available and properly configured
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(PRODUCTION_API_URL, { timeout: 5000 });
    console.log('Production API health check:', response.data);
    
    // Verify the API has the required endpoints
    const availableEndpoints = response.data?.available_endpoints || [];
    const requiredEndpoints = ['/recipes', '/recipe-sharing'];
    
    const hasRequiredEndpoints = requiredEndpoints.every(endpoint => 
      availableEndpoints.includes(endpoint)
    );
    
    if (!hasRequiredEndpoints) {
      console.warn('Production API is missing required endpoints:', 
        requiredEndpoints.filter(ep => !availableEndpoints.includes(ep)));
    }
    
    return hasRequiredEndpoints;
  } catch (error) {
    console.error('Production API health check failed:', error);
    return false;
  }
};

/**
 * Maps a query to the appropriate production endpoint and formats data
 */
export const adaptApiCall = async (
  endpointKey: keyof typeof endpointMap, 
  params: Record<string, any> = {}
): Promise<any> => {
  const endpoint = endpointMap[endpointKey];
  
  if (!endpoint) {
    throw new Error(`Unknown endpoint key: ${endpointKey}`);
  }
  
  // Construct the full URL with query parameters
  let url = `${PRODUCTION_API_URL}${endpoint}`;
  
  // Add query parameters if any
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += (url.includes('?') ? '&' : '?') + queryString;
  }
  
  console.log(`Calling adapted API endpoint: ${url}`);
  
  // Make the API call
  try {
    const response = await axios.get(url, { timeout: 10000 });
    console.log('Production API response:', response.data);
    
    // Transform the data to match our expected format if needed
    return adaptResponseData(endpointKey, response.data);
  } catch (error) {
    console.error(`Error calling ${endpointKey} endpoint:`, error);
    throw error;
  }
};

/**
 * Adapts response data from production API format to our expected format
 */
const adaptResponseData = (
  endpointKey: keyof typeof endpointMap,
  data: any
): any => {
  // If no data or not an expected format, return as is
  if (!data) return data;
  
  switch (endpointKey) {
    case 'search':
    case 'popular':
      // Transform recipe data to match our DishTransformation type
      if (Array.isArray(data)) {
        return data.map(adaptRecipeToDish);
      }
      return [];
      
    case 'dish':
      // Transform a single recipe
      return adaptRecipeToDish(data);
      
    default:
      return data;
  }
};

/**
 * Adapts a recipe object from the production API to our DishTransformation type
 */
const adaptRecipeToDish = (recipe: any): DishTransformation => {
  // If the API already returns data in our format, just return it
  if (recipe.originalName && recipe.restaurantName) {
    return recipe as DishTransformation;
  }
  
  // Otherwise, create a mock transformation based on the recipe data
  return {
    id: recipe.id || String(Math.floor(Math.random() * 10000)),
    originalName: recipe.name || "Unknown Recipe",
    restaurantName: recipe.cuisine || "Fusion Meals",
    estimatedCalories: recipe.calories || 1000,
    estimatedCost: recipe.price || 15.99,
    prepTime: recipe.prepTime || 20,
    cookTime: recipe.cookTime || 25,
    healthierVersion: {
      name: `Healthy ${recipe.name || "Recipe"}`,
      description: recipe.description || "A healthier version with less calories and fat.",
      calories: Math.round((recipe.calories || 1000) * 0.6),
      costSavings: 10.5,
      healthBenefits: [
        "Lower calories",
        "Higher protein content",
        "Added fiber",
        "Reduced saturated fat"
      ],
      mainSubstitutions: [
        { original: "Regular ingredients", healthier: "Healthier alternatives" },
        { original: "Heavy cream", healthier: "Greek yogurt" },
        { original: "White flour", healthier: "Whole grain flour" },
        { original: "Extra oil", healthier: "Less oil with non-stick cooking" }
      ]
    },
    budgetVersion: {
      name: `Budget ${recipe.name || "Recipe"}`,
      description: "A more affordable version without sacrificing flavor.",
      costSavings: 12.50,
      totalCost: recipe.price ? recipe.price * 0.25 : 4.99,
      valueIngredients: [
        "Use seasonal ingredients",
        "Buy in bulk and portion",
        "Use frozen vegetables",
        "Make your own sauce from scratch"
      ]
    },
    quickVersion: {
      name: `Quick ${recipe.name || "Recipe"}`,
      description: "A faster version ready in half the time.",
      totalTime: 20,
      timeSavings: 25,
      shortcuts: [
        "Use pre-cut vegetables",
        "Utilize a pressure cooker",
        "Multitask cooking steps",
        "Simplify the sauce preparation"
      ]
    },
    image: recipe.image || "/images/restaurant-dishes/default-dish.jpg"
  };
};

export default {
  checkApiHealth,
  adaptApiCall
}; 
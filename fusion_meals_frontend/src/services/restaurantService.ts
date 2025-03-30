import axios from 'axios';
import { DishTransformation } from '../types/restaurant';
import { fallbackService } from './fallbackService';

// Base API URL - configurable via environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Define a type for API response items 
interface ApiResponseItem {
  id?: string;
  name?: string;
  title?: string;
  restaurant?: string;
  cuisine?: string;
  calories?: number | string;
  nutritionalInfo?: { calories?: number | string };
  price?: number | string;
  cost?: number | string;
  prepTime?: number | string;
  preparation_time?: number | string;
  cookTime?: number | string;
  cooking_time?: number | string;
  description?: string;
  image?: string;
  image_url?: string;
  // Healthier version properties
  healthier_description?: string;
  healthier_calories?: number | string;
  healthyCalories?: number | string;
  healthier_savings?: number | string;
  healthyCostSavings?: number | string;
  healthier_benefits?: string[];
  healthBenefits?: string[];
  healthier_substitutions?: { original: string; healthier: string }[];
  substitutions?: { original: string; healthier: string }[];
  // Budget version properties
  budget_description?: string;
  budgetDescription?: string;
  budget_savings?: number | string;
  budgetSavings?: number | string;
  budget_cost?: number | string;
  budgetCost?: number | string;
  budget_ingredients?: string[];
  valueIngredients?: string[];
  // Quick version properties
  quick_description?: string;
  quickDescription?: string;
  quick_time?: number | string;
  quickTime?: number | string;
  time_saved?: number | string;
  timeSaved?: number | string;
  quick_shortcuts?: string[];
  shortcuts?: string[];
  // Additional fields that might be in the API response
  [key: string]: unknown;
}

// Define type for API response
type ApiResponse = ApiResponseItem[] | ApiResponseItem | {
  data?: ApiResponseItem[];
  items?: ApiResponseItem[];
  recipes?: ApiResponseItem[];
  [key: string]: unknown;
};

/**
 * Check API availability using a health check
 */
const checkApiAvailability = async (): Promise<boolean> => {
  try {
    // Try with a simple GET to the root URL
    const response = await axios.get(API_URL, { timeout: 5000 });
    console.log('API health check response:', response.status, response.data);
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Service to handle all restaurant-related API calls
 */
export const restaurantService = {
  /**
   * Search for restaurant dishes by query
   * @param query Search query for restaurant dishes
   * @returns Promise with search results
   */
  searchDishes: async (query: string): Promise<DishTransformation[]> => {
    console.log('restaurantService.searchDishes called with query:', query);
    console.log('Using API URL:', API_URL);
    console.log('Mock data enabled:', USE_MOCK_DATA);
    
    // If mock data is explicitly enabled, use it
    if (USE_MOCK_DATA) {
      console.log('Using mock data due to configuration');
      return fallbackService.searchDishes(query);
    }
    
    // Always fall back to mock data for now since API doesn't support the GET method on /recipes
    console.log('Using fallback data because the API endpoint may not support the required method');
    return fallbackService.searchDishes(query);
  },

  /**
   * Get a specific dish by ID
   * @param id Dish ID
   * @returns Promise with dish details
   */
  getDishById: async (id: string): Promise<DishTransformation | null> => {
    if (USE_MOCK_DATA) {
      return fallbackService.getDishById(id);
    }
    
    // Always fall back to mock data for now
    console.log('Using fallback data for dish details');
    return fallbackService.getDishById(id);
  },

  /**
   * Get popular or trending restaurant dishes
   * @returns Promise with popular dishes
   */
  getPopularDishes: async (): Promise<DishTransformation[]> => {
    if (USE_MOCK_DATA) {
      return fallbackService.getPopularDishes();
    }
    
    // Check if API is available first
    const isApiAvailable = await checkApiAvailability();
    
    if (!isApiAvailable) {
      console.log('API is not available, using fallback data for popular dishes');
      return fallbackService.getPopularDishes();
    }
    
    try {
      // Try to access the available endpoints through the root URL
      const rootResponse = await axios.get(API_URL);
      console.log('Available API endpoints:', rootResponse.data?.available_endpoints);
      
      // For now, use fallback data since we know from the errors that /recipes with GET is giving 405
      return fallbackService.getPopularDishes();
    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      return fallbackService.getPopularDishes();
    }
  },

  /**
   * Get user's saved dish transformations
   * @returns Promise with user's saved transformations
   */
  getSavedTransformations: async (): Promise<DishTransformation[]> => {
    // Always use fallback for now
    const popularDishes = await fallbackService.getPopularDishes();
    return popularDishes.slice(0, 2);
  },

  /**
   * Save a dish transformation
   * @param dishId ID of the dish to save
   * @returns Promise with save confirmation
   */
  saveDishTransformation: async (_dishId: string): Promise<{ success: boolean }> => {
    // Always return success for now
    return { success: true };
  }
};

/**
 * Formats API response data to match our expected DishTransformation format
 */
const formatApiResponse = (data: ApiResponse): DishTransformation[] => {
  console.log('Formatting API data:', typeof data);
  
  // Handle different response structures
  let items: ApiResponseItem[] = [];
  
  if (Array.isArray(data)) {
    items = data;
    console.log('Data is an array with', items.length, 'items');
  } else if (data && typeof data === 'object') {
    // If it's an object with a data/items/recipes field
    if (data.data && Array.isArray(data.data)) {
      items = data.data;
      console.log('Data has a "data" array property with', items.length, 'items');
    } else if (data.items && Array.isArray(data.items)) {
      items = data.items;
      console.log('Data has an "items" array property with', items.length, 'items');
    } else if (data.recipes && Array.isArray(data.recipes)) {
      items = data.recipes;
      console.log('Data has a "recipes" array property with', items.length, 'items');
    } else {
      // Single item or object with properties
      const keys = Object.keys(data);
      console.log('Data is an object with keys:', keys.join(', '));
      
      if (keys.includes('id') || keys.includes('name') || keys.includes('title')) {
        items = [data as ApiResponseItem];
        console.log('Treating object as a single item');
      }
    }
  }
  
  // Map each item to our DishTransformation format
  console.log(`Mapping ${items.length} items to DishTransformation format`);
  return items.map(formatApiSingleItem).filter(Boolean) as DishTransformation[];
};

/**
 * Formats a single API item to match our DishTransformation type
 */
const formatApiSingleItem = (item: ApiResponseItem): DishTransformation | null => {
  if (!item) return null;
  
  // Create a dish transformation from the API data
  return {
    id: item.id || String(Math.floor(Math.random() * 10000)),
    originalName: item.name || item.title || "Unknown Recipe",
    restaurantName: item.restaurant || item.cuisine || "Fusion Meals",
    estimatedCalories: parseInt(String(item.calories || item.nutritionalInfo?.calories)) || 1000,
    estimatedCost: parseFloat(String(item.price || item.cost)) || 15.99,
    prepTime: parseInt(String(item.prepTime || item.preparation_time)) || 20,
    cookTime: parseInt(String(item.cookTime || item.cooking_time)) || 25,
    healthierVersion: {
      name: `Healthy ${item.name || item.title || "Recipe"}`,
      description: item.healthier_description || item.description || "A healthier version with less calories and fat.",
      calories: parseInt(String(item.healthier_calories || item.healthyCalories)) || Math.round(((parseInt(String(item.calories)) || 1000) * 0.6)),
      costSavings: parseFloat(String(item.healthier_savings || item.healthyCostSavings)) || 10.5,
      healthBenefits: item.healthier_benefits || item.healthBenefits || [
        "Lower calories",
        "Higher protein content",
        "Added fiber",
        "Reduced saturated fat"
      ],
      mainSubstitutions: item.healthier_substitutions || item.substitutions || [
        { original: "Regular ingredients", healthier: "Healthier alternatives" },
        { original: "Heavy cream", healthier: "Greek yogurt" },
        { original: "White flour", healthier: "Whole grain flour" },
        { original: "Extra oil", healthier: "Less oil with non-stick cooking" }
      ]
    },
    budgetVersion: {
      name: `Budget ${item.name || item.title || "Recipe"}`,
      description: item.budget_description || item.budgetDescription || "A more affordable version without sacrificing flavor.",
      costSavings: parseFloat(String(item.budget_savings || item.budgetSavings)) || 12.50,
      totalCost: parseFloat(String(item.budget_cost || item.budgetCost)) || (parseFloat(String(item.price || item.cost)) || 15.99) * 0.25,
      valueIngredients: item.budget_ingredients || item.valueIngredients || [
        "Use seasonal ingredients",
        "Buy in bulk and portion",
        "Use frozen vegetables",
        "Make your own sauce from scratch"
      ]
    },
    quickVersion: {
      name: `Quick ${item.name || item.title || "Recipe"}`,
      description: item.quick_description || item.quickDescription || "A faster version ready in half the time.",
      totalTime: parseInt(String(item.quick_time || item.quickTime)) || 20,
      timeSavings: parseInt(String(item.time_saved || item.timeSaved)) || 25,
      shortcuts: item.quick_shortcuts || item.shortcuts || [
        "Use pre-cut vegetables",
        "Utilize a pressure cooker",
        "Multitask cooking steps",
        "Simplify the sauce preparation"
      ]
    },
    image: item.image || item.image_url || "/images/restaurant-dishes/default-dish.jpg"
  };
};

export default restaurantService; 
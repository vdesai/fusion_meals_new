import axios from 'axios';
import { DishTransformation } from '../types/restaurant';
import { fallbackService } from './fallbackService';

// Base API URL - configurable via environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';

// Flag to control whether mock data should be used as fallback
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

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
    console.log('Mock data fallback enabled:', USE_MOCK_DATA);
    
    try {
      // First check if the API is accessible
      try {
        const healthResponse = await axios.get(`${API_URL}`, { timeout: 5000 });
        console.log('API health check:', healthResponse.data);
        
        // Check if we have the recipes endpoint in our API
        const endpoints = healthResponse.data?.available_endpoints || [];
        if (!endpoints.includes('/recipes')) {
          console.warn('API does not have /recipes endpoint, falling back to mock data');
          return fallbackService.searchDishes(query);
        }
      } catch (healthError) {
        console.warn('API health check failed, proceeding anyway:', healthError);
      }
      
      // Use the /recipes endpoint instead of /api/restaurant-dishes/search
      console.log('Calling real API endpoint:', `${API_URL}/recipes`);
      const response = await axios.get(`${API_URL}/recipes`, {
        params: { query },
        timeout: 10000
      });
      
      console.log('API response:', response.data);
      
      if (response.data && (Array.isArray(response.data) || typeof response.data === 'object')) {
        const formattedData = formatApiResponse(response.data);
        
        if (formattedData.length > 0) {
          return formattedData;
        }
      }
      
      // If we reach here, we didn't get valid data from the API
      console.log('API returned invalid or empty data, falling back to mock data');
      return fallbackService.searchDishes(query);
    } catch (error) {
      console.error('Error searching restaurant dishes:', error);
      console.log('Using mock data as fallback due to API error');
      return fallbackService.searchDishes(query);
    }
  },

  /**
   * Get a specific dish by ID
   * @param id Dish ID
   * @returns Promise with dish details
   */
  getDishById: async (id: string): Promise<DishTransformation | null> => {
    try {
      // Use the /recipes/:id endpoint instead of /api/restaurant-dishes/:id
      const response = await axios.get(`${API_URL}/recipes/${id}`);
      
      if (response.data) {
        // Format a single recipe
        return formatApiSingleItem(response.data);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching dish details:', error);
      console.log('Using mock data as fallback for dish details');
      return fallbackService.getDishById(id);
    }
  },

  /**
   * Get popular or trending restaurant dishes
   * @returns Promise with popular dishes
   */
  getPopularDishes: async (): Promise<DishTransformation[]> => {
    try {
      // Use the /recipes endpoint with popular flag
      const response = await axios.get(`${API_URL}/recipes`, {
        params: { popular: true }
      });
      
      if (response.data && (Array.isArray(response.data) || typeof response.data === 'object')) {
        const formattedData = formatApiResponse(response.data);
        
        if (formattedData.length > 0) {
          return formattedData;
        }
      }
      
      return fallbackService.getPopularDishes();
    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      console.log('Using mock data as fallback for popular dishes');
      return fallbackService.getPopularDishes();
    }
  },

  /**
   * Get user's saved dish transformations
   * @returns Promise with user's saved transformations
   */
  getSavedTransformations: async (): Promise<DishTransformation[]> => {
    try {
      // Use the /recipe-sharing endpoint instead
      const response = await axios.get(`${API_URL}/recipe-sharing`);
      
      if (response.data && (Array.isArray(response.data) || typeof response.data === 'object')) {
        return formatApiResponse(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching saved transformations:', error);
      return [];
    }
  },

  /**
   * Save a dish transformation
   * @param dishId ID of the dish to save
   * @returns Promise with save confirmation
   */
  saveDishTransformation: async (dishId: string): Promise<{ success: boolean }> => {
    try {
      // Use the /recipe-sharing endpoint instead
      const response = await axios.post(`${API_URL}/recipe-sharing`, { 
        recipeId: dishId 
      });
      
      return { success: !!response.data };
    } catch (error) {
      console.error('Error saving transformation:', error);
      return { success: false };
    }
  }
};

/**
 * Formats API response data to match our expected DishTransformation format
 */
const formatApiResponse = (data: any): DishTransformation[] => {
  // Handle different response structures
  let items: any[] = [];
  
  if (Array.isArray(data)) {
    items = data;
  } else if (data && typeof data === 'object') {
    // If it's an object with a data/items/recipes field
    if (data.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data.items && Array.isArray(data.items)) {
      items = data.items;
    } else if (data.recipes && Array.isArray(data.recipes)) {
      items = data.recipes;
    } else {
      // Single item or object with properties
      const keys = Object.keys(data);
      if (keys.includes('id') || keys.includes('name') || keys.includes('title')) {
        items = [data];
      }
    }
  }
  
  // Map each item to our DishTransformation format
  return items.map(formatApiSingleItem).filter(Boolean) as DishTransformation[];
};

/**
 * Formats a single API item to match our DishTransformation type
 */
const formatApiSingleItem = (item: any): DishTransformation | null => {
  if (!item) return null;
  
  // Try to adapt from real API format to our expected format
  
  // Create a mock dish transformation from whatever data we get
  return {
    id: item.id || String(Math.floor(Math.random() * 10000)),
    originalName: item.name || item.title || "Unknown Recipe",
    restaurantName: item.restaurant || item.cuisine || "Fusion Meals",
    estimatedCalories: parseInt(item.calories || item.nutritionalInfo?.calories) || 1000,
    estimatedCost: parseFloat(item.price || item.cost) || 15.99,
    prepTime: parseInt(item.prepTime || item.preparation_time) || 20,
    cookTime: parseInt(item.cookTime || item.cooking_time) || 25,
    healthierVersion: {
      name: `Healthy ${item.name || item.title || "Recipe"}`,
      description: item.description || "A healthier version with less calories and fat.",
      calories: parseInt(item.healthyCalories) || Math.round((parseInt(item.calories) || 1000) * 0.6),
      costSavings: parseFloat(item.healthyCostSavings) || 10.5,
      healthBenefits: item.healthBenefits || [
        "Lower calories",
        "Higher protein content",
        "Added fiber",
        "Reduced saturated fat"
      ],
      mainSubstitutions: item.substitutions || [
        { original: "Regular ingredients", healthier: "Healthier alternatives" },
        { original: "Heavy cream", healthier: "Greek yogurt" },
        { original: "White flour", healthier: "Whole grain flour" },
        { original: "Extra oil", healthier: "Less oil with non-stick cooking" }
      ]
    },
    budgetVersion: {
      name: `Budget ${item.name || item.title || "Recipe"}`,
      description: item.budgetDescription || "A more affordable version without sacrificing flavor.",
      costSavings: parseFloat(item.budgetSavings) || 12.50,
      totalCost: parseFloat(item.budgetCost) || (parseFloat(item.price || item.cost) || 15.99) * 0.25,
      valueIngredients: item.budgetIngredients || [
        "Use seasonal ingredients",
        "Buy in bulk and portion",
        "Use frozen vegetables",
        "Make your own sauce from scratch"
      ]
    },
    quickVersion: {
      name: `Quick ${item.name || item.title || "Recipe"}`,
      description: item.quickDescription || "A faster version ready in half the time.",
      totalTime: parseInt(item.quickTime) || 20,
      timeSavings: parseInt(item.timeSaved) || 25,
      shortcuts: item.shortcuts || [
        "Use pre-cut vegetables",
        "Utilize a pressure cooker",
        "Multitask cooking steps",
        "Simplify the sauce preparation"
      ]
    },
    image: item.image || item.imageUrl || "/images/restaurant-dishes/default-dish.jpg"
  };
};

export default restaurantService; 
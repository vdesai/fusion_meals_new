import { DishTransformation } from '../types/restaurant';
import { fallbackService } from './fallbackService';

// Base API URL - for reference only
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';

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
    console.log('Using mock data for stability');
    
    // Always use fallback data for now
    return fallbackService.searchDishes(query);
  },

  /**
   * Get a specific dish by ID
   * @param id Dish ID
   * @returns Promise with dish details
   */
  getDishById: async (id: string): Promise<DishTransformation | null> => {
    console.log('Getting dish by ID (using fallback):', id);
    return fallbackService.getDishById(id);
  },

  /**
   * Get popular or trending restaurant dishes
   * @returns Promise with popular dishes
   */
  getPopularDishes: async (): Promise<DishTransformation[]> => {
    console.log('Getting popular dishes (using fallback)');
    return fallbackService.getPopularDishes();
  },

  /**
   * Get user's saved dish transformations
   * @returns Promise with user's saved transformations
   */
  getSavedTransformations: async (): Promise<DishTransformation[]> => {
    console.log('Getting saved transformations (using fallback)');
    // Return a subset of popular dishes as "saved"
    const popularDishes = await fallbackService.getPopularDishes();
    return popularDishes.slice(0, 2);
  },

  /**
   * Save a dish transformation
   * @param dishId ID of the dish to save
   * @returns Promise with save confirmation
   */
  saveDishTransformation: async (dishId: string): Promise<{ success: boolean }> => {
    console.log('Saving dish transformation (mock):', dishId);
    // Always return success for now
    return { success: true };
  }
};

export default restaurantService; 
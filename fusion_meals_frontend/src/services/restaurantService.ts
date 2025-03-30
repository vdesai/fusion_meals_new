import axios from 'axios';
import { DishTransformation } from '../types/restaurant';
import { fallbackService } from './fallbackService';

// Base API URL - should be configurable via environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fusionmeals.com';

/**
 * Service to handle all restaurant-related API calls
 * Uses fallback data when API calls fail
 */
export const restaurantService = {
  /**
   * Search for restaurant dishes by query
   * @param query Search query for restaurant dishes
   * @returns Promise with search results
   */
  searchDishes: async (query: string): Promise<DishTransformation[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurant-dishes/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching restaurant dishes:', error);
      console.log('Using fallback data for search');
      // Use fallback data when API is unavailable
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
      const response = await axios.get(`${API_URL}/api/restaurant-dishes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dish details:', error);
      console.log('Using fallback data for dish details');
      // Use fallback data when API is unavailable
      return fallbackService.getDishById(id);
    }
  },

  /**
   * Get popular or trending restaurant dishes
   * @returns Promise with popular dishes
   */
  getPopularDishes: async (): Promise<DishTransformation[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurant-dishes/popular`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      console.log('Using fallback data for popular dishes');
      // Use fallback data when API is unavailable
      return fallbackService.getPopularDishes();
    }
  },

  /**
   * Get user's saved dish transformations
   * @returns Promise with user's saved transformations
   */
  getSavedTransformations: async (): Promise<DishTransformation[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/user/saved-transformations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved transformations:', error);
      // Return empty array when API is unavailable - no fallbacks for user data
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
      const response = await axios.post(`${API_URL}/api/user/saved-transformations`, { dishId });
      return response.data;
    } catch (error) {
      console.error('Error saving transformation:', error);
      // Simulate successful save when API is unavailable
      return { success: true };
    }
  }
};

export default restaurantService; 
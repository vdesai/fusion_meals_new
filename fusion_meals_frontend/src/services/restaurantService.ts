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
      // If mock data is explicitly enabled and we have a default API URL, use mock data
      if (USE_MOCK_DATA && (!API_URL || API_URL === 'https://api.fusionmeals.com')) {
        console.log('Using mock data as configured');
        return fallbackService.searchDishes(query);
      }
      
      // Check if API is available first to handle Render cold starts
      try {
        const healthResponse = await axios.get(`${API_URL}`, { timeout: 5000 });
        console.log('API health check:', healthResponse.data);
      } catch (healthError) {
        console.warn('API health check failed, proceeding anyway:', healthError);
      }
      
      // Make the actual API call
      console.log('Calling real API endpoint:', `${API_URL}/api/restaurant-dishes/search`);
      const response = await axios.get(`${API_URL}/api/restaurant-dishes/search`, {
        params: { query },
        timeout: 10000
      });
      
      console.log('API response:', response.data);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      } else if (USE_MOCK_DATA) {
        // Only use fallback if explicitly allowed
        console.log('API returned empty results and fallbacks are enabled');
        return fallbackService.searchDishes(query);
      } else {
        // If mock data is disabled, return empty array when API returns nothing
        console.log('API returned empty results and fallbacks are disabled');
        return [];
      }
    } catch (error) {
      console.error('Error searching restaurant dishes:', error);
      
      if (USE_MOCK_DATA) {
        // Only use fallback if explicitly allowed
        console.log('Using mock data as fallback due to API error');
        return fallbackService.searchDishes(query);
      } else {
        // If mock data is disabled, throw the error or return empty array
        console.log('Fallbacks disabled, returning empty array');
        return [];
      }
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
      
      if (USE_MOCK_DATA) {
        console.log('Using mock data as fallback for dish details');
        return fallbackService.getDishById(id);
      } else {
        console.log('Fallbacks disabled, returning null');
        return null;
      }
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
      
      if (USE_MOCK_DATA) {
        console.log('Using mock data as fallback for popular dishes');
        return fallbackService.getPopularDishes();
      } else {
        console.log('Fallbacks disabled, returning empty array');
        return [];
      }
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
      return { success: false };
    }
  }
};

export default restaurantService; 
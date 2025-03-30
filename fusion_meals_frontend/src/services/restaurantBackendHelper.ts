/**
 * Restaurant Backend Helper
 * 
 * This service provides utilities to help add sample data to the production backend.
 */

import axios from 'axios';
import { fallbackDishes } from './fallbackService';

// Base API URL - configurable via environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';

/**
 * Pushes sample restaurant dishes to the backend
 */
export const pushSampleDishesToBackend = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if the API is online
    const healthCheck = await axios.get(API_URL);
    console.log('API health check:', healthCheck.data);
    
    if (!healthCheck.data?.available_endpoints?.includes('/recipes')) {
      return { 
        success: false, 
        message: 'The /recipes endpoint is not available on this backend' 
      };
    }

    // Get sample dishes from fallback service
    const sampleDishes = fallbackDishes;
    
    if (!sampleDishes || sampleDishes.length === 0) {
      return { 
        success: false, 
        message: 'No sample dishes available to push' 
      };
    }
    
    console.log(`Preparing to push ${sampleDishes.length} sample dishes to backend`);
    
    // Try to push each dish to the backend
    const results = await Promise.allSettled(
      sampleDishes.map(dish => 
        axios.post(`${API_URL}/recipes`, transformDishForBackend(dish))
      )
    );
    
    // Count successes and failures
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    // Log detailed results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Successfully pushed dish ${index + 1}/${sampleDishes.length}`);
      } else if (result.status === 'rejected') {
        console.error(`❌ Failed to push dish ${index + 1}/${sampleDishes.length}:`, result.reason);
      }
    });
    
    return { 
      success: successful > 0, 
      message: `Pushed ${successful} dishes to backend. ${failed} failed.` 
    };
  } catch (error) {
    console.error('Error pushing sample dishes to backend:', error);
    return { 
      success: false, 
      message: `Failed to push dishes: ${error.message || 'Unknown error'}` 
    };
  }
};

/**
 * Transforms a dish object to match backend API expectations
 */
const transformDishForBackend = (dish: any) => {
  // Create a restaurant dish compatible with the backend API
  return {
    name: dish.originalName,
    cuisine: dish.restaurantName,
    description: `${dish.originalName} from ${dish.restaurantName}`,
    calories: dish.estimatedCalories,
    price: dish.estimatedCost,
    preparation_time: dish.prepTime,
    cooking_time: dish.cookTime,
    restaurant_version: {
      name: dish.originalName,
      price: dish.estimatedCost,
      calories: dish.estimatedCalories
    },
    healthier_version: {
      name: dish.healthierVersion.name,
      description: dish.healthierVersion.description,
      calories: dish.healthierVersion.calories,
      savings: dish.healthierVersion.costSavings,
      benefits: dish.healthierVersion.healthBenefits,
      substitutions: dish.healthierVersion.mainSubstitutions
    },
    budget_version: {
      name: dish.budgetVersion.name,
      description: dish.budgetVersion.description,
      savings: dish.budgetVersion.costSavings,
      total_cost: dish.budgetVersion.totalCost,
      value_ingredients: dish.budgetVersion.valueIngredients
    },
    quick_version: {
      name: dish.quickVersion.name,
      description: dish.quickVersion.description,
      total_time: dish.quickVersion.totalTime,
      time_savings: dish.quickVersion.timeSavings,
      shortcuts: dish.quickVersion.shortcuts
    },
    image_url: dish.image,
    type: "restaurant-recreation",
    tags: ["restaurant", "recreation", dish.restaurantName.toLowerCase()]
  };
};

export default {
  pushSampleDishesToBackend
}; 
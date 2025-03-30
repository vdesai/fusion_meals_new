import { DishTransformation } from '../types/restaurant';

/**
 * Fallback data to use when API calls fail or during development
 */
export const fallbackDishes: DishTransformation[] = [
  {
    id: "1001",
    originalName: "Creamy Fettuccine Alfredo",
    restaurantName: "Olive Garden",
    estimatedCalories: 1200,
    estimatedCost: 18.99,
    prepTime: 20,
    cookTime: 15,
    healthierVersion: {
      name: "Greek Yogurt Fettuccine Alfredo",
      description: "A lighter take on the classic using Greek yogurt instead of heavy cream, whole wheat pasta, and added vegetables for nutrients.",
      calories: 450,
      costSavings: 12.50,
      healthBenefits: ["62% fewer calories", "Lower saturated fat", "Higher protein content", "Added fiber"],
      mainSubstitutions: [
        {original: "Heavy cream", healthier: "Greek yogurt"},
        {original: "Regular pasta", healthier: "Whole wheat pasta"},
        {original: "Extra butter", healthier: "Olive oil (reduced amount)"},
        {original: "No vegetables", healthier: "Added broccoli and peas"}
      ]
    },
    budgetVersion: {
      name: "Budget-Friendly Alfredo",
      description: "Use more affordable ingredients while maintaining creamy texture and flavor.",
      costSavings: 15.00,
      totalCost: 3.99,
      valueIngredients: ["Use milk + flour instead of cream", "Add small amount of cream cheese", "Bulk up with inexpensive pasta", "Add frozen vegetables for volume"]
    },
    quickVersion: {
      name: "15-Minute Alfredo",
      description: "Streamlined version that doesn't sacrifice flavor but cuts prep and cooking time.",
      totalTime: 15,
      timeSavings: 20,
      shortcuts: ["Use pre-grated Parmesan", "Skip reducing the sauce", "Cook pasta and sauce simultaneously", "Use microwave-steamed vegetables"]
    },
    image: "/images/restaurant-dishes/fettuccine-alfredo.jpg"
  },
  {
    id: "1002",
    originalName: "Double Cheeseburger with Fries",
    restaurantName: "Fast Food Chain",
    estimatedCalories: 1450,
    estimatedCost: 12.99,
    prepTime: 15,
    cookTime: 15,
    healthierVersion: {
      name: "Lean Turkey Burger with Sweet Potato Wedges",
      description: "All the flavor with leaner meat, whole grain bun, and nutrient-rich sweet potato instead of fries.",
      calories: 650,
      costSavings: 7.00,
      healthBenefits: ["55% fewer calories", "Lower sodium", "More fiber", "More nutrients from sweet potatoes"],
      mainSubstitutions: [
        {original: "Beef patty", healthier: "Lean turkey patty"},
        {original: "White flour bun", healthier: "Whole grain bun"},
        {original: "Deep-fried potatoes", healthier: "Baked sweet potato wedges"},
        {original: "American cheese", healthier: "Thin slice of real cheddar"}
      ]
    },
    budgetVersion: {
      name: "Homestyle Budget Burger",
      description: "Create a delicious burger at a fraction of the restaurant cost.",
      costSavings: 9.00,
      totalCost: 3.99,
      valueIngredients: ["Make larger, thinner patties with less meat", "Make your own burger seasoning", "Bake fries instead of frying", "Buy buns on sale and freeze"]
    },
    quickVersion: {
      name: "Express Burger Meal",
      description: "Streamlined burger preparation that's ready in no time.",
      totalTime: 15,
      timeSavings: 15,
      shortcuts: ["Use pre-formed patties", "Microwave + broil cooking method", "One-pan cooking for meat and vegetables", "Pre-cut vegetables"]
    },
    image: "/images/restaurant-dishes/cheeseburger.jpg"
  },
  {
    id: "1003",
    originalName: "Chicken Parmesan with Spaghetti",
    restaurantName: "Italian Bistro",
    estimatedCalories: 1350,
    estimatedCost: 17.99,
    prepTime: 25,
    cookTime: 20,
    healthierVersion: {
      name: "Baked Chicken Parmesan with Zoodles",
      description: "A lighter version using baked chicken instead of fried, reduced cheese, and zucchini noodles.",
      calories: 550,
      costSavings: 10.50,
      healthBenefits: ["60% fewer calories", "Lower carbs", "Higher vegetable content", "Less oil"],
      mainSubstitutions: [
        {original: "Fried chicken", healthier: "Baked chicken breast"},
        {original: "Regular pasta", healthier: "Zucchini noodles"},
        {original: "Extra cheese", healthier: "Light sprinkle of cheese"},
        {original: "Heavy sauce", healthier: "Homemade lighter tomato sauce"}
      ]
    },
    budgetVersion: {
      name: "Economy Chicken Parm",
      description: "Achieve the same flavors at a fraction of the cost with smart substitutions.",
      costSavings: 12.50,
      totalCost: 5.49,
      valueIngredients: ["Use chicken thighs instead of breast", "Make your own breadcrumbs", "Use less expensive cheese blend", "Bulk up with extra pasta"]
    },
    quickVersion: {
      name: "30-Minute Chicken Parmesan",
      description: "Get dinner on the table fast without compromising on taste.",
      totalTime: 30,
      timeSavings: 15,
      shortcuts: ["Use thin-sliced chicken breast", "Use jar sauce with added seasonings", "Microwave-ready pasta", "Broil instead of bake for final cheese melt"]
    },
    image: "/images/restaurant-dishes/chicken-parmesan.jpg"
  },
  {
    id: "1004",
    originalName: "Paneer Tikka Masala",
    restaurantName: "Indian Spice Palace",
    estimatedCalories: 950,
    estimatedCost: 16.99,
    prepTime: 20,
    cookTime: 25,
    healthierVersion: {
      name: "Lighter Paneer Tikka",
      description: "A lighter version with reduced cream, more vegetables and baked paneer instead of fried.",
      calories: 550,
      costSavings: 9.50,
      healthBenefits: ["42% fewer calories", "Lower fat content", "More vegetable variety", "Added fiber"],
      mainSubstitutions: [
        {original: "Heavy cream", healthier: "Yogurt and light coconut milk"},
        {original: "Fried paneer", healthier: "Baked paneer cubes"},
        {original: "Extra oil", healthier: "Less oil with non-stick pan"},
        {original: "White rice", healthier: "Brown rice or cauliflower rice"}
      ]
    },
    budgetVersion: {
      name: "Budget-Friendly Paneer Curry",
      description: "Make this restaurant favorite at home for a fraction of the cost.",
      costSavings: 11.50,
      totalCost: 5.49,
      valueIngredients: ["Make your own paneer from milk", "Use frozen mixed vegetables", "Make your own spice blend", "Use canned tomatoes instead of fresh"]
    },
    quickVersion: {
      name: "30-Minute Paneer Curry",
      description: "A simplified version that preserves authentic flavor but cuts prep time.",
      totalTime: 30,
      timeSavings: 15,
      shortcuts: ["Use pre-cut paneer", "Use pre-mixed garam masala", "Use tomato paste instead of reducing fresh tomatoes", "Cook in pressure cooker or Instant Pot"]
    },
    image: "/images/restaurant-dishes/paneer-tikka.jpg"
  },
  {
    id: "1005",
    originalName: "Butter Chicken",
    restaurantName: "Taj Indian Restaurant",
    estimatedCalories: 1100,
    estimatedCost: 18.99,
    prepTime: 25,
    cookTime: 30,
    healthierVersion: {
      name: "Lightened Butter Chicken",
      description: "All the rich flavor with less fat and calories using yogurt and reducing cream.",
      calories: 650,
      costSavings: 11.00,
      healthBenefits: ["40% fewer calories", "Much less saturated fat", "Higher protein content", "Less sodium"],
      mainSubstitutions: [
        {original: "Butter and cream", healthier: "Greek yogurt and a touch of light cream"},
        {original: "Skin-on chicken", healthier: "Skinless chicken breast"},
        {original: "Extra ghee", healthier: "Measured amount of olive oil"},
        {original: "White naan", healthier: "Whole grain chapati"}
      ]
    },
    budgetVersion: {
      name: "Economical Butter Chicken",
      description: "Restaurant-quality butter chicken at a fraction of the price.",
      costSavings: 12.50,
      totalCost: 6.49,
      valueIngredients: ["Use chicken thighs instead of breast", "Make your own garam masala", "Use canned tomatoes", "Freeze leftover portions"]
    },
    quickVersion: {
      name: "Express Butter Chicken",
      description: "A simplified version ready in half the time.",
      totalTime: 25,
      timeSavings: 30,
      shortcuts: ["Use rotisserie chicken", "Use prepared ginger-garlic paste", "Use pre-made spice mix", "Simmer in pressure cooker"]
    },
    image: "/images/restaurant-dishes/butter-chicken.jpg"
  }
];

/**
 * Fallback service to provide data when API is unavailable
 */
export const fallbackService = {
  /**
   * Filter dishes based on query to simulate search
   */
  searchDishes: (query: string): DishTransformation[] => {
    console.log('Fallback service searchDishes called with query:', query);
    
    // Always log the available dishes to debug
    console.log('Available fallback dishes:', fallbackDishes);
    
    // Safety check - if dishes array is empty or undefined
    if (!fallbackDishes || !Array.isArray(fallbackDishes) || fallbackDishes.length === 0) {
      console.error('Fallback dishes array is empty or invalid!');
      
      // Return hardcoded default dish if the array is somehow empty
      return [{
        id: "default-1001",
        originalName: "Default Fettuccine Alfredo",
        restaurantName: "Default Restaurant",
        estimatedCalories: 1200,
        estimatedCost: 18.99,
        prepTime: 20,
        cookTime: 15,
        healthierVersion: {
          name: "Healthier Default Dish",
          description: "A lighter version of the default dish.",
          calories: 450,
          costSavings: 12.50,
          healthBenefits: ["Fewer calories", "Better nutrition"],
          mainSubstitutions: [
            {original: "Unhealthy ingredient", healthier: "Healthy ingredient"}
          ]
        },
        budgetVersion: {
          name: "Budget Default Dish",
          description: "A cheaper version of the default dish.",
          costSavings: 15.00,
          totalCost: 3.99,
          valueIngredients: ["Cheaper ingredient 1", "Cheaper ingredient 2"]
        },
        quickVersion: {
          name: "Quick Default Dish",
          description: "A faster version of the default dish.",
          totalTime: 15,
          timeSavings: 20,
          shortcuts: ["Quick trick 1", "Quick trick 2"]
        },
        image: "/images/restaurant-dishes/default-dish.jpg"
      }];
    }
    
    // If query is empty, return all dishes
    if (!query || query.trim() === '') {
      console.log('Empty query, returning all fallback dishes');
      return fallbackDishes;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const results = fallbackDishes.filter(dish => 
      dish.originalName.toLowerCase().includes(lowercaseQuery) || 
      dish.restaurantName.toLowerCase().includes(lowercaseQuery)
    );
    
    console.log(`Fallback search for "${query}" returned ${results.length} results`);
    return results;
  },
  
  /**
   * Find a dish by ID from the fallback data
   */
  getDishById: (id: string): DishTransformation | null => {
    console.log('Fallback service getDishById called with id:', id);
    
    // Safety check
    if (!fallbackDishes || !Array.isArray(fallbackDishes) || fallbackDishes.length === 0) {
      console.error('Fallback dishes array is empty or invalid in getDishById!');
      return null;
    }
    
    const dish = fallbackDishes.find(dish => dish.id === id);
    console.log('Found dish by ID:', dish);
    return dish || null;
  },
  
  /**
   * Return all fallback dishes as popular dishes
   */
  getPopularDishes: (): DishTransformation[] => {
    console.log('Fallback service getPopularDishes called');
    
    // Safety check
    if (!fallbackDishes || !Array.isArray(fallbackDishes) || fallbackDishes.length === 0) {
      console.error('Fallback dishes array is empty or invalid in getPopularDishes!');
      return [];
    }
    
    console.log('Returning all fallback dishes as popular dishes');
    return fallbackDishes;
  }
};

export default fallbackService; 
import { DishTransformation } from '../types/restaurant';

// Sample data for demonstration
export const mockDishes: DishTransformation[] = [
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
  }
];

// Mock API response for search
export const mockSearchDishes = (query: string): Promise<DishTransformation[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Perform search on our mock data
      const results = mockDishes.filter(dish => 
        dish.originalName.toLowerCase().includes(query.toLowerCase()) || 
        dish.restaurantName.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 800); // 800ms delay to simulate network request
  });
};

// Mock API response for getting a dish by ID
export const mockGetDishById = (id: string): Promise<DishTransformation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dish = mockDishes.find(dish => dish.id === id);
      resolve(dish || null);
    }, 500);
  });
};

// Mock API response for getting popular dishes
export const mockGetPopularDishes = (): Promise<DishTransformation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDishes);
    }, 800);
  });
}; 
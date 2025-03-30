import { DishTransformation } from '../types/restaurant';

/**
 * Fallback data to use when API calls fail or during development
 */
export const fallbackDishes: DishTransformation[] = [
  {
    id: "1",
    originalName: "Creamy Fettuccine Alfredo",
    restaurantName: "Olive Garden",
    estimatedCalories: 1200,
    estimatedCost: 18.99,
    prepTime: 15,
    cookTime: 20,
    healthierVersion: {
      name: "Lighter Fettuccine Alfredo",
      description: "A lighter take on the classic dish using Greek yogurt instead of heavy cream, with whole grain pasta and added vegetables for extra nutrition.",
      calories: 450,
      costSavings: 15.00,
      healthBenefits: [
        "62% fewer calories",
        "75% less saturated fat",
        "Added fiber from whole grain pasta",
        "Extra protein from Greek yogurt",
        "Additional nutrients from vegetables"
      ],
      mainSubstitutions: [
        { original: "Heavy cream", healthier: "Greek yogurt with a touch of low-fat milk" },
        { original: "Regular fettuccine", healthier: "Whole grain fettuccine" },
        { original: "Extra butter", healthier: "Small amount of olive oil" },
        { original: "Just pasta and sauce", healthier: "Added broccoli, peas and lean protein" }
      ]
    },
    budgetVersion: {
      name: "Budget-Friendly Fettuccine",
      description: "An economical version of the restaurant favorite that costs a fraction of the price while maintaining the creamy satisfaction of the original.",
      costSavings: 15.50,
      totalCost: 3.49,
      valueIngredients: [
        "Make your own sauce instead of jarred alfredo",
        "Use pasta bought in bulk",
        "Add inexpensive vegetables like frozen peas",
        "Use a mix of parmesan and more affordable cheeses",
        "Add chicken when it's on sale or use leftovers"
      ]
    },
    quickVersion: {
      name: "30-Minute Fettuccine Alfredo",
      description: "A simplified version ready in half the time with clever shortcuts that don't sacrifice flavor.",
      totalTime: 15,
      timeSavings: 20,
      shortcuts: [
        "Use quick-cooking fettuccine (7-8 minutes)",
        "Prepare one-pot version instead of separate sauce",
        "Multi-task by warming sauce while pasta cooks",
        "Use pre-grated cheese and minced garlic",
        "Skip multiple pots by finishing pasta in the sauce"
      ]
    },
    image: "/images/restaurant-dishes/fettuccine-alfredo.jpg"
  },
  {
    id: "2",
    originalName: "Double Cheeseburger with Fries",
    restaurantName: "Fast Food Chain",
    estimatedCalories: 1450,
    estimatedCost: 12.99,
    prepTime: 10,
    cookTime: 20,
    healthierVersion: {
      name: "Lean Beef Burger with Baked Sweet Potato Fries",
      description: "A healthier burger made with lean ground beef or turkey, loaded with vegetables, and paired with baked sweet potato fries instead of deep-fried potatoes.",
      calories: 650,
      costSavings: 9.00,
      healthBenefits: [
        "55% fewer calories",
        "70% less saturated fat",
        "Higher in fiber",
        "More vitamins A and C from sweet potatoes",
        "Lower sodium content"
      ],
      mainSubstitutions: [
        { original: "Regular ground beef (80/20)", healthier: "Extra lean ground beef (93/7) or turkey" },
        { original: "American cheese slices", healthier: "Reduced-fat cheese or avocado" },
        { original: "White hamburger bun", healthier: "Whole grain bun or lettuce wrap" },
        { original: "Deep-fried potatoes", healthier: "Baked sweet potato fries with olive oil" },
        { original: "Mayo-based sauce", healthier: "Greek yogurt-based sauce with herbs" }
      ]
    },
    budgetVersion: {
      name: "Homemade Burger & Fries Meal",
      description: "A satisfying burger meal made from scratch at about 30% of the restaurant cost without sacrificing flavor.",
      costSavings: 9.50,
      totalCost: 3.49,
      valueIngredients: [
        "Buy ground beef in bulk and freeze portions",
        "Make multiple patties at once and freeze extras",
        "Use regular potatoes instead of pre-cut fries",
        "Make your own burger seasoning from pantry spices",
        "Choose seasonal vegetables for toppings",
        "Skip pre-packaged burger buns for more affordable rolls"
      ]
    },
    quickVersion: {
      name: "15-Minute Burger & Fries",
      description: "A simplified burger meal that's ready in just 15 minutes using smart shortcuts.",
      totalTime: 15,
      timeSavings: 15,
      shortcuts: [
        "Form burger patties ahead of time and refrigerate",
        "Use a hot skillet to cook burgers in 3-4 minutes per side",
        "Microwave potato for 5 minutes before slicing and quickly baking",
        "Preparation mise en place before cooking",
        "Cook multiple components simultaneously",
        "Use pre-washed greens for garnish"
      ]
    },
    image: "/images/restaurant-dishes/cheeseburger.jpg"
  },
  {
    id: "3",
    originalName: "Chicken Parmesan with Spaghetti",
    restaurantName: "Italian Bistro",
    estimatedCalories: 1350,
    estimatedCost: 17.99,
    prepTime: 20,
    cookTime: 25,
    healthierVersion: {
      name: "Baked Chicken Parmesan with Zucchini Noodles",
      description: "A lighter take on the Italian classic with baked instead of fried chicken and vegetable noodles in place of pasta.",
      calories: 550,
      costSavings: 13.00,
      healthBenefits: [
        "59% fewer calories",
        "80% less saturated fat",
        "Lower carbohydrates",
        "Higher in vitamins and minerals",
        "More protein per calorie"
      ],
      mainSubstitutions: [
        { original: "Breaded and fried chicken", healthier: "Lightly breaded and baked chicken" },
        { original: "Regular pasta", healthier: "Zucchini noodles or spaghetti squash" },
        { original: "Full-fat mozzarella", healthier: "Part-skim mozzarella in moderation" },
        { original: "Store-bought sauce with added sugar", healthier: "Homemade tomato sauce with fresh herbs" }
      ]
    },
    budgetVersion: {
      name: "Economical Chicken Parmesan",
      description: "A budget-friendly version of the restaurant favorite at less than $5 per serving.",
      costSavings: 14.00,
      totalCost: 3.99,
      valueIngredients: [
        "Use chicken thighs instead of breasts",
        "Make your own breadcrumbs from stale bread",
        "Use canned tomatoes for homemade sauce",
        "Buy pasta in bulk when on sale",
        "Use a mix of mozzarella and less expensive cheeses",
        "Grow fresh basil on your windowsill for garnish"
      ]
    },
    quickVersion: {
      name: "Quick Chicken Parmesan",
      description: "A simplified version ready in under 30 minutes with minimal prep and cleanup.",
      totalTime: 30,
      timeSavings: 15,
      shortcuts: [
        "Use thin-sliced chicken breasts (no pounding needed)",
        "Skip breading for a faster protein-rich version",
        "Use jarred sauce enhanced with quick additions",
        "Cook pasta and chicken simultaneously",
        "Use a broiler for fast melting and browning of cheese",
        "Opt for a one-pan approach to reduce cleanup"
      ]
    },
    image: "/images/restaurant-dishes/chicken-parmesan.jpg"
  },
  {
    id: "4",
    originalName: "Paneer Tikka Masala",
    restaurantName: "Indian Spice Palace",
    estimatedCalories: 950,
    estimatedCost: 16.99,
    prepTime: 25,
    cookTime: 20,
    healthierVersion: {
      name: "Lightened Paneer Tikka Masala",
      description: "A healthier version with less cream, more vegetables, and smarter cooking techniques.",
      calories: 550,
      costSavings: 12.00,
      healthBenefits: [
        "42% fewer calories",
        "Less saturated fat from reduced cream",
        "Higher fiber content from added vegetables",
        "Extra protein from legumes",
        "More antioxidants from additional spices"
      ],
      mainSubstitutions: [
        { original: "Heavy cream", healthier: "Light coconut milk and yogurt" },
        { original: "Full-fat paneer", healthier: "Lower-fat paneer or tofu" },
        { original: "Butter-based sauce", healthier: "Tomato-based sauce with less oil" },
        { original: "Minimal vegetables", healthier: "Added spinach, bell peppers and peas" }
      ]
    },
    budgetVersion: {
      name: "Budget Paneer Curry",
      description: "An economical version costing about $5 per serving without sacrificing authentic flavor.",
      costSavings: 12.50,
      totalCost: 4.49,
      valueIngredients: [
        "Make your own paneer from milk",
        "Use dried spices instead of pre-made pastes",
        "Incorporate less expensive legumes along with paneer",
        "Use frozen vegetables when fresh are expensive",
        "Make your own garam masala spice blend",
        "Create a larger batch and freeze portions"
      ]
    },
    quickVersion: {
      name: "30-Minute Paneer Tikka",
      description: "A simplified version ready in half the time with minimal prep and maximum flavor.",
      totalTime: 30,
      timeSavings: 15,
      shortcuts: [
        "Skip the marination step for the paneer",
        "Use store-bought garam masala instead of individual spices",
        "Opt for pre-cut vegetables",
        "Use a pressure cooker to develop flavors quickly",
        "Create a simpler sauce with fewer steps",
        "Use jarred minced ginger and garlic"
      ]
    },
    image: "/images/restaurant-dishes/paneer-tikka.jpg"
  },
  {
    id: "5",
    originalName: "Butter Chicken",
    restaurantName: "Taj Indian Restaurant",
    estimatedCalories: 1100,
    estimatedCost: 18.99,
    prepTime: 30,
    cookTime: 25,
    healthierVersion: {
      name: "Lighter Butter Chicken",
      description: "A healthier version with yogurt instead of cream, less butter, and more vegetables for a nutrient boost.",
      calories: 550,
      costSavings: 14.00,
      healthBenefits: [
        "50% fewer calories",
        "60% less saturated fat",
        "Added fiber from vegetables",
        "Higher protein content",
        "Probiotic benefits from yogurt"
      ],
      mainSubstitutions: [
        { original: "Heavy cream", healthier: "Greek yogurt and a touch of light coconut milk" },
        { original: "Butter", healthier: "Ghee in smaller amounts" },
        { original: "Just chicken in sauce", healthier: "Added spinach, bell peppers and peas" },
        { original: "Regular white rice", healthier: "Cauliflower rice or brown rice" }
      ]
    },
    budgetVersion: {
      name: "Economical Butter Chicken",
      description: "A budget-friendly version that costs about $4 per serving while maintaining authentic flavors.",
      costSavings: 15.00,
      totalCost: 3.99,
      valueIngredients: [
        "Use chicken thighs instead of chicken breast",
        "Make your own garam masala from bulk spices",
        "Use canned tomatoes instead of fresh",
        "Substitute some of the chicken with chickpeas",
        "Use milk with a bit of yogurt instead of cream",
        "Make a larger batch and freeze portions"
      ]
    },
    quickVersion: {
      name: "Express Butter Chicken",
      description: "A simplified version ready in just 25 minutes using smart shortcuts.",
      totalTime: 25,
      timeSavings: 30,
      shortcuts: [
        "Use pre-cut chicken pieces",
        "Skip marination or use a quick 5-minute marinade",
        "Use store-bought spice blends",
        "Employ a pressure cooker or Instant Pot",
        "Use tomato paste instead of reducing tomato sauce",
        "Pre-cook and freeze rice for quick reheating"
      ]
    },
    image: "/images/restaurant-dishes/butter-chicken.jpg"
  },
  {
    id: "6",
    originalName: "Salmon Avocado Sushi Roll",
    restaurantName: "Ocean Sushi Bar",
    estimatedCalories: 550,
    estimatedCost: 14.99,
    prepTime: 30,
    cookTime: 15,
    healthierVersion: {
      name: "Brown Rice Salmon Sushi Bowl",
      description: "A deconstructed sushi bowl using brown rice, more vegetables, and less rice overall for a nutrient-dense meal.",
      calories: 420,
      costSavings: 11.00,
      healthBenefits: [
        "24% fewer calories",
        "Higher in fiber from brown rice",
        "More omega-3 fatty acids from additional salmon",
        "Extra vitamins from varied vegetables",
        "Lower sodium content"
      ],
      mainSubstitutions: [
        { original: "White sushi rice", healthier: "Brown rice or cauliflower rice" },
        { original: "Mayonnaise in rolls", healthier: "Avocado for creaminess" },
        { original: "Mostly rice", healthier: "More vegetables and protein" },
        { original: "High sodium soy sauce", healthier: "Low-sodium soy sauce or ponzu" }
      ]
    },
    budgetVersion: {
      name: "Homemade Sushi Bowl",
      description: "An economical deconstructed sushi bowl that costs about $4 per serving.",
      costSavings: 11.00,
      totalCost: 3.99,
      valueIngredients: [
        "Buy salmon when on sale and freeze portions",
        "Use canned salmon as an alternative",
        "Add inexpensive vegetables like carrots and cucumbers",
        "Make your own pickled ginger",
        "Use regular rice with a touch of rice vinegar",
        "Incorporate eggs for additional protein"
      ]
    },
    quickVersion: {
      name: "15-Minute Sushi Bowl",
      description: "A quick deconstructed sushi bowl ready in just 15 minutes.",
      totalTime: 15,
      timeSavings: 30,
      shortcuts: [
        "Use pre-cooked rice or microwaveable rice packets",
        "Buy pre-cut sushi-grade fish",
        "Use pre-sliced vegetables",
        "Skip rolling and make a bowl format",
        "Use store-bought wasabi and pickled ginger",
        "Use smoked salmon (no cooking required)"
      ]
    },
    image: "/images/restaurant-dishes/salmon-sushi.jpg"
  },
  {
    id: "7",
    originalName: "Beef and Broccoli",
    restaurantName: "Golden Dragon Chinese",
    estimatedCalories: 850,
    estimatedCost: 15.99,
    prepTime: 15,
    cookTime: 15,
    healthierVersion: {
      name: "Lean Beef and Vegetable Stir-Fry",
      description: "A lighter version with leaner beef, more vegetables, and a reduced-sodium sauce.",
      calories: 450,
      costSavings: 12.00,
      healthBenefits: [
        "47% fewer calories",
        "Less saturated fat from leaner beef",
        "Higher fiber content from extra vegetables",
        "Lower sodium content",
        "More varied nutrients from colorful vegetables"
      ],
      mainSubstitutions: [
        { original: "Fatty beef cuts", healthier: "Lean sirloin or flank steak" },
        { original: "Cornstarch-heavy sauce", healthier: "Lighter sauce with less cornstarch" },
        { original: "Just broccoli", healthier: "Mixed vegetables (bell peppers, carrots, snap peas)" },
        { original: "Deep-fried meat", healthier: "Stir-fried in minimal oil" },
        { original: "White rice", healthier: "Brown rice or cauliflower rice" }
      ]
    },
    budgetVersion: {
      name: "Budget Beef Stir-Fry",
      description: "An economical stir-fry that costs about $3.50 per serving without compromising on taste.",
      costSavings: 12.50,
      totalCost: 3.49,
      valueIngredients: [
        "Use less expensive beef cuts like chuck and slice thinly",
        "Stretch the meat with additional vegetables",
        "Make your own stir-fry sauce from pantry staples",
        "Use frozen vegetables when fresh are expensive",
        "Add inexpensive protein boosters like eggs",
        "Use regular cabbage as an economical vegetable addition"
      ]
    },
    quickVersion: {
      name: "10-Minute Beef Stir-Fry",
      description: "An ultra-quick stir-fry ready in just 10 minutes with minimal prep.",
      totalTime: 10,
      timeSavings: 20,
      shortcuts: [
        "Use pre-cut beef strips or stir-fry meat",
        "Buy pre-cut or frozen vegetables",
        "Use a bottled stir-fry sauce enhanced with fresh additions",
        "Cook at high heat for faster cooking time",
        "Pre-cook rice or use microwaveable packets",
        "Use a large wok for quicker cooking"
      ]
    },
    image: "/images/restaurant-dishes/beef-broccoli.jpg"
  },
  {
    id: "8",
    originalName: "Greek Moussaka",
    restaurantName: "Athena Mediterranean Kitchen",
    estimatedCalories: 950,
    estimatedCost: 17.99,
    prepTime: 45,
    cookTime: 60,
    healthierVersion: {
      name: "Lightened Greek Moussaka",
      description: "A healthier moussaka with lean ground meat, more vegetables, and a lighter béchamel topping.",
      calories: 480,
      costSavings: 14.00,
      healthBenefits: [
        "49% fewer calories",
        "Lower saturated fat content",
        "Higher in fiber and nutrients",
        "More protein per calorie",
        "Lower carbohydrate content"
      ],
      mainSubstitutions: [
        { original: "Ground lamb or beef", healthier: "Lean ground turkey or 93% lean beef" },
        { original: "Fried eggplant slices", healthier: "Roasted eggplant and zucchini" },
        { original: "Heavy béchamel sauce", healthier: "Greek yogurt-based lighter béchamel" },
        { original: "Lots of olive oil", healthier: "Measured amounts of olive oil with cooking spray" }
      ]
    },
    budgetVersion: {
      name: "Economical Moussaka",
      description: "A budget-friendly moussaka costing about $4 per generous serving.",
      costSavings: 14.00,
      totalCost: 3.99,
      valueIngredients: [
        "Use less expensive ground meat or lentil/meat combination",
        "Make during eggplant season when prices are lower",
        "Use milk instead of cream for the topping",
        "Incorporate more affordable vegetables like potatoes",
        "Make a larger batch to freeze portions",
        "Use dried herbs instead of fresh when appropriate"
      ]
    },
    quickVersion: {
      name: "Simplified Moussaka",
      description: "A quicker moussaka ready in half the time with a simplified process.",
      totalTime: 45,
      timeSavings: 60,
      shortcuts: [
        "Skip salting and draining eggplant (use younger eggplants)",
        "Use no-cook béchamel alternative",
        "Cook components simultaneously",
        "Use pre-made tomato sauce as a starter",
        "Make in individual ramekins for faster cooking",
        "Use microwave to partially cook vegetables"
      ]
    },
    image: "/images/restaurant-dishes/moussaka.jpg"
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
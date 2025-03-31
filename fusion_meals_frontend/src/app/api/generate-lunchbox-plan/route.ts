import { NextRequest, NextResponse } from 'next/server';

// Define interfaces
interface Child {
  name: string;
  age: number;
  preferences: string[];
  allergies: string[];
}

interface LunchItem {
  name: string;
  description: string;
  nutritional_info: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  allergens: string[];
  prep_time: string;
}

interface ChildLunchPlan {
  child_name: string;
  age: number;
  daily_lunches: {
    [day: string]: {
      main: LunchItem;
      fruit: LunchItem;
      vegetable: LunchItem;
      snack: LunchItem;
      drink: LunchItem;
    }
  };
}

interface LunchboxPlan {
  children: ChildLunchPlan[];
  grocery_list: {
    [category: string]: string[];
  };
}

// Define request body interface
interface LunchboxPlanRequest {
  children: Child[];
  days: number;
}

// Define meal item interface for internal use
interface MealItem {
  name: string;
  description: string;
  calories: number;
  allergens: string[];
  prep_time: string;
}

/**
 * Function to find appropriate meals based on age
 */
function getAgeLevelMeals(age: number) {
  // Define age groups
  const toddler = age >= 3 && age <= 5;
  const youngChild = age >= 6 && age <= 9;
  const preteen = age >= 10 && age <= 12;
  const teen = age >= 13;

  // Age-appropriate mains
  const mains = [
    ...(toddler ? [
      {
        name: 'PB&J Sandwich (Cut into Quarters)',
        description: 'Simple peanut butter and jelly sandwich cut into small, manageable pieces.',
        calories: 280,
        allergens: ['peanuts', 'wheat'],
        prep_time: '3-5 mins'
      },
      {
        name: 'Cheese & Crackers Plate',
        description: 'Small cheese cubes with whole grain crackers.',
        calories: 220,
        allergens: ['dairy', 'wheat'],
        prep_time: '2 mins'
      },
      {
        name: 'Mini Turkey Wrap',
        description: 'Small tortilla with turkey and mild cheese.',
        calories: 240,
        allergens: ['dairy', 'wheat'],
        prep_time: '4 mins'
      }
    ] : []),
    ...(youngChild ? [
      {
        name: 'Turkey & Cheese Sandwich',
        description: 'Classic sandwich with lean turkey and cheese.',
        calories: 320,
        allergens: ['dairy', 'wheat'],
        prep_time: '5 mins'
      },
      {
        name: 'Pasta Salad with Vegetables',
        description: 'Cold pasta with colorful vegetables and light dressing.',
        calories: 290,
        allergens: ['wheat'],
        prep_time: '10 mins (prep night before)'
      },
      {
        name: 'Quesadilla Triangles',
        description: 'Cheese quesadilla cut into triangles.',
        calories: 310,
        allergens: ['dairy', 'wheat'],
        prep_time: '7 mins'
      }
    ] : []),
    ...(preteen || teen ? [
      {
        name: 'Chicken Wrap with Veggies',
        description: 'Tortilla wrap with grilled chicken and fresh vegetables.',
        calories: 380,
        allergens: ['wheat'],
        prep_time: '8 mins'
      },
      {
        name: 'Tuna Sandwich on Whole Grain',
        description: 'Tuna mixed with light mayo on whole grain bread.',
        calories: 340,
        allergens: ['fish', 'wheat', 'eggs'],
        prep_time: '7 mins'
      },
      {
        name: 'Quinoa Salad with Beans',
        description: 'Protein-packed quinoa salad with beans and vegetables.',
        calories: teen ? 420 : 360,
        allergens: [],
        prep_time: '15 mins (prep night before)'
      }
    ] : [])
  ];

  // Snacks appropriate for age
  const snacks = [
    ...(toddler ? [
      {
        name: 'Animal Crackers',
        description: 'Fun animal-shaped crackers.',
        calories: 120,
        allergens: ['wheat'],
        prep_time: '1 min'
      },
      {
        name: 'Yogurt Tube',
        description: 'Kid-friendly yogurt in a tube.',
        calories: 90,
        allergens: ['dairy'],
        prep_time: '1 min'
      }
    ] : []),
    ...(youngChild || preteen ? [
      {
        name: 'Granola Bar',
        description: 'Whole grain granola bar with light sweetness.',
        calories: 140,
        allergens: ['nuts', 'wheat'],
        prep_time: '1 min'
      },
      {
        name: 'String Cheese',
        description: 'Fun-to-eat string cheese stick.',
        calories: 80,
        allergens: ['dairy'],
        prep_time: '1 min'
      }
    ] : []),
    ...(teen ? [
      {
        name: 'Trail Mix',
        description: 'Energy-boosting mix of nuts, seeds, and dried fruit.',
        calories: 200,
        allergens: ['nuts'],
        prep_time: '1 min'
      },
      {
        name: 'Protein Bar',
        description: 'Protein-rich bar to support active teens.',
        calories: 220,
        allergens: ['nuts', 'soy'],
        prep_time: '1 min'
      }
    ] : [])
  ];

  // Standard fruits, vegetables and drinks with portion adjustments by age
  const fruits = [
    {
      name: 'Apple Slices',
      description: `${toddler ? 'Thinly' : 'Medium'} sliced apple.`,
      calories: toddler ? 40 : (youngChild ? 60 : 80),
      allergens: [],
      prep_time: '2 mins'
    },
    {
      name: 'Banana',
      description: `${toddler ? 'Half' : 'Whole'} banana.`,
      calories: toddler ? 45 : (youngChild ? 90 : 105),
      allergens: [],
      prep_time: '1 min'
    },
    {
      name: 'Berries Mix',
      description: `${toddler ? 'Small' : (youngChild ? 'Medium' : 'Large')} portion of mixed berries.`,
      calories: toddler ? 30 : (youngChild ? 50 : 70),
      allergens: [],
      prep_time: '2 mins'
    },
    {
      name: 'Orange Segments',
      description: `${toddler ? 'Small' : 'Regular'} orange cut into easy-to-eat segments.`,
      calories: toddler ? 35 : (youngChild ? 60 : 80),
      allergens: [],
      prep_time: '3 mins'
    },
    {
      name: 'Grapes',
      description: `${toddler ? 'Cut in half' : 'Whole'} grapes (${toddler ? 'cut for safety' : 'washed and ready to eat'}).`,
      calories: toddler ? 30 : (youngChild ? 55 : 75),
      allergens: [],
      prep_time: toddler ? '4 mins' : '2 mins'
    }
  ];

  const vegetables = [
    {
      name: 'Carrot Sticks',
      description: `${toddler ? 'Thin' : 'Regular'} carrot sticks ${toddler ? 'with dip' : ''}.`,
      calories: toddler ? 25 : 35,
      allergens: [],
      prep_time: '3 mins'
    },
    {
      name: 'Cucumber Slices',
      description: `${toddler ? 'Thin' : 'Regular'} cucumber slices.`,
      calories: 15,
      allergens: [],
      prep_time: '2 mins'
    },
    {
      name: 'Cherry Tomatoes',
      description: `${toddler ? 'Cut in quarters' : 'Whole'} cherry tomatoes.`,
      calories: 20,
      allergens: [],
      prep_time: toddler ? '3 mins' : '1 min'
    },
    {
      name: 'Bell Pepper Strips',
      description: `${toddler ? 'Thin' : 'Regular'} bell pepper strips.`,
      calories: 20,
      allergens: [],
      prep_time: '3 mins'
    },
    {
      name: 'Edamame',
      description: `${toddler ? 'Small' : 'Regular'} portion of edamame.`,
      calories: toddler ? 50 : 90,
      allergens: ['soy'],
      prep_time: '2 mins'
    }
  ];

  const drinks = [
    {
      name: 'Water',
      description: 'Hydrating water in a reusable bottle.',
      calories: 0,
      allergens: [],
      prep_time: '1 min'
    },
    {
      name: 'Milk',
      description: `${toddler ? 'Whole' : (teen ? 'Low-fat' : '2%')} milk.`,
      calories: toddler ? 100 : (youngChild ? 90 : 80),
      allergens: ['dairy'],
      prep_time: '1 min'
    },
    ...(toddler ? [] : [
      {
        name: 'Fruit-Infused Water',
        description: 'Water with a splash of natural fruit juice.',
        calories: 15,
        allergens: [],
        prep_time: '2 mins'
      }
    ]),
    ...(preteen || teen ? [
      {
        name: 'Smoothie',
        description: 'Fruit and yogurt smoothie in a thermos.',
        calories: teen ? 180 : 150,
        allergens: ['dairy'],
        prep_time: '5 mins'
      }
    ] : [])
  ];
  
  return {
    mains,
    fruits,
    vegetables,
    snacks,
    drinks
  };
}

/**
 * Filter out items containing allergens
 */
function filterForAllergies(items: MealItem[], allergies: string[]): MealItem[] {
  if (!allergies.length) return items;
  
  return items.filter(item => {
    // If an item has no allergens property or it's empty, it's safe
    if (!item.allergens || !item.allergens.length) return true;
    
    // Check if any of the item's allergens match the child's allergies
    return !item.allergens.some((allergen: string) => 
      allergies.some(allergy => 
        allergen.toLowerCase().includes(allergy.toLowerCase()) || 
        allergy.toLowerCase().includes(allergen.toLowerCase())
      )
    );
  });
}

/**
 * Create a grocery list from the generated meal plans
 */
function createGroceryList(lunchboxPlan: LunchboxPlan): { [category: string]: string[] } {
  const allIngredients: Set<string> = new Set();
  const groceryList: { [category: string]: string[] } = {
    'Fruits': [],
    'Vegetables': [],
    'Proteins': [],
    'Grains': [],
    'Dairy': [],
    'Snacks': [],
    'Drinks': [],
    'Other': []
  };
  
  // Helper function to categorize an ingredient
  function categorizeIngredient(item: LunchItem): void {
    const name = item.name.toLowerCase();
    
    // Check fruits
    if (name.includes('apple') || name.includes('banana') || name.includes('berries') || 
        name.includes('orange') || name.includes('grapes')) {
      if (!allIngredients.has('apple') && name.includes('apple')) {
        groceryList['Fruits'].push('Apples');
        allIngredients.add('apple');
      }
      if (!allIngredients.has('banana') && name.includes('banana')) {
        groceryList['Fruits'].push('Bananas');
        allIngredients.add('banana');
      }
      if (!allIngredients.has('berries') && name.includes('berries')) {
        groceryList['Fruits'].push('Mixed berries');
        allIngredients.add('berries');
      }
      if (!allIngredients.has('orange') && name.includes('orange')) {
        groceryList['Fruits'].push('Oranges');
        allIngredients.add('orange');
      }
      if (!allIngredients.has('grapes') && name.includes('grapes')) {
        groceryList['Fruits'].push('Grapes');
        allIngredients.add('grapes');
      }
    }
    
    // Check vegetables
    else if (name.includes('carrot') || name.includes('cucumber') || 
            name.includes('tomato') || name.includes('pepper') || name.includes('edamame')) {
      if (!allIngredients.has('carrot') && name.includes('carrot')) {
        groceryList['Vegetables'].push('Carrots');
        allIngredients.add('carrot');
      }
      if (!allIngredients.has('cucumber') && name.includes('cucumber')) {
        groceryList['Vegetables'].push('Cucumbers');
        allIngredients.add('cucumber');
      }
      if (!allIngredients.has('tomato') && name.includes('tomato')) {
        groceryList['Vegetables'].push('Cherry tomatoes');
        allIngredients.add('tomato');
      }
      if (!allIngredients.has('pepper') && name.includes('pepper')) {
        groceryList['Vegetables'].push('Bell peppers');
        allIngredients.add('pepper');
      }
      if (!allIngredients.has('edamame') && name.includes('edamame')) {
        groceryList['Vegetables'].push('Edamame');
        allIngredients.add('edamame');
      }
    }
    
    // Check proteins
    else if (name.includes('turkey') || name.includes('chicken') || 
            name.includes('tuna') || name.includes('peanut butter') || name.includes('beans')) {
      if (!allIngredients.has('turkey') && name.includes('turkey')) {
        groceryList['Proteins'].push('Turkey slices');
        allIngredients.add('turkey');
      }
      if (!allIngredients.has('chicken') && name.includes('chicken')) {
        groceryList['Proteins'].push('Chicken breast');
        allIngredients.add('chicken');
      }
      if (!allIngredients.has('tuna') && name.includes('tuna')) {
        groceryList['Proteins'].push('Canned tuna');
        allIngredients.add('tuna');
      }
      if (!allIngredients.has('peanut butter') && name.includes('pb') || name.includes('peanut butter')) {
        groceryList['Proteins'].push('Peanut butter');
        allIngredients.add('peanut butter');
      }
      if (!allIngredients.has('beans') && name.includes('beans')) {
        groceryList['Proteins'].push('Beans');
        allIngredients.add('beans');
      }
    }
    
    // Check grains
    else if (name.includes('sandwich') || name.includes('bread') || name.includes('wrap') || 
            name.includes('pasta') || name.includes('crackers') || name.includes('quinoa')) {
      if (!allIngredients.has('bread') && (name.includes('sandwich') || name.includes('bread'))) {
        groceryList['Grains'].push('Whole grain bread');
        allIngredients.add('bread');
      }
      if (!allIngredients.has('tortilla') && name.includes('wrap') || name.includes('quesadilla')) {
        groceryList['Grains'].push('Tortillas/wraps');
        allIngredients.add('tortilla');
      }
      if (!allIngredients.has('pasta') && name.includes('pasta')) {
        groceryList['Grains'].push('Pasta');
        allIngredients.add('pasta');
      }
      if (!allIngredients.has('crackers') && name.includes('crackers')) {
        groceryList['Grains'].push('Whole grain crackers');
        allIngredients.add('crackers');
      }
      if (!allIngredients.has('quinoa') && name.includes('quinoa')) {
        groceryList['Grains'].push('Quinoa');
        allIngredients.add('quinoa');
      }
    }
    
    // Check dairy
    else if (name.includes('cheese') || name.includes('yogurt') || name.includes('milk')) {
      if (!allIngredients.has('cheese') && name.includes('cheese')) {
        groceryList['Dairy'].push('Cheese');
        allIngredients.add('cheese');
      }
      if (!allIngredients.has('yogurt') && name.includes('yogurt')) {
        groceryList['Dairy'].push('Yogurt');
        allIngredients.add('yogurt');
      }
      if (!allIngredients.has('milk') && name.includes('milk')) {
        groceryList['Dairy'].push('Milk');
        allIngredients.add('milk');
      }
    }
    
    // Check snacks
    else if (name.includes('granola') || name.includes('animal crackers') || 
            name.includes('trail mix') || name.includes('protein bar')) {
      if (!allIngredients.has('granola') && name.includes('granola')) {
        groceryList['Snacks'].push('Granola bars');
        allIngredients.add('granola');
      }
      if (!allIngredients.has('animal crackers') && name.includes('animal crackers')) {
        groceryList['Snacks'].push('Animal crackers');
        allIngredients.add('animal crackers');
      }
      if (!allIngredients.has('trail mix') && name.includes('trail mix')) {
        groceryList['Snacks'].push('Trail mix');
        allIngredients.add('trail mix');
      }
      if (!allIngredients.has('protein bar') && name.includes('protein bar')) {
        groceryList['Snacks'].push('Protein bars');
        allIngredients.add('protein bar');
      }
    }
    
    // Add drinks
    else if (name.includes('water') || name.includes('smoothie')) {
      if (!allIngredients.has('fruit juice') && name.includes('fruit-infused')) {
        groceryList['Drinks'].push('Fruit juice (for infusion)');
        allIngredients.add('fruit juice');
      }
      if (!allIngredients.has('smoothie ingredients') && name.includes('smoothie')) {
        groceryList['Drinks'].push('Smoothie ingredients');
        allIngredients.add('smoothie ingredients');
      }
    }
    
    // Add other ingredients
    else if (!allIngredients.has(name)) {
      groceryList['Other'].push(item.name);
      allIngredients.add(name);
    }
  }
  
  // Process all lunch items for all children
  lunchboxPlan.children.forEach(child => {
    Object.values(child.daily_lunches).forEach(lunch => {
      categorizeIngredient(lunch.main);
      categorizeIngredient(lunch.fruit);
      categorizeIngredient(lunch.vegetable);
      categorizeIngredient(lunch.snack);
      categorizeIngredient(lunch.drink);
    });
  });
  
  // Add jelly if peanut butter is present
  if (allIngredients.has('peanut butter') && !allIngredients.has('jelly')) {
    groceryList['Other'].push('Jelly/Jam');
  }
  
  // Add common condiments and ingredients
  if (groceryList['Proteins'].some(p => p.includes('Tuna'))) {
    groceryList['Other'].push('Mayonnaise (light)');
  }
  
  // Add reusable items
  groceryList['Other'].push('Reusable water bottles');
  groceryList['Other'].push('Lunch containers');
  
  // Remove empty categories
  Object.keys(groceryList).forEach(category => {
    if (groceryList[category].length === 0) {
      delete groceryList[category];
    }
  });
  
  return groceryList;
}

/**
 * Generate a lunchbox plan based on children's info
 */
function generateLunchboxPlan(children: Child[], days: number): LunchboxPlan {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const lunchboxPlan: LunchboxPlan = {
    children: [],
    grocery_list: {}
  };
  
  // Generate meal plans for each child
  children.forEach(child => {
    const childPlan: ChildLunchPlan = {
      child_name: child.name,
      age: child.age,
      daily_lunches: {}
    };
    
    // Get age-appropriate meal options
    const mealOptions = getAgeLevelMeals(child.age);
    
    // Filter out allergens
    const safeMains = filterForAllergies(mealOptions.mains, child.allergies);
    const safeFruits = filterForAllergies(mealOptions.fruits, child.allergies);
    const safeVegetables = filterForAllergies(mealOptions.vegetables, child.allergies);
    const safeSnacks = filterForAllergies(mealOptions.snacks, child.allergies);
    const safeDrinks = filterForAllergies(mealOptions.drinks, child.allergies);
    
    // Generate lunches for each day
    for (let i = 0; i < days; i++) {
      const day = daysOfWeek[i % 7];
      
      // Select random items, but ensure variety
      let mainIndex = Math.floor(Math.random() * safeMains.length);
      const fruitIndex = Math.floor(Math.random() * safeFruits.length);
      const vegetableIndex = Math.floor(Math.random() * safeVegetables.length);
      const snackIndex = Math.floor(Math.random() * safeSnacks.length);
      const drinkIndex = Math.floor(Math.random() * safeDrinks.length);
      
      // Avoid repeating the same main dish on consecutive days
      if (i > 0 && Object.keys(childPlan.daily_lunches).length > 0) {
        const previousDay = daysOfWeek[(i - 1) % 7];
        const previousLunch = childPlan.daily_lunches[previousDay];
        
        if (previousLunch) {
          // Keep trying different indices until we get a different item
          let attempts = 0;
          while (safeMains[mainIndex].name === previousLunch.main.name && attempts < 5 && safeMains.length > 1) {
            mainIndex = Math.floor(Math.random() * safeMains.length);
            attempts++;
          }
        }
      }
      
      // Convert to proper LunchItem format
      const main: LunchItem = {
        name: safeMains[mainIndex].name,
        description: safeMains[mainIndex].description,
        nutritional_info: {
          calories: safeMains[mainIndex].calories,
          protein: child.age <= 5 ? '5-8g' : (child.age <= 10 ? '8-12g' : '12-20g'),
          carbs: child.age <= 5 ? '20-25g' : (child.age <= 10 ? '25-35g' : '35-50g'),
          fat: child.age <= 5 ? '6-8g' : (child.age <= 10 ? '8-12g' : '12-18g')
        },
        allergens: safeMains[mainIndex].allergens || [],
        prep_time: safeMains[mainIndex].prep_time
      };
      
      const fruit: LunchItem = {
        name: safeFruits[fruitIndex].name,
        description: safeFruits[fruitIndex].description,
        nutritional_info: {
          calories: safeFruits[fruitIndex].calories,
          protein: '0-1g',
          carbs: '15-20g',
          fat: '0g'
        },
        allergens: safeFruits[fruitIndex].allergens || [],
        prep_time: safeFruits[fruitIndex].prep_time
      };
      
      const vegetable: LunchItem = {
        name: safeVegetables[vegetableIndex].name,
        description: safeVegetables[vegetableIndex].description,
        nutritional_info: {
          calories: safeVegetables[vegetableIndex].calories,
          protein: '1-2g',
          carbs: '5-8g',
          fat: '0-1g'
        },
        allergens: safeVegetables[vegetableIndex].allergens || [],
        prep_time: safeVegetables[vegetableIndex].prep_time
      };
      
      const snack: LunchItem = {
        name: safeSnacks[snackIndex].name,
        description: safeSnacks[snackIndex].description,
        nutritional_info: {
          calories: safeSnacks[snackIndex].calories,
          protein: '2-5g',
          carbs: '10-15g',
          fat: '3-7g'
        },
        allergens: safeSnacks[snackIndex].allergens || [],
        prep_time: safeSnacks[snackIndex].prep_time
      };
      
      const drink: LunchItem = {
        name: safeDrinks[drinkIndex].name,
        description: safeDrinks[drinkIndex].description,
        nutritional_info: {
          calories: safeDrinks[drinkIndex].calories,
          protein: safeDrinks[drinkIndex].name === 'Milk' ? '8g' : (safeDrinks[drinkIndex].name === 'Smoothie' ? '5g' : '0g'),
          carbs: safeDrinks[drinkIndex].name === 'Milk' ? '12g' : (safeDrinks[drinkIndex].name === 'Smoothie' ? '20g' : '0g'),
          fat: safeDrinks[drinkIndex].name === 'Milk' ? '2-8g' : (safeDrinks[drinkIndex].name === 'Smoothie' ? '2g' : '0g')
        },
        allergens: safeDrinks[drinkIndex].allergens || [],
        prep_time: safeDrinks[drinkIndex].prep_time
      };
      
      // Add lunch to child's plan
      childPlan.daily_lunches[day] = {
        main,
        fruit,
        vegetable,
        snack,
        drink
      };
    }
    
    // Add child's plan to overall plan
    lunchboxPlan.children.push(childPlan);
  });
  
  // Generate grocery list
  lunchboxPlan.grocery_list = createGroceryList(lunchboxPlan);
  
  return lunchboxPlan;
}

export async function POST(request: NextRequest) {
  console.log('📣 API endpoint /api/generate-lunchbox-plan called');
  
  try {
    // Parse request body
    const requestData: LunchboxPlanRequest = await request.json();
    console.log('📥 Request data received:', JSON.stringify(requestData, null, 2));
    
    // Validate input
    if (!requestData.children || !requestData.children.length) {
      console.log('❌ Validation error: No children specified');
      return NextResponse.json(
        { error: 'At least one child must be specified' },
        { status: 400 }
      );
    }
    
    if (!requestData.days || requestData.days < 1 || requestData.days > 7) {
      console.log('❌ Validation error: Invalid days value:', requestData.days);
      return NextResponse.json(
        { error: 'Days must be between 1 and 7' },
        { status: 400 }
      );
    }
    
    // Generate lunchbox plan
    console.log('🔄 Generating lunchbox plan...');
    const lunchboxPlan = generateLunchboxPlan(requestData.children, requestData.days);
    console.log('✅ Lunchbox plan generated successfully');
    
    // Return response
    return NextResponse.json(lunchboxPlan);
  } catch (error) {
    console.error('❌ Error generating lunchbox plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate lunchbox plan' },
      { status: 500 }
    );
  }
} 
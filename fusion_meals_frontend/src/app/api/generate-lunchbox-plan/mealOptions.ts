// Define the MealItem interface
export interface MealItem {
  name: string;
  description: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  prepTime: string;
}

// Define meal options for young children (ages 2-4)
const youngChildMains: MealItem[] = [
  {
    name: "Hummus & Veggie Pita Pocket",
    description: "Mini whole grain pita filled with hummus and finely diced vegetables.",
    nutritionalInfo: {
      calories: 220,
      protein: 8,
      carbs: 32,
      fat: 7
    },
    allergens: ["wheat"],
    prepTime: "4-5 mins"
  },
  {
    name: "Veggie Cream Cheese Sandwich",
    description: "Whole grain bread with vegetable cream cheese spread cut into small triangles.",
    nutritionalInfo: {
      calories: 210,
      protein: 6,
      carbs: 28,
      fat: 9
    },
    allergens: ["wheat", "dairy"],
    prepTime: "3 mins"
  },
  {
    name: "Mini Veggie Quesadilla",
    description: "Small tortilla with mild cheese and finely chopped vegetables, cut into quarters.",
    nutritionalInfo: {
      calories: 230,
      protein: 8,
      carbs: 26,
      fat: 10
    },
    allergens: ["wheat", "dairy"],
    prepTime: "5-7 mins"
  },
  {
    name: "Sunbutter & Apple Sandwich",
    description: "Sunflower seed butter with thin apple slices on whole grain bread.",
    nutritionalInfo: {
      calories: 260,
      protein: 7,
      carbs: 35,
      fat: 12
    },
    allergens: ["wheat"],
    prepTime: "3-4 mins"
  },
  {
    name: "Veggie Pizza Bagel",
    description: "Half mini bagel with tomato sauce and cheese, topped with tiny veggie pieces.",
    nutritionalInfo: {
      calories: 180,
      protein: 7,
      carbs: 26,
      fat: 5
    },
    allergens: ["wheat", "dairy"],
    prepTime: "8 mins"
  },
  {
    name: "Cheese & Crackers Plate",
    description: "Small cheese cubes with whole grain crackers.",
    nutritionalInfo: {
      calories: 220,
      protein: 10,
      carbs: 18,
      fat: 12
    },
    allergens: ["wheat", "dairy"],
    prepTime: "2 mins"
  }
];

const youngChildFruits: MealItem[] = [
  {
    name: "Apple Slices",
    description: "Thinly sliced apple.",
    nutritionalInfo: {
      calories: 60,
      protein: 0,
      carbs: 15,
      fat: 0
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Banana",
    description: "Half banana.",
    nutritionalInfo: {
      calories: 55,
      protein: 0.7,
      carbs: 14,
      fat: 0.2
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Berries Mix",
    description: "Small portion of mixed berries.",
    nutritionalInfo: {
      calories: 35,
      protein: 0.5,
      carbs: 9,
      fat: 0.1
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Orange Segments",
    description: "Peeled orange divided into small segments.",
    nutritionalInfo: {
      calories: 45,
      protein: 0.9,
      carbs: 11,
      fat: 0.1
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Watermelon Cubes",
    description: "Small cubes of seedless watermelon.",
    nutritionalInfo: {
      calories: 30,
      protein: 0.6,
      carbs: 8,
      fat: 0.2
    },
    allergens: [],
    prepTime: "2 mins"
  }
];

const youngChildVegetables: MealItem[] = [
  {
    name: "Cucumber Slices",
    description: "Thin cucumber slices.",
    nutritionalInfo: {
      calories: 15,
      protein: 0.6,
      carbs: 3,
      fat: 0
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Bell Pepper Strips",
    description: "Thin bell pepper strips.",
    nutritionalInfo: {
      calories: 20,
      protein: 0.7,
      carbs: 4.5,
      fat: 0.2
    },
    allergens: [],
    prepTime: "3 mins"
  },
  {
    name: "Cherry Tomatoes",
    description: "Cut in quarters cherry tomatoes.",
    nutritionalInfo: {
      calories: 25,
      protein: 1,
      carbs: 5,
      fat: 0.3
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Carrot Sticks",
    description: "Small thin carrot sticks.",
    nutritionalInfo: {
      calories: 30,
      protein: 0.7,
      carbs: 7,
      fat: 0.1
    },
    allergens: [],
    prepTime: "3 mins"
  },
  {
    name: "Steamed Broccoli Bites",
    description: "Tiny steamed broccoli florets.",
    nutritionalInfo: {
      calories: 30,
      protein: 2.5,
      carbs: 6,
      fat: 0.3
    },
    allergens: [],
    prepTime: "5 mins"
  }
];

const youngChildSnacks: MealItem[] = [
  {
    name: "Rice Cakes",
    description: "Mini rice cakes, plain or lightly flavored.",
    nutritionalInfo: {
      calories: 60,
      protein: 1,
      carbs: 13,
      fat: 0
    },
    allergens: [],
    prepTime: "0 mins"
  },
  {
    name: "Veggie Straws",
    description: "Crunchy vegetable-based snack straws.",
    nutritionalInfo: {
      calories: 80,
      protein: 1,
      carbs: 11,
      fat: 4
    },
    allergens: [],
    prepTime: "0 mins"
  },
  {
    name: "Cheese Stick",
    description: "Individual string cheese or cheese stick.",
    nutritionalInfo: {
      calories: 80,
      protein: 7,
      carbs: 1,
      fat: 6
    },
    allergens: ["dairy"],
    prepTime: "0 mins"
  },
  {
    name: "Roasted Chickpeas",
    description: "Lightly seasoned crispy chickpeas.",
    nutritionalInfo: {
      calories: 110,
      protein: 6,
      carbs: 17,
      fat: 3
    },
    allergens: [],
    prepTime: "0 mins (if prepared in advance)"
  },
  {
    name: "Yogurt Tube",
    description: "Kid-friendly yogurt in a tube.",
    nutritionalInfo: {
      calories: 70,
      protein: 2.5,
      carbs: 12,
      fat: 1.5
    },
    allergens: ["dairy"],
    prepTime: "0 mins"
  }
];

const youngChildDrinks: MealItem[] = [
  {
    name: "Water",
    description: "Hydrating water in a reusable bottle.",
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Milk",
    description: "Whole milk.",
    nutritionalInfo: {
      calories: 100,
      protein: 8,
      carbs: 12,
      fat: 8
    },
    allergens: ["dairy"],
    prepTime: "1 min"
  },
  {
    name: "Diluted Juice",
    description: "Half water, half 100% fruit juice.",
    nutritionalInfo: {
      calories: 40,
      protein: 0,
      carbs: 10,
      fat: 0
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Plant Milk",
    description: "Fortified plant-based milk like oat or soy.",
    nutritionalInfo: {
      calories: 70,
      protein: 3,
      carbs: 11,
      fat: 2.5
    },
    allergens: [],
    prepTime: "1 min"
  }
];

// Define meal options for older children (ages 5-10)
const olderChildMains: MealItem[] = [
  {
    name: "Veggie & Hummus Wrap",
    description: "Whole grain tortilla with hummus and various vegetables rolled up.",
    nutritionalInfo: {
      calories: 280,
      protein: 9,
      carbs: 42,
      fat: 10
    },
    allergens: ["wheat"],
    prepTime: "5 mins"
  },
  {
    name: "Black Bean & Rice Bowl",
    description: "Small container of rice topped with seasoned black beans and corn.",
    nutritionalInfo: {
      calories: 320,
      protein: 12,
      carbs: 58,
      fat: 5
    },
    allergens: [],
    prepTime: "8-10 mins (or use leftovers)"
  },
  {
    name: "Pasta Salad with Vegetables",
    description: "Whole grain pasta with olive oil, vegetables and a sprinkle of cheese.",
    nutritionalInfo: {
      calories: 310,
      protein: 10,
      carbs: 48,
      fat: 9
    },
    allergens: ["wheat", "dairy"],
    prepTime: "15 mins (or use leftovers)"
  },
  {
    name: "Avocado & Cucumber Sandwich",
    description: "Whole grain bread with mashed avocado and thin cucumber slices.",
    nutritionalInfo: {
      calories: 280,
      protein: 7,
      carbs: 36,
      fat: 14
    },
    allergens: ["wheat"],
    prepTime: "4 mins"
  },
  {
    name: "Mini Bean & Cheese Burritos",
    description: "Two small tortillas with refried beans and a sprinkle of cheese.",
    nutritionalInfo: {
      calories: 300,
      protein: 12,
      carbs: 42,
      fat: 9
    },
    allergens: ["wheat", "dairy"],
    prepTime: "6-7 mins"
  },
  {
    name: "Cheese & Crackers Plate",
    description: "Cheese slices with whole grain crackers.",
    nutritionalInfo: {
      calories: 270,
      protein: 12,
      carbs: 24,
      fat: 15
    },
    allergens: ["wheat", "dairy"],
    prepTime: "2 mins"
  }
];

const olderChildFruits: MealItem[] = [
  {
    name: "Apple Slices",
    description: "Fresh apple slices.",
    nutritionalInfo: {
      calories: 80,
      protein: 0.4,
      carbs: 21,
      fat: 0.3
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Orange",
    description: "Whole peeled orange or tangerine.",
    nutritionalInfo: {
      calories: 70,
      protein: 1.3,
      carbs: 17,
      fat: 0.2
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Grapes",
    description: "Small bunch of grapes.",
    nutritionalInfo: {
      calories: 60,
      protein: 0.6,
      carbs: 16,
      fat: 0.1
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Berries Mix",
    description: "Mix of strawberries, blueberries and raspberries.",
    nutritionalInfo: {
      calories: 55,
      protein: 0.7,
      carbs: 14,
      fat: 0.3
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Fruit Cup",
    description: "Mixed diced fruit in natural juice.",
    nutritionalInfo: {
      calories: 70,
      protein: 1,
      carbs: 18,
      fat: 0
    },
    allergens: [],
    prepTime: "0 mins (if using packaged)"
  }
];

const olderChildVegetables: MealItem[] = [
  {
    name: "Carrot & Celery Sticks",
    description: "Fresh carrot and celery sticks.",
    nutritionalInfo: {
      calories: 35,
      protein: 1,
      carbs: 8,
      fat: 0.2
    },
    allergens: [],
    prepTime: "3 mins"
  },
  {
    name: "Bell Pepper Strips",
    description: "Red, yellow and green bell pepper strips.",
    nutritionalInfo: {
      calories: 30,
      protein: 1,
      carbs: 7,
      fat: 0.3
    },
    allergens: [],
    prepTime: "3 mins"
  },
  {
    name: "Cherry Tomatoes",
    description: "Whole cherry tomatoes.",
    nutritionalInfo: {
      calories: 35,
      protein: 1.5,
      carbs: 8,
      fat: 0.4
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Cucumber Slices",
    description: "Fresh cucumber slices.",
    nutritionalInfo: {
      calories: 20,
      protein: 0.8,
      carbs: 4,
      fat: 0.1
    },
    allergens: [],
    prepTime: "2 mins"
  },
  {
    name: "Sugar Snap Peas",
    description: "Crunchy sugar snap peas.",
    nutritionalInfo: {
      calories: 30,
      protein: 2,
      carbs: 5,
      fat: 0.2
    },
    allergens: [],
    prepTime: "1 min"
  }
];

const olderChildSnacks: MealItem[] = [
  {
    name: "Seaweed Snacks",
    description: "Lightly roasted seaweed sheets.",
    nutritionalInfo: {
      calories: 30,
      protein: 1,
      carbs: 1,
      fat: 2
    },
    allergens: [],
    prepTime: "0 mins"
  },
  {
    name: "Popcorn",
    description: "Air-popped popcorn with light seasoning.",
    nutritionalInfo: {
      calories: 100,
      protein: 3,
      carbs: 20,
      fat: 1
    },
    allergens: [],
    prepTime: "2 mins (if prepared in advance)"
  },
  {
    name: "Whole Grain Crackers",
    description: "Unsweetened whole grain crackers.",
    nutritionalInfo: {
      calories: 120,
      protein: 3,
      carbs: 20,
      fat: 4
    },
    allergens: ["wheat"],
    prepTime: "0 mins"
  },
  {
    name: "Hard-Boiled Egg",
    description: "Pre-peeled hard-boiled egg.",
    nutritionalInfo: {
      calories: 70,
      protein: 6,
      carbs: 0,
      fat: 5
    },
    allergens: ["eggs"],
    prepTime: "0 mins (if prepared in advance)"
  },
  {
    name: "Yogurt Cup",
    description: "Plain or lightly flavored yogurt.",
    nutritionalInfo: {
      calories: 120,
      protein: 10,
      carbs: 15,
      fat: 3
    },
    allergens: ["dairy"],
    prepTime: "0 mins"
  }
];

const olderChildDrinks: MealItem[] = [
  {
    name: "Water",
    description: "Hydrating water in a reusable bottle.",
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Milk",
    description: "1% or 2% milk.",
    nutritionalInfo: {
      calories: 120,
      protein: 8,
      carbs: 12,
      fat: 5
    },
    allergens: ["dairy"],
    prepTime: "1 min"
  },
  {
    name: "100% Fruit Juice",
    description: "Small portion of 100% fruit juice.",
    nutritionalInfo: {
      calories: 80,
      protein: 0,
      carbs: 20,
      fat: 0
    },
    allergens: [],
    prepTime: "1 min"
  },
  {
    name: "Smoothie",
    description: "Small fruit and yogurt smoothie.",
    nutritionalInfo: {
      calories: 140,
      protein: 5,
      carbs: 25,
      fat: 3
    },
    allergens: ["dairy"],
    prepTime: "5 mins"
  }
];

// Age-based meal options
export const youngChildMeals = {
  mains: youngChildMains,
  fruits: youngChildFruits,
  vegetables: youngChildVegetables,
  snacks: youngChildSnacks,
  drinks: youngChildDrinks
};

export const olderChildMeals = {
  mains: olderChildMains,
  fruits: olderChildFruits,
  vegetables: olderChildVegetables,
  snacks: olderChildSnacks,
  drinks: olderChildDrinks
};

// Function to get age-appropriate meal options
export function getAgeLevelMeals(age: number) {
  if (age < 5) {
    return youngChildMeals;
  } else {
    return olderChildMeals;
  }
}

// Optional: Default grocery list categories for organization
export const groceryCategories = [
  "Fruits",
  "Vegetables",
  "Grains",
  "Proteins",
  "Dairy",
  "Other"
]; 
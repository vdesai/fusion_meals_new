// This file contains data about seasonal ingredients for different seasons and hemispheres

export type SeasonType = 'spring' | 'summer' | 'fall' | 'winter';
export type HemisphereType = 'northern' | 'southern';

export interface SeasonalIngredient {
  name: string;
  type: 'vegetable' | 'fruit' | 'herb' | 'seafood';
  description: string;
  peakMonths: number[]; // 1-12 for January-December
  nutrition: string;
  culinaryUses: string[];
  imageUrl: string;
  cuisineAffinity: string[]; // Which cuisines use this ingredient prominently
}

export interface SeasonalInfo {
  name: SeasonType;
  displayName: string;
  description: string;
  months: {
    northern: number[];
    southern: number[];
  };
  characteristics: string[];
  backgroundImage: string;
}

// Season information
export const seasons: SeasonalInfo[] = [
  {
    name: 'spring',
    displayName: 'Spring',
    description: 'A time of renewal and fresh, tender growth. Spring ingredients are often lighter and more delicate in flavor.',
    months: {
      northern: [3, 4, 5], // March, April, May
      southern: [9, 10, 11], // September, October, November
    },
    characteristics: [
      'Light, fresh flavors',
      'Tender textures',
      'Bright colors',
      'Emphasis on quick cooking methods',
      'Perfect for salads and light dishes'
    ],
    backgroundImage: '/images/seasons/spring-bg.jpg'
  },
  {
    name: 'summer',
    displayName: 'Summer',
    description: 'The season of abundance with vibrant, sun-ripened produce at its peak. Summer ingredients are often juicy, colorful, and full-flavored.',
    months: {
      northern: [6, 7, 8], // June, July, August
      southern: [12, 1, 2], // December, January, February
    },
    characteristics: [
      'Bold, rich flavors',
      'High water content',
      'Vibrant colors',
      'Minimal cooking required',
      'Perfect for grilling and cold preparations'
    ],
    backgroundImage: '/images/seasons/summer-bg.jpg'
  },
  {
    name: 'fall',
    displayName: 'Fall',
    description: 'The harvest season brings earthy, robust ingredients. Fall produce is often hearty, starchy, and warming.',
    months: {
      northern: [9, 10, 11], // September, October, November
      southern: [3, 4, 5], // March, April, May
    },
    characteristics: [
      'Rich, complex flavors',
      'Dense textures',
      'Earthy tones',
      'Suitable for slow cooking methods',
      'Perfect for comfort food and warming dishes'
    ],
    backgroundImage: '/images/seasons/fall-bg.jpg'
  },
  {
    name: 'winter',
    displayName: 'Winter',
    description: 'The season of preservation and hearty fare. Winter ingredients focus on storage crops, root vegetables, and preserved items.',
    months: {
      northern: [12, 1, 2], // December, January, February
      southern: [6, 7, 8], // June, July, August
    },
    characteristics: [
      'Deep, intense flavors',
      'Substantial textures',
      'Comforting qualities',
      'Ideal for long-cooking methods',
      'Perfect for stews, soups, and roasts'
    ],
    backgroundImage: '/images/seasons/winter-bg.jpg'
  }
];

// Comprehensive list of seasonal ingredients
export const seasonalIngredients: SeasonalIngredient[] = [
  // SPRING INGREDIENTS
  {
    name: 'Asparagus',
    type: 'vegetable',
    description: 'Tender spring stalks with a distinctive earthy flavor.',
    peakMonths: [3, 4, 5], // March-May
    nutrition: 'Rich in folate, fiber, vitamins A, C, E and K',
    culinaryUses: ['Roasted', 'Grilled', 'Steamed', 'In risottos', 'In pasta dishes'],
    imageUrl: '/images/ingredients/asparagus.jpg',
    cuisineAffinity: ['Mediterranean', 'French', 'Italian']
  },
  {
    name: 'Peas',
    type: 'vegetable',
    description: 'Sweet, tender green peas in their pods.',
    peakMonths: [4, 5, 6], // April-June
    nutrition: 'Good source of protein, fiber, vitamins C, K, and folate',
    culinaryUses: ['In salads', 'As side dishes', 'In soups', 'In risottos', 'In pasta'],
    imageUrl: '/images/ingredients/peas.jpg',
    cuisineAffinity: ['British', 'French', 'Italian', 'Indian']
  },
  {
    name: 'Artichokes',
    type: 'vegetable',
    description: 'Tender spring flower buds with a subtle, nutty flavor.',
    peakMonths: [3, 4, 5], // March-May
    nutrition: 'High in fiber, antioxidants, and vitamin C',
    culinaryUses: ['Steamed', 'Stuffed', 'In dips', 'In pasta', 'In salads'],
    imageUrl: '/images/ingredients/artichokes.jpg',
    cuisineAffinity: ['Mediterranean', 'Italian', 'French']
  },
  {
    name: 'Rhubarb',
    type: 'vegetable',
    description: 'Tart, crimson stalks used primarily in sweet dishes.',
    peakMonths: [4, 5, 6], // April-June
    nutrition: 'Contains vitamin K, calcium, and antioxidants',
    culinaryUses: ['In pies', 'In compotes', 'In jams', 'In sauces', 'In cocktails'],
    imageUrl: '/images/ingredients/rhubarb.jpg',
    cuisineAffinity: ['British', 'Scandinavian', 'American']
  },
  {
    name: 'Spring Onions',
    type: 'vegetable',
    description: 'Young, mild onions with tender green tops.',
    peakMonths: [3, 4, 5, 6], // March-June
    nutrition: 'Contains vitamin C, vitamin K, and folate',
    culinaryUses: ['In salads', 'As garnishes', 'In stir-fries', 'Grilled', 'In dips'],
    imageUrl: '/images/ingredients/spring-onions.jpg',
    cuisineAffinity: ['Asian', 'Mexican', 'Mediterranean']
  },
  
  // SUMMER INGREDIENTS
  {
    name: 'Tomatoes',
    type: 'vegetable',
    description: 'Sun-ripened summer fruits with juicy flesh and rich flavor.',
    peakMonths: [6, 7, 8, 9], // June-September
    nutrition: 'High in vitamin C, potassium, and lycopene',
    culinaryUses: ['In salads', 'In sauces', 'Roasted', 'In sandwiches', 'Raw'],
    imageUrl: '/images/ingredients/tomatoes.jpg',
    cuisineAffinity: ['Mediterranean', 'Italian', 'Mexican']
  },
  {
    name: 'Corn',
    type: 'vegetable',
    description: 'Sweet summer kernels with a burst of flavor.',
    peakMonths: [6, 7, 8, 9], // June-September
    nutrition: 'Contains fiber, vitamins B and C, and folate',
    culinaryUses: ['Grilled', 'In salads', 'In soups', 'In salsas', 'Roasted'],
    imageUrl: '/images/ingredients/corn.jpg',
    cuisineAffinity: ['American', 'Mexican', 'South American']
  },
  {
    name: 'Zucchini',
    type: 'vegetable',
    description: 'Tender summer squash with delicate flavor.',
    peakMonths: [6, 7, 8, 9], // June-September
    nutrition: 'Low in calories, high in water content, contains vitamin C',
    culinaryUses: ['Grilled', 'In stir-fries', 'In bread', 'Stuffed', 'In pasta'],
    imageUrl: '/images/ingredients/zucchini.jpg',
    cuisineAffinity: ['Mediterranean', 'Italian', 'French', 'Middle Eastern']
  },
  {
    name: 'Berries',
    type: 'fruit',
    description: 'Sweet, juicy summer fruits bursting with flavor.',
    peakMonths: [6, 7, 8], // June-August
    nutrition: 'High in antioxidants, vitamin C, and fiber',
    culinaryUses: ['In desserts', 'In salads', 'In smoothies', 'Raw', 'In sauces'],
    imageUrl: '/images/ingredients/berries.jpg',
    cuisineAffinity: ['American', 'British', 'Scandinavian', 'French']
  },
  {
    name: 'Basil',
    type: 'herb',
    description: 'Aromatic summer herb with sweet, peppery flavor.',
    peakMonths: [6, 7, 8, 9], // June-September
    nutrition: 'Contains vitamin K, antioxidants, and essential oils',
    culinaryUses: ['In pesto', 'In salads', 'In pasta', 'In cocktails', 'As garnish'],
    imageUrl: '/images/ingredients/basil.jpg',
    cuisineAffinity: ['Italian', 'Mediterranean', 'Thai']
  },
  
  // FALL INGREDIENTS
  {
    name: 'Pumpkin',
    type: 'vegetable',
    description: 'Sweet, earthy autumn squash with firm flesh.',
    peakMonths: [9, 10, 11], // September-November
    nutrition: 'High in vitamin A, fiber, and antioxidants',
    culinaryUses: ['In soups', 'In pies', 'Roasted', 'In breads', 'In risottos'],
    imageUrl: '/images/ingredients/pumpkin.jpg',
    cuisineAffinity: ['American', 'Italian', 'Middle Eastern', 'Japanese']
  },
  {
    name: 'Sweet Potatoes',
    type: 'vegetable',
    description: 'Vibrant, sweet root vegetables with orange flesh.',
    peakMonths: [9, 10, 11, 12], // September-December
    nutrition: 'Rich in vitamin A, fiber, and antioxidants',
    culinaryUses: ['Roasted', 'In soups', 'Mashed', 'In pies', 'In stews'],
    imageUrl: '/images/ingredients/sweet-potatoes.jpg',
    cuisineAffinity: ['American', 'African', 'Caribbean', 'Japanese']
  },
  {
    name: 'Brussels Sprouts',
    type: 'vegetable',
    description: 'Small, cabbage-like vegetables with nutty flavor when roasted.',
    peakMonths: [9, 10, 11, 12], // September-December
    nutrition: 'High in vitamin K, vitamin C, and fiber',
    culinaryUses: ['Roasted', 'Sautéed', 'In hash', 'Shaved in salads', 'In stir-fries'],
    imageUrl: '/images/ingredients/brussels-sprouts.jpg',
    cuisineAffinity: ['British', 'French', 'American', 'Belgian']
  },
  {
    name: 'Apples',
    type: 'fruit',
    description: 'Crisp, sweet-tart autumn fruits in many varieties.',
    peakMonths: [9, 10, 11], // September-November
    nutrition: 'Contains fiber, vitamin C, and antioxidants',
    culinaryUses: ['In pies', 'In sauces', 'In salads', 'Baked', 'In cider'],
    imageUrl: '/images/ingredients/apples.jpg',
    cuisineAffinity: ['American', 'British', 'French', 'German']
  },
  {
    name: 'Cranberries',
    type: 'fruit',
    description: 'Tart red berries harvested in autumn.',
    peakMonths: [10, 11, 12], // October-December
    nutrition: 'High in antioxidants, vitamin C, and fiber',
    culinaryUses: ['In sauces', 'In baked goods', 'In juices', 'Dried in salads', 'In relishes'],
    imageUrl: '/images/ingredients/cranberries.jpg',
    cuisineAffinity: ['American', 'Canadian', 'Scandinavian']
  },
  
  // WINTER INGREDIENTS
  {
    name: 'Kale',
    type: 'vegetable',
    description: 'Hearty winter green with robust flavor.',
    peakMonths: [11, 12, 1, 2, 3], // November-March
    nutrition: 'Extremely high in vitamin K, C, A, and antioxidants',
    culinaryUses: ['In salads', 'Sautéed', 'In soups', 'In smoothies', 'Chips'],
    imageUrl: '/images/ingredients/kale.jpg',
    cuisineAffinity: ['Mediterranean', 'Scandinavian', 'Portuguese', 'American']
  },
  {
    name: 'Citrus Fruits',
    type: 'fruit',
    description: 'Bright winter fruits with juicy segments and fragrant zest.',
    peakMonths: [12, 1, 2, 3], // December-March
    nutrition: 'High in vitamin C, fiber, and antioxidants',
    culinaryUses: ['In desserts', 'In salads', 'In sauces', 'In cocktails', 'With seafood'],
    imageUrl: '/images/ingredients/citrus.jpg',
    cuisineAffinity: ['Mediterranean', 'Middle Eastern', 'Southeast Asian', 'Latin American']
  },
  {
    name: 'Root Vegetables',
    type: 'vegetable',
    description: 'Hearty winter vegetables with earthy flavors.',
    peakMonths: [10, 11, 12, 1, 2, 3], // October-March
    nutrition: 'Rich in fiber, antioxidants, and various minerals',
    culinaryUses: ['Roasted', 'In soups', 'In stews', 'Mashed', 'In gratins'],
    imageUrl: '/images/ingredients/root-vegetables.jpg',
    cuisineAffinity: ['Northern European', 'Russian', 'Scandinavian', 'British']
  },
  {
    name: 'Winter Squash',
    type: 'vegetable',
    description: 'Hard-skinned squashes with sweet, nutty flesh.',
    peakMonths: [10, 11, 12, 1, 2], // October-February
    nutrition: 'High in vitamin A, fiber, and antioxidants',
    culinaryUses: ['Roasted', 'In soups', 'In stews', 'Stuffed', 'In risotto'],
    imageUrl: '/images/ingredients/winter-squash.jpg',
    cuisineAffinity: ['American', 'Japanese', 'Italian', 'Mexican']
  },
  {
    name: 'Pomegranate',
    type: 'fruit',
    description: 'Ruby red winter fruit filled with juicy seed sacs.',
    peakMonths: [10, 11, 12, 1], // October-January
    nutrition: 'Rich in antioxidants, vitamin C, and fiber',
    culinaryUses: ['In salads', 'In desserts', 'In sauces', 'As garnish', 'In beverages'],
    imageUrl: '/images/ingredients/pomegranate.jpg',
    cuisineAffinity: ['Middle Eastern', 'Mediterranean', 'Indian', 'Persian']
  }
];

// Function to get current season based on month and hemisphere
export function getCurrentSeason(month: number = new Date().getMonth() + 1, hemisphere: HemisphereType = 'northern'): SeasonType {
  for (const season of seasons) {
    if (season.months[hemisphere].includes(month)) {
      return season.name;
    }
  }
  // Default fallback
  return 'spring';
}

// Function to get ingredients by season
export function getIngredientsBySeason(seasonName: SeasonType): SeasonalIngredient[] {
  const season = seasons.find(s => s.name === seasonName);
  if (!season) return [];
  
  // Get the months for the season (using northern hemisphere for simplicity)
  const seasonMonths = season.months.northern;
  
  // Filter ingredients that are in season during those months
  return seasonalIngredients.filter(ingredient => 
    ingredient.peakMonths.some(month => seasonMonths.includes(month))
  );
}

// Function to get the current month's ingredients
export function getCurrentMonthIngredients(month: number = new Date().getMonth() + 1): SeasonalIngredient[] {
  return seasonalIngredients.filter(ingredient => 
    ingredient.peakMonths.includes(month)
  );
}

// Helper function to get month name from month number (1-12)
export function getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1];
}

// Helper function to get all months for a specific ingredient
export function getIngredientMonths(ingredient: SeasonalIngredient): string {
  return ingredient.peakMonths.map(m => getMonthName(m)).join(', ');
} 
import { NextRequest, NextResponse } from 'next/server';

interface CuisineExploreRequest {
  region?: string;
  dietary_restrictions?: string[];
  ingredients?: string[];
  difficulty?: string;
}

interface Recipe {
  id: string;
  name: string;
  origin: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: string;
  cook_time: string;
  difficulty: string;
  tags: string[];
  image_url: string;
}

interface CuisineResponse {
  cuisine_name: string;
  region: string;
  description: string;
  key_ingredients: string[];
  key_spices: string[];
  popular_dishes: Recipe[];
  cultural_significance: string;
  history: string;
}

// Backend response interfaces
interface BackendDish {
  name: string;
  description: string;
  key_ingredients: string[];
  cultural_significance: string;
  difficulty: string;
  preparation_time: string;
  typical_occasions: string;
}

interface BackendTechnique {
  name: string;
  description: string;
  cultural_significance: string;
  key_dishes: string[];
  basic_instructions: string;
}

interface BackendCuisineInfo {
  name: string;
  region: string;
  countries: string[];
  key_ingredients: string[];
  flavor_profile: string;
  historical_overview: string;
  dietary_characteristics: string;
}

interface BackendCulturalContext {
  dining_customs: string;
  meal_structure: string;
  cultural_significance: string;
  celebrations_and_festivals: string[];
}

interface BackendCuisineResponse {
  cuisine_info: BackendCuisineInfo;
  representative_dishes: BackendDish[];
  cultural_context: BackendCulturalContext;
  techniques: BackendTechnique[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8001';
    
    // If a region is specified, get the specific cuisine data
    if (region) {
      // Use the POST endpoint for region-specific data
      try {
        const response = await fetch(`${backendUrl}/global-cuisine/explore`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ region }),
        });
        
        if (!response.ok) {
          console.error('Backend API error when fetching region data:', response.statusText);
          return NextResponse.json(getMockCuisine(region));
        }
        
        const backendData: BackendCuisineResponse = await response.json();
        const transformedData = transformBackendResponse(backendData, region);
        
        return NextResponse.json(transformedData);
      } catch (error) {
        console.error(`Error fetching ${region} cuisine:`, error);
        return NextResponse.json(getMockCuisine(region), { status: 500 });
      }
    } else {
      // If no region is specified, get the list of available regions
      const url = new URL(`${backendUrl}/global-cuisine/regions`);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error('Backend API error when fetching regions:', response.statusText);
        // Return a random cuisine if the backend fails
        return NextResponse.json(getMockCuisine(null));
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching cuisine data:', error);
    return NextResponse.json(
      getMockCuisine(null),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CuisineExploreRequest = await request.json();
    
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8001';
    const response = await fetch(`${backendUrl}/global-cuisine/explore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error('Backend API error:', response.statusText);
      
      // Return mock data if the backend fails
      return NextResponse.json(getMockCuisine(body.region || null));
    }
    
    const backendData: BackendCuisineResponse = await response.json();
    const transformedData = transformBackendResponse(backendData, body.region || '');
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error exploring cuisines:', error);
    return NextResponse.json(
      getMockCuisine(null),
      { status: 500 }
    );
  }
}

function transformBackendResponse(backendData: BackendCuisineResponse, regionQuery: string): CuisineResponse {
  // Transform the representative dishes into the format expected by the frontend
  const popularDishes: Recipe[] = backendData.representative_dishes.map((dish, index) => {
    // Generate plausible instructions from the dish description
    const instructions = generateInstructions(dish.description, dish.key_ingredients);
    
    // Generate more detailed ingredients from the key ingredients
    const detailedIngredients = expandIngredients(dish.key_ingredients);
    
    // Convert preparation time to cook time and prep time
    const { prepTime, cookTime } = splitPreparationTime(dish.preparation_time);
    
    // Generate tags based on the dish information
    const tags = generateTags(dish.name, dish.difficulty, dish.typical_occasions, regionQuery);
    
    return {
      id: `${dish.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      name: dish.name,
      origin: backendData.cuisine_info.region,
      description: dish.description,
      ingredients: detailedIngredients,
      instructions: instructions,
      prep_time: prepTime,
      cook_time: cookTime,
      difficulty: dish.difficulty.toLowerCase(),
      tags: tags,
      image_url: `https://source.unsplash.com/random/300x200/?${encodeURIComponent(dish.name.toLowerCase())}`
    };
  });

  // Extract key spices from techniques and dish ingredients
  const keySpices = extractKeySpices(backendData);
  
  return {
    cuisine_name: backendData.cuisine_info.name.replace(' Cuisine', ''),
    region: backendData.cuisine_info.region,
    description: `${backendData.cuisine_info.flavor_profile}. ${backendData.cuisine_info.dietary_characteristics}`,
    key_ingredients: backendData.cuisine_info.key_ingredients.map(ingredient => 
      ingredient.charAt(0).toUpperCase() + ingredient.slice(1)
    ),
    key_spices: keySpices,
    popular_dishes: popularDishes,
    cultural_significance: backendData.cultural_context.cultural_significance,
    history: backendData.cuisine_info.historical_overview
  };
}

function generateInstructions(description: string, ingredients: string[]): string[] {
  // Generate 4-6 plausible instructions based on the dish description and ingredients
  const instructionCount = 4 + Math.floor(Math.random() * 3);
  const instructions: string[] = [];
  
  // First instruction typically involves preparation
  instructions.push(`Prepare all ingredients: ${ingredients.slice(0, 3).join(', ')}, etc.`);
  
  // Add cooking steps based on ingredients
  if (ingredients.includes('pasta') || ingredients.includes('rice')) {
    instructions.push(`Cook the ${ingredients.includes('pasta') ? 'pasta' : 'rice'} according to package instructions until al dente.`);
  }
  
  if (ingredients.some(i => ['meat', 'chicken', 'beef', 'pork', 'fish'].includes(i))) {
    instructions.push(`Season and cook the protein until properly done and set aside.`);
  }
  
  // Add instructions based on description keywords
  if (description.includes('sauce')) {
    instructions.push(`Prepare the sauce by combining the remaining ingredients and simmering until thickened.`);
  }
  
  // Fill remaining instructions with generic steps
  const genericInstructions = [
    `Combine all ingredients in a large bowl and mix thoroughly.`,
    `Heat olive oil in a pan and sauté the vegetables until tender.`,
    `Simmer for 20-30 minutes to allow flavors to meld together.`,
    `Garnish with fresh herbs before serving.`,
    `Serve hot with your choice of side dishes.`
  ];
  
  while (instructions.length < instructionCount) {
    const randomInstruction = genericInstructions[Math.floor(Math.random() * genericInstructions.length)];
    if (!instructions.includes(randomInstruction)) {
      instructions.push(randomInstruction);
    }
  }
  
  return instructions;
}

function expandIngredients(keyIngredients: string[]): string[] {
  // Expand the key ingredients list with quantities and more detailed descriptions
  return keyIngredients.map(ingredient => {
    const quantity = ['1 cup', '2 tablespoons', '1/2 teaspoon', '3 cloves', '200g', '1/4 cup', '2 medium'][Math.floor(Math.random() * 7)];
    const adjective = ['fresh', 'minced', 'chopped', 'diced', 'sliced', 'grated', 'whole'][Math.floor(Math.random() * 7)];
    
    return `${quantity} ${adjective} ${ingredient}`;
  });
}

function splitPreparationTime(preparationTime: string): { prepTime: string; cookTime: string } {
  // Extract numeric value from preparation time
  const match = preparationTime.match(/(\d+)/);
  const totalMinutes = match ? parseInt(match[1]) : 30;
  
  // Split into prep time (1/3) and cook time (2/3)
  const prepMinutes = Math.round(totalMinutes / 3);
  const cookMinutes = totalMinutes - prepMinutes;
  
  return {
    prepTime: `${prepMinutes} minutes`,
    cookTime: `${cookMinutes} minutes`
  };
}

function generateTags(dishName: string, difficulty: string, occasions: string, region: string): string[] {
  const tags: string[] = [];
  
  // Add region as a tag
  if (region) {
    tags.push(region);
  }
  
  // Add difficulty as a tag
  tags.push(difficulty);
  
  // Add occasion-based tags
  if (occasions.includes('special occasions')) {
    tags.push('Special Occasion');
  } else if (occasions.includes('everyday')) {
    tags.push('Everyday');
  }
  
  // Add food type tags based on dish name
  const foodTypes = {
    'pasta': ['Pasta', 'Italian'],
    'risotto': ['Rice', 'Italian'],
    'curry': ['Spicy', 'Curry'],
    'soup': ['Soup', 'Comfort Food'],
    'salad': ['Fresh', 'Healthy'],
    'grill': ['Grilled', 'BBQ'],
    'bake': ['Baked', 'Oven']
  };
  
  for (const [keyword, typeTags] of Object.entries(foodTypes)) {
    if (dishName.toLowerCase().includes(keyword)) {
      tags.push(...typeTags);
    }
  }
  
  // Add a couple of generic tags if needed
  const genericTags = ['Traditional', 'Authentic', 'Homemade', 'Flavorful', 'Gourmet', 'Classic'];
  while (tags.length < 3) {
    const randomTag = genericTags[Math.floor(Math.random() * genericTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  // Keep unique tags and limit to 5
  return [...new Set(tags)].slice(0, 5);
}

function extractKeySpices(backendData: BackendCuisineResponse): string[] {
  // Extract spices from techniques and ingredients
  const spices = new Set<string>();
  
  // Common spices by region
  const commonSpicesByRegion: {[key: string]: string[]} = {
    'Italy': ['Basil', 'Oregano', 'Rosemary', 'Thyme', 'Sage', 'Red Pepper Flakes'],
    'Japan': ['Wasabi', 'Shiso', 'Sansho Pepper', 'Yuzu', 'Ginger'],
    'India': ['Cumin', 'Turmeric', 'Cardamom', 'Cinnamon', 'Cloves', 'Coriander', 'Garam Masala'],
    'Mexico': ['Cilantro', 'Chili Powder', 'Cumin', 'Mexican Oregano', 'Cinnamon', 'Epazote'],
    'Thailand': ['Lemongrass', 'Galangal', 'Thai Basil', 'Kaffir Lime Leaves', 'Turmeric'],
    'China': ['Five Spice Powder', 'Sichuan Pepper', 'Star Anise', 'Ginger', 'Cinnamon'],
    'France': ['Herbes de Provence', 'Tarragon', 'Thyme', 'Bay Leaf', 'Sage'],
    'Mediterranean': ['Oregano', 'Rosemary', 'Thyme', 'Bay Leaf', 'Mint']
  };
  
  // Add region-specific spices
  const region = backendData.cuisine_info.region;
  const regionalSpices = commonSpicesByRegion[region] || commonSpicesByRegion['Italy']; // Default to Italian
  regionalSpices.forEach(spice => spices.add(spice));
  
  // Extract spices from techniques descriptions
  backendData.techniques.forEach(technique => {
    const description = technique.description.toLowerCase();
    const commonSpiceWords = ['spice', 'herb', 'seasoning', 'flavor'];
    
    if (commonSpiceWords.some(word => description.includes(word))) {
      // If the technique description mentions spices, add some from our regional list
      const randomSpiceCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < randomSpiceCount; i++) {
        if (regionalSpices[i]) {
          spices.add(regionalSpices[i]);
        }
      }
    }
  });
  
  return Array.from(spices).slice(0, 5);
}

function getMockCuisine(region: string | null): CuisineResponse {
  const cuisines: {[key: string]: CuisineResponse} = {
    'italian': {
      cuisine_name: 'Italian',
      region: 'Southern Europe',
      description: 'Italian cuisine is a Mediterranean cuisine consisting of the ingredients, recipes and cooking techniques developed across the Italian Peninsula. Italian cuisine is known for its regional diversity, abundance of difference in taste, and is one of the most popular in the world.',
      key_ingredients: ['Tomatoes', 'Olive Oil', 'Pasta', 'Cheeses (Parmesan, Mozzarella)', 'Basil', 'Garlic'],
      key_spices: ['Basil', 'Oregano', 'Rosemary', 'Thyme', 'Red Pepper Flakes'],
      cultural_significance: 'Food is an integral part of Italian culture. Family gatherings often revolve around meals, and recipes are passed down through generations, preserving traditions.',
      history: 'Italian cuisine developed over centuries, influenced by Greek, Roman, Byzantine and Arab civilizations. The discovery of the New World brought new ingredients like tomatoes and peppers that transformed the cuisine.',
      popular_dishes: [
        {
          id: 'pasta-carbonara',
          name: 'Pasta Carbonara',
          origin: 'Rome, Italy',
          description: 'A rich, creamy pasta dish made with eggs, cheese, pancetta, and black pepper.',
          ingredients: ['Spaghetti', 'Eggs', 'Pancetta or Guanciale', 'Pecorino Romano cheese', 'Black pepper', 'Salt'],
          instructions: [
            'Bring a large pot of salted water to boil and cook spaghetti until al dente.',
            'While pasta cooks, sauté pancetta until crispy.',
            'In a bowl, whisk eggs and grated cheese together.',
            'Drain pasta and immediately add to the pan with pancetta. Remove from heat.',
            'Quickly stir in the egg mixture, creating a creamy sauce.',
            'Season with freshly ground black pepper and serve immediately.'
          ],
          prep_time: '10 minutes',
          cook_time: '15 minutes',
          difficulty: 'Intermediate',
          tags: ['Pasta', 'Dinner', 'Authentic'],
          image_url: 'https://source.unsplash.com/random/300x200/?carbonara'
        },
        {
          id: 'margherita-pizza',
          name: 'Pizza Margherita',
          origin: 'Naples, Italy',
          description: 'A classic Neapolitan pizza topped with tomatoes, fresh mozzarella cheese, fresh basil, salt, and extra-virgin olive oil.',
          ingredients: ['Pizza dough', 'San Marzano tomatoes', 'Fresh mozzarella cheese', 'Fresh basil', 'Extra virgin olive oil', 'Salt'],
          instructions: [
            'Preheat oven to 500°F (260°C) with a pizza stone if available.',
            'Stretch the pizza dough into a thin round.',
            'Top with crushed tomatoes, leaving a border for the crust.',
            'Tear fresh mozzarella into pieces and distribute over the pizza.',
            'Bake for 8-10 minutes until crust is golden and cheese is bubbling.',
            'Remove from oven, top with fresh basil leaves and a drizzle of olive oil.'
          ],
          prep_time: '20 minutes',
          cook_time: '10 minutes',
          difficulty: 'Easy',
          tags: ['Pizza', 'Vegetarian', 'Traditional'],
          image_url: 'https://source.unsplash.com/random/300x200/?pizza'
        }
      ]
    },
    'japanese': {
      cuisine_name: 'Japanese',
      region: 'East Asia',
      description: 'Japanese cuisine encompasses the regional and traditional foods of Japan. The traditional cuisine of Japan is based on rice with miso soup and other dishes, with an emphasis on seasonal ingredients and simple presentation.',
      key_ingredients: ['Rice', 'Seafood', 'Nori (Seaweed)', 'Soy Sauce', 'Miso', 'Tofu'],
      key_spices: ['Wasabi', 'Shiso', 'Sansho pepper', 'Yuzu', 'Ginger'],
      cultural_significance: 'Japanese cuisine is deeply tied to the country\'s cultural identity and traditions. The emphasis on seasonality, presentation, and respect for ingredients reflects broader Japanese cultural values.',
      history: 'Japanese cuisine has evolved over centuries, with influences from China and Korea. The country\'s isolation policy during the Edo period (1603-1868) allowed for the development of distinctive culinary traditions.',
      popular_dishes: [
        {
          id: 'sushi-rolls',
          name: 'Sushi Rolls (Maki)',
          origin: 'Japan',
          description: 'Sushi rolls consist of vinegared rice and various fillings wrapped in nori seaweed.',
          ingredients: ['Sushi rice', 'Nori sheets', 'Cucumber', 'Avocado', 'Fresh fish (salmon, tuna)', 'Soy sauce', 'Wasabi', 'Pickled ginger'],
          instructions: [
            'Prepare sushi rice by mixing cooked rice with rice vinegar, sugar, and salt.',
            'Place a nori sheet on a bamboo mat, shiny side down.',
            'Spread rice evenly over nori, leaving a 1-inch margin at the top.',
            'Place fillings in a line across the center of the rice.',
            'Roll using the bamboo mat, applying gentle pressure.',
            'Cut into 6-8 pieces using a wet, sharp knife.',
            'Serve with soy sauce, wasabi, and pickled ginger.'
          ],
          prep_time: '30 minutes',
          cook_time: '20 minutes',
          difficulty: 'Intermediate',
          tags: ['Seafood', 'Rice', 'Traditional'],
          image_url: 'https://source.unsplash.com/random/300x200/?sushi'
        },
        {
          id: 'ramen',
          name: 'Tonkotsu Ramen',
          origin: 'Fukuoka, Japan',
          description: 'A rich, pork-based noodle soup with a creamy, hearty broth and various toppings.',
          ingredients: ['Pork bones', 'Ramen noodles', 'Chashu (braised pork belly)', 'Soft-boiled eggs', 'Green onions', 'Nori', 'Bean sprouts', 'Garlic'],
          instructions: [
            'Simmer pork bones for 8-12 hours to create a rich, milky broth.',
            'Prepare toppings: slice chashu, marinate soft-boiled eggs, chop green onions.',
            'Cook ramen noodles according to package instructions.',
            'Place cooked noodles in a bowl and ladle hot broth over them.',
            'Arrange toppings artfully on top of the soup.',
            'Serve immediately while hot.'
          ],
          prep_time: '1 hour',
          cook_time: '12 hours',
          difficulty: 'Advanced',
          tags: ['Soup', 'Noodles', 'Comfort Food'],
          image_url: 'https://source.unsplash.com/random/300x200/?ramen'
        }
      ]
    },
    'mexican': {
      cuisine_name: 'Mexican',
      region: 'North America',
      description: 'Mexican cuisine is primarily a fusion of indigenous Mesoamerican cooking with European elements added after the Spanish conquest. Native staples include corn, beans, avocados, tomatoes, and chili peppers, alongside rice, meat, and various herbs and spices.',
      key_ingredients: ['Corn', 'Beans', 'Chili Peppers', 'Tomatoes', 'Avocados', 'Tortillas'],
      key_spices: ['Cumin', 'Oregano', 'Cilantro', 'Chipotle', 'Ancho chili', 'Cinnamon'],
      cultural_significance: 'Food in Mexico is a vibrant expression of culture and history, playing a central role in celebrations, festivals, and daily life. Mexican cuisine was recognized by UNESCO as an Intangible Cultural Heritage of Humanity.',
      history: 'Mexican cuisine dates back to Mesoamerican times with staples like corn, beans, and chili peppers. The Spanish conquest introduced new ingredients such as dairy, wheat, and various meats, creating the fusion cuisine known today.',
      popular_dishes: [
        {
          id: 'tacos-al-pastor',
          name: 'Tacos Al Pastor',
          origin: 'Central Mexico',
          description: 'Spit-grilled pork tacos inspired by Lebanese shawarma, marinated with spices and served with pineapple, onions, and cilantro.',
          ingredients: ['Pork shoulder', 'Dried guajillo chiles', 'Achiote paste', 'Pineapple', 'Corn tortillas', 'White onion', 'Cilantro', 'Lime'],
          instructions: [
            'Marinate sliced pork in a mixture of dried chiles, achiote, pineapple, and spices for at least 4 hours.',
            'Cook the marinated meat on a vertical spit or grill until cooked through and slightly charred.',
            'Warm corn tortillas on a hot comal or griddle.',
            'Slice the cooked meat thinly and place on tortillas.',
            'Top with diced pineapple, chopped onion, and cilantro.',
            'Serve with lime wedges and salsa of choice.'
          ],
          prep_time: '4 hours',
          cook_time: '1 hour',
          difficulty: 'Intermediate',
          tags: ['Tacos', 'Street Food', 'Pork'],
          image_url: 'https://source.unsplash.com/random/300x200/?tacos'
        },
        {
          id: 'mole-poblano',
          name: 'Mole Poblano',
          origin: 'Puebla, Mexico',
          description: 'A rich, complex sauce made with chocolate and chili peppers, typically served over chicken or turkey.',
          ingredients: ['Chicken', 'Dried chiles (ancho, pasilla, mulato)', 'Mexican chocolate', 'Tomatoes', 'Onion', 'Garlic', 'Sesame seeds', 'Peanuts', 'Almonds', 'Cinnamon', 'Cloves'],
          instructions: [
            'Toast the dried chiles, nuts, and seeds until fragrant.',
            'Puree toasted ingredients with tomatoes, onions, garlic, and spices.',
            'Cook the puree in oil until it thickens.',
            'Add chicken broth and Mexican chocolate, simmer until sauce thickens.',
            'In a separate pot, cook chicken until tender.',
            'Pour the mole sauce over the chicken and simmer together briefly.',
            'Serve with rice and warm tortillas.'
          ],
          prep_time: '1 hour',
          cook_time: '2 hours',
          difficulty: 'Advanced',
          tags: ['Traditional', 'Main Course', 'Spicy'],
          image_url: 'https://source.unsplash.com/random/300x200/?mole'
        }
      ]
    },
    'indian': {
      cuisine_name: 'Indian',
      region: 'South Asia',
      description: 'Indian cuisine consists of a variety of regional and traditional dishes native to the Indian subcontinent. Given the diversity of soil, climate, culture, ethnic groups, and occupations, these cuisines vary substantially and use locally available spices, herbs, vegetables, and fruits.',
      key_ingredients: ['Rice', 'Lentils', 'Chickpeas', 'Paneer (fresh cheese)', 'Vegetables', 'Yogurt'],
      key_spices: ['Cumin', 'Turmeric', 'Cardamom', 'Cinnamon', 'Cloves', 'Garam Masala', 'Coriander'],
      cultural_significance: 'Food in India is deeply connected to culture, religion, and tradition. Many religious practices include fasting and feasting, and food plays a central role in festivals and celebrations.',
      history: 'Indian cuisine has evolved over thousands of years, influenced by various civilizations and trade routes. The cuisine has also influenced and been influenced by neighboring regions and colonial powers.',
      popular_dishes: [
        {
          id: 'butter-chicken',
          name: 'Butter Chicken (Murgh Makhani)',
          origin: 'Delhi, India',
          description: 'A rich, creamy tomato-based curry with tender chicken pieces, originally created in the 1950s.',
          ingredients: ['Chicken thighs', 'Yogurt', 'Tomatoes', 'Butter', 'Cream', 'Garam masala', 'Cumin', 'Turmeric', 'Ginger', 'Garlic', 'Kashmiri chili powder'],
          instructions: [
            'Marinate chicken in yogurt, lemon juice, and spices for at least 2 hours.',
            'Grill or bake the marinated chicken until partially cooked.',
            'In a large pot, sauté onions, ginger, and garlic until golden.',
            'Add tomatoes and spices, cook until tomatoes break down.',
            'Blend the sauce until smooth, then return to pot.',
            'Add butter, cream, and the partially cooked chicken.',
            'Simmer until chicken is fully cooked and sauce thickens.',
            'Garnish with cream and fresh coriander leaves.'
          ],
          prep_time: '2 hours',
          cook_time: '45 minutes',
          difficulty: 'Intermediate',
          tags: ['Curry', 'Chicken', 'Rich'],
          image_url: 'https://source.unsplash.com/random/300x200/?butter-chicken'
        },
        {
          id: 'vegetable-biryani',
          name: 'Vegetable Biryani',
          origin: 'Indian Subcontinent',
          description: 'A fragrant rice dish cooked with mixed vegetables, aromatic spices, and herbs.',
          ingredients: ['Basmati rice', 'Mixed vegetables', 'Onions', 'Yogurt', 'Ghee', 'Ginger-garlic paste', 'Green chilies', 'Biryani masala', 'Saffron', 'Mint leaves', 'Coriander leaves'],
          instructions: [
            'Partially cook basmati rice with whole spices and set aside.',
            'Sauté onions until golden brown, then add ginger-garlic paste and green chilies.',
            'Add mixed vegetables and biryani masala, cook until vegetables are tender.',
            'Layer the vegetable mixture and partially cooked rice in a heavy-bottomed pot.',
            'Top with fried onions, mint leaves, and saffron-infused milk.',
            'Seal the pot with dough or foil and cook on low heat for 20-25 minutes.',
            'Mix gently before serving, garnish with fresh coriander leaves.'
          ],
          prep_time: '30 minutes',
          cook_time: '1 hour',
          difficulty: 'Intermediate',
          tags: ['Rice', 'Vegetarian', 'One-pot'],
          image_url: 'https://source.unsplash.com/random/300x200/?biryani'
        }
      ]
    }
  };
  
  if (region && region.toLowerCase() in cuisines) {
    return cuisines[region.toLowerCase()];
  } else {
    // Return a random cuisine if no specific region is requested
    const regions = Object.keys(cuisines);
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    return cuisines[randomRegion];
  }
} 
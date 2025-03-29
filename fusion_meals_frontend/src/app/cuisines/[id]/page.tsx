'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  ArrowBack, 
  Restaurant, 
  LocalDining, 
  Kitchen, 
  Public, 
  EmojiEvents, 
  MenuBook 
} from '@mui/icons-material';
import Link from 'next/link';

// Sample cuisine data with more detailed information
interface Cuisine {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  region: string;
  flagEmoji: string;
  keyIngredients: string[];
  commonDishes: string[];
  cookingTechniques: string[];
  funFact: string;
  suggestions: FoodSuggestion[];
}

interface FoodSuggestion {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  tags: string[];
}

// Sample cuisines database 
const cuisinesData: Record<string, Cuisine> = {
  'italian': {
    id: 'italian',
    name: 'Italian',
    description: 'The heart of Mediterranean cuisine with pasta, pizza, and rich flavors.',
    longDescription: 'Italian cuisine is characterized by its simplicity, with many dishes having only a few ingredients. Italian cooks rely chiefly on the quality of the ingredients rather than on elaborate preparation. Ingredients and dishes vary by region. Many dishes that were once regional have proliferated with variations throughout the country.',
    image: '/images/cuisines/italian.jpg',
    region: 'Southern Europe',
    flagEmoji: '🇮🇹',
    keyIngredients: ['Olive Oil', 'Tomatoes', 'Basil', 'Garlic', 'Parmesan Cheese', 'Pasta', 'Balsamic Vinegar'],
    commonDishes: ['Pizza', 'Pasta Carbonara', 'Risotto', 'Lasagna', 'Tiramisu', 'Gelato', 'Osso Buco'],
    cookingTechniques: ['Al dente pasta cooking', 'Slow simmering of sauces', 'Grilling', 'Braising'],
    funFact: 'There are over 600 different pasta shapes produced worldwide, with Italy producing the most varieties.',
    suggestions: [
      {
        id: 'pasta-carbonara',
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with pancetta, eggs, and Parmesan cheese.',
        image: '/images/food/pasta-carbonara.jpg',
        difficulty: 'Medium',
        prepTime: '20 minutes',
        tags: ['pasta', 'creamy', 'dinner']
      },
      {
        id: 'margherita-pizza',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
        image: '/images/food/margherita-pizza.jpg',
        difficulty: 'Medium',
        prepTime: '1 hour',
        tags: ['pizza', 'vegetarian', 'dinner']
      },
      {
        id: 'tiramisu',
        name: 'Tiramisu',
        description: 'Coffee-flavored Italian dessert made with ladyfingers and mascarpone cheese.',
        image: '/images/food/tiramisu.jpg',
        difficulty: 'Medium',
        prepTime: '4 hours (including chilling)',
        tags: ['dessert', 'coffee', 'sweet']
      }
    ]
  },
  'japanese': {
    id: 'japanese',
    name: 'Japanese',
    description: 'Precise, minimal, and artistic cuisine balancing flavor and tradition.',
    longDescription: 'Japanese cuisine is based on combining staple foods, typically rice or noodles, with a soup and okazu — dishes made from fish, vegetable, tofu and the like — to add flavor to the staple food. The emphasis is on seasonal ingredients, and the presentation of food is as important as its taste.',
    image: '/images/cuisines/japanese.jpg',
    region: 'East Asia',
    flagEmoji: '🇯🇵',
    keyIngredients: ['Rice', 'Nori (Seaweed)', 'Soy Sauce', 'Mirin', 'Wasabi', 'Tofu', 'Miso'],
    commonDishes: ['Sushi', 'Ramen', 'Tempura', 'Udon', 'Sashimi', 'Miso Soup', 'Yakitori'],
    cookingTechniques: ['Raw food preparation', 'Grilling', 'Steaming', 'Simmering', 'Quick frying'],
    funFact: 'Traditional Japanese cuisine, known as washoku, is recognized by UNESCO as an Intangible Cultural Heritage.',
    suggestions: [
      {
        id: 'sushi-rolls',
        name: 'Sushi Rolls',
        description: 'Fresh fish, vegetables, and rice wrapped in seaweed.',
        image: '/images/food/sushi-rolls.jpg',
        difficulty: 'Hard',
        prepTime: '1 hour',
        tags: ['seafood', 'rice', 'lunch']
      },
      {
        id: 'ramen',
        name: 'Ramen',
        description: 'Noodles in flavorful broth with various toppings.',
        image: '/images/food/ramen.jpg',
        difficulty: 'Medium',
        prepTime: '3 hours',
        tags: ['soup', 'noodles', 'dinner']
      },
      {
        id: 'mochi',
        name: 'Mochi',
        description: 'Sweet rice cake with various fillings.',
        image: '/images/food/mochi.jpg',
        difficulty: 'Medium',
        prepTime: '45 minutes',
        tags: ['dessert', 'rice', 'sweet']
      }
    ]
  },
  // Additional cuisines would be defined here
};

// Handle image not found errors
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/images/placeholder-food.jpg';
};

const CuisineDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);

  useEffect(() => {
    // Get the cuisine ID from the URL params
    const id = params.id as string;
    const selectedCuisine = cuisinesData[id];
    
    if (selectedCuisine) {
      setCuisine(selectedCuisine);
    } else {
      // If cuisine not found, redirect to cuisines page
      router.push('/cuisines');
    }
  }, [params.id, router]);

  if (!cuisine) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">Loading cuisine information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          component={Link}
          href="/cuisines"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Cuisines
        </Button>
      </Box>

      {/* Hero section */}
      <Box 
        sx={{ 
          position: 'relative', 
          height: '300px', 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${cuisine.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: 4,
            color: 'white',
          }}
        >
          <Typography variant="h2" component="h1" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {cuisine.name} Cuisine {cuisine.flagEmoji}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '70%', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {cuisine.description}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left column: Cuisine details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Public sx={{ mr: 1 }} /> About {cuisine.name} Cuisine
            </Typography>
            <Typography paragraph>
              {cuisine.longDescription}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Restaurant sx={{ mr: 1 }} /> Key Ingredients
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {cuisine.keyIngredients.map(ingredient => (
                <Chip key={ingredient} label={ingredient} color="primary" variant="outlined" />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalDining sx={{ mr: 1 }} /> Popular Dishes
            </Typography>
            <List dense>
              {cuisine.commonDishes.map(dish => (
                <ListItem key={dish}>
                  <ListItemIcon>
                    <MenuBook fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={dish} />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Kitchen sx={{ mr: 1 }} /> Cooking Techniques
            </Typography>
            <List dense>
              {cuisine.cookingTechniques.map(technique => (
                <ListItem key={technique}>
                  <ListItemIcon>
                    <EmojiEvents fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={technique} />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ bgcolor: 'primary.light', color: 'white', p: 2, borderRadius: 2, mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">Fun Fact</Typography>
              <Typography>{cuisine.funFact}</Typography>
            </Box>
          </Paper>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Generate Your {cuisine.name} Recipe
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              href={`/generate-recipe?cuisine=${cuisine.id}`}
              sx={{ mr: 2 }}
            >
              Create Recipe Now
            </Button>
            <Button 
              variant="outlined"
              component={Link}
              href={`/meal-plan?cuisine=${cuisine.id}`}
            >
              Include in Meal Plan
            </Button>
          </Box>
        </Grid>
        
        {/* Right column: Popular dishes */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Popular {cuisine.name} Dishes
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try making these traditional recipes at home.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cuisine.suggestions.map(dish => (
                <Card key={dish.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={dish.image}
                    alt={dish.name}
                    onError={handleImageError}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {dish.description}
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" component="div">
                          <strong>Difficulty:</strong> {dish.difficulty}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" component="div">
                          <strong>Prep time:</strong> {dish.prepTime}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {dish.tags.map(tag => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ bgcolor: 'primary.light', color: 'white' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CuisineDetailPage; 
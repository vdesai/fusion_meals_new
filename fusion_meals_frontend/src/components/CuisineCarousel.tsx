'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Info } from '@mui/icons-material';
import Link from 'next/link';

interface Cuisine {
  id: string;
  name: string;
  description: string;
  image: string;
  suggestions: FoodSuggestion[];
}

interface FoodSuggestion {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
}

// Sample cuisine data - in a real app, this would come from an API
const cuisinesData: Cuisine[] = [
  {
    id: 'italian',
    name: 'Italian',
    description: 'The heart of Mediterranean cuisine with pasta, pizza, and rich flavors.',
    image: '/images/cuisines/italian.jpg',
    suggestions: [
      {
        id: 'pasta-carbonara',
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with pancetta, eggs, and Parmesan cheese.',
        image: '/images/food/pasta-carbonara.jpg',
        tags: ['pasta', 'creamy', 'dinner']
      },
      {
        id: 'margherita-pizza',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
        image: '/images/food/margherita-pizza.jpg',
        tags: ['pizza', 'vegetarian', 'dinner']
      },
      {
        id: 'tiramisu',
        name: 'Tiramisu',
        description: 'Coffee-flavored Italian dessert made with ladyfingers and mascarpone cheese.',
        image: '/images/food/tiramisu.jpg',
        tags: ['dessert', 'coffee', 'sweet']
      }
    ]
  },
  {
    id: 'japanese',
    name: 'Japanese',
    description: 'Precise, minimal, and artistic cuisine balancing flavor and tradition.',
    image: '/images/cuisines/japanese.jpg',
    suggestions: [
      {
        id: 'sushi-rolls',
        name: 'Sushi Rolls',
        description: 'Fresh fish, vegetables, and rice wrapped in seaweed.',
        image: '/images/food/sushi-rolls.jpg',
        tags: ['seafood', 'rice', 'lunch']
      },
      {
        id: 'ramen',
        name: 'Ramen',
        description: 'Noodles in flavorful broth with various toppings.',
        image: '/images/food/ramen.jpg',
        tags: ['soup', 'noodles', 'dinner']
      },
      {
        id: 'mochi',
        name: 'Mochi',
        description: 'Sweet rice cake with various fillings.',
        image: '/images/food/mochi.jpg',
        tags: ['dessert', 'rice', 'sweet']
      }
    ]
  },
  {
    id: 'mexican',
    name: 'Mexican',
    description: 'Bold flavors with chilies, fresh ingredients, and ancient traditions.',
    image: '/images/cuisines/mexican.jpg',
    suggestions: [
      {
        id: 'tacos',
        name: 'Street Tacos',
        description: 'Corn tortillas filled with seasoned meat, onions, and cilantro.',
        image: '/images/food/tacos.jpg',
        tags: ['street food', 'dinner', 'spicy']
      },
      {
        id: 'guacamole',
        name: 'Guacamole',
        description: 'Avocado-based dip with lime, onions, tomatoes, and cilantro.',
        image: '/images/food/guacamole.jpg',
        tags: ['appetizer', 'vegetarian', 'fresh']
      },
      {
        id: 'churros',
        name: 'Churros',
        description: 'Fried dough pastry dusted with cinnamon sugar.',
        image: '/images/food/churros.jpg',
        tags: ['dessert', 'sweet', 'fried']
      }
    ]
  },
  {
    id: 'indian',
    name: 'Indian',
    description: 'Rich spices and diverse regional cuisines across a vast subcontinent.',
    image: '/images/cuisines/indian.jpg',
    suggestions: [
      {
        id: 'butter-chicken',
        name: 'Butter Chicken',
        description: 'Creamy tomato curry with tender chicken pieces.',
        image: '/images/food/butter-chicken.jpg',
        tags: ['curry', 'chicken', 'dinner']
      },
      {
        id: 'samosas',
        name: 'Samosas',
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        image: '/images/food/samosas.jpg',
        tags: ['appetizer', 'fried', 'vegetarian']
      },
      {
        id: 'gulab-jamun',
        name: 'Gulab Jamun',
        description: 'Sweet milk solid balls soaked in sugar syrup.',
        image: '/images/food/gulab-jamun.jpg',
        tags: ['dessert', 'sweet', 'fried']
      }
    ]
  },
  {
    id: 'thai',
    name: 'Thai',
    description: 'Perfect harmony of spicy, sweet, sour, and salty flavors.',
    image: '/images/cuisines/thai.jpg',
    suggestions: [
      {
        id: 'pad-thai',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with eggs, vegetables, and peanuts.',
        image: '/images/food/pad-thai.jpg',
        tags: ['noodles', 'dinner', 'stir-fry']
      },
      {
        id: 'tom-yum',
        name: 'Tom Yum Soup',
        description: 'Hot and sour soup with fragrant herbs and shrimp.',
        image: '/images/food/tom-yum.jpg',
        tags: ['soup', 'spicy', 'seafood']
      },
      {
        id: 'mango-sticky-rice',
        name: 'Mango Sticky Rice',
        description: 'Sweet coconut rice with fresh mango slices.',
        image: '/images/food/mango-sticky-rice.jpg',
        tags: ['dessert', 'fruit', 'rice']
      }
    ]
  }
];

const CuisineCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCuisine, setActiveCuisine] = useState<Cuisine>(cuisinesData[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Handle image not found errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-food.jpg';
  };

  // Move to the next cuisine
  const nextCuisine = () => {
    const newIndex = (activeIndex + 1) % cuisinesData.length;
    setActiveIndex(newIndex);
    setActiveCuisine(cuisinesData[newIndex]);
  };

  // Move to the previous cuisine
  const prevCuisine = () => {
    const newIndex = (activeIndex - 1 + cuisinesData.length) % cuisinesData.length;
    setActiveIndex(newIndex);
    setActiveCuisine(cuisinesData[newIndex]);
  };

  // Auto-advance the carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextCuisine();
    }, 8000);
    
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden', my: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: theme.palette.primary.main,
        mb: 3
      }}>
        Explore Global Cuisines
      </Typography>
      
      {/* Cuisine selection tabs */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 1,
        mb: 4
      }}>
        {cuisinesData.map((cuisine, index) => (
          <Button 
            key={cuisine.id}
            variant={index === activeIndex ? "contained" : "outlined"}
            onClick={() => {
              setActiveIndex(index);
              setActiveCuisine(cuisine);
            }}
            sx={{ 
              borderRadius: '20px',
              px: 2,
              mx: 0.5,
              mb: 1
            }}
          >
            {cuisine.name}
          </Button>
        ))}
      </Box>

      {/* Main cuisine card with description */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Card sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: isMobile ? '100%' : '40%',
              height: isMobile ? 200 : 300,
              objectFit: 'cover'
            }}
            image={activeCuisine.image}
            alt={activeCuisine.name}
            onError={handleImageError}
          />
          <CardContent sx={{ 
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {activeCuisine.name} Cuisine
            </Typography>
            <Typography variant="body1" paragraph>
              {activeCuisine.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                href={`/generate-recipe?cuisine=${activeCuisine.id}`}
                sx={{ mr: 2 }}
              >
                Generate {activeCuisine.name} Recipe
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                component={Link}
                href={`/cuisines/${activeCuisine.id}`}
                startIcon={<Info />}
              >
                Learn More
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {/* Navigation arrows */}
        <IconButton 
          sx={{ 
            position: 'absolute', 
            left: 8, 
            top: '50%', 
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            zIndex: 2
          }}
          onClick={prevCuisine}
        >
          <ArrowBackIos />
        </IconButton>
        <IconButton 
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: '50%', 
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            zIndex: 2
          }}
          onClick={nextCuisine}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      {/* Food suggestions for selected cuisine */}
      <Typography variant="h5" gutterBottom>
        Popular {activeCuisine.name} Dishes
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 3,
        mt: 2
      }}>
        {activeCuisine.suggestions.map(suggestion => (
          <Card key={suggestion.id} sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
            }
          }}>
            <CardMedia
              component="img"
              height="180"
              image={suggestion.image}
              alt={suggestion.name}
              onError={handleImageError}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {suggestion.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {suggestion.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                {suggestion.tags.map(tag => (
                  <Box 
                    key={tag} 
                    sx={{ 
                      bgcolor: 'primary.light', 
                      color: 'white',
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* View more link */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          component={Link}
          href="/cuisines"
          sx={{ borderRadius: '50px', px: 4 }}
        >
          Explore All Cuisines
        </Button>
      </Box>
    </Box>
  );
};

export default CuisineCarousel; 
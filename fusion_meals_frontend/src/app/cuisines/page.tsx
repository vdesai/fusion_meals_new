'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';

// We'll reuse the same cuisine data structure defined in our CuisineCarousel
interface Cuisine {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Sample cuisine data - in a real app, this would come from an API
const cuisinesData: Cuisine[] = [
  {
    id: 'italian',
    name: 'Italian',
    description: 'The heart of Mediterranean cuisine with pasta, pizza, and rich flavors.',
    image: '/images/cuisines/italian.jpg',
  },
  {
    id: 'japanese',
    name: 'Japanese',
    description: 'Precise, minimal, and artistic cuisine balancing flavor and tradition.',
    image: '/images/cuisines/japanese.jpg',
  },
  {
    id: 'mexican',
    name: 'Mexican',
    description: 'Bold flavors with chilies, fresh ingredients, and ancient traditions.',
    image: '/images/cuisines/mexican.jpg',
  },
  {
    id: 'indian',
    name: 'Indian',
    description: 'Rich spices and diverse regional cuisines across a vast subcontinent.',
    image: '/images/cuisines/indian.jpg',
  },
  {
    id: 'thai',
    name: 'Thai',
    description: 'Perfect harmony of spicy, sweet, sour, and salty flavors.',
    image: '/images/cuisines/thai.jpg',
  },
  {
    id: 'french',
    name: 'French',
    description: 'Refined, elegant cuisine built on technique and quality ingredients.',
    image: '/images/cuisines/french.jpg',
  },
  {
    id: 'chinese',
    name: 'Chinese',
    description: 'Diverse regional cuisines with a focus on balance, texture, and flavor.',
    image: '/images/cuisines/chinese.jpg',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Healthy, vibrant dishes from countries bordering the Mediterranean Sea.',
    image: '/images/cuisines/mediterranean.jpg',
  },
  {
    id: 'middle-eastern',
    name: 'Middle Eastern',
    description: 'Aromatic spices, hearty grains, and flavorful meats define this cuisine.',
    image: '/images/cuisines/middle-eastern.jpg',
  },
  {
    id: 'american',
    name: 'American',
    description: 'Fusion of immigrant traditions, regional styles, and comfort food classics.',
    image: '/images/cuisines/american.jpg',
  },
  {
    id: 'korean',
    name: 'Korean',
    description: 'Bold, spicy flavors with fermented elements and communal dining traditions.',
    image: '/images/cuisines/korean.jpg',
  },
  {
    id: 'vietnamese',
    name: 'Vietnamese',
    description: 'Fresh herbs, light preparations, and a perfect balance of flavors.',
    image: '/images/cuisines/vietnamese.jpg',
  }
];

// Handle image not found errors
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/images/placeholder-food.jpg';
};

const CuisinesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Home
        </Button>
        <Typography variant="h3" component="h1" fontWeight="bold">
          Explore Global Cuisines
        </Typography>
      </Box>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Discover culinary traditions from around the world and generate recipes inspired by these cuisines.
      </Typography>

      <Grid container spacing={3}>
        {cuisinesData.map((cuisine) => (
          <Grid item xs={12} sm={6} md={4} key={cuisine.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={cuisine.image}
                alt={cuisine.name}
                onError={handleImageError}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {cuisine.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {cuisine.description}
                </Typography>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    component={Link}
                    href={`/generate-recipe?cuisine=${cuisine.id}`}
                    sx={{ mb: 1 }}
                  >
                    Generate Recipe
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    component={Link}
                    href={`/cuisines/${cuisine.id}`}
                  >
                    Learn More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CuisinesPage; 
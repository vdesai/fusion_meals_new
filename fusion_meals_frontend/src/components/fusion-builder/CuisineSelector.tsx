'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  useTheme 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CuisineSelectorProps {
  selectedCuisines: string[];
  setSelectedCuisines: React.Dispatch<React.SetStateAction<string[]>>;
}

// Sample cuisine data for selection
const cuisines = [
  {
    id: 'italian',
    name: 'Italian',
    description: 'Rich pasta dishes, pizza, risotto, and Mediterranean flavors',
    image: '/images/cuisines/italian.jpg',
    keyFlavors: ['Basil', 'Tomato', 'Olive Oil', 'Parmesan']
  },
  {
    id: 'japanese',
    name: 'Japanese',
    description: 'Precise, minimal, with emphasis on seasonality and umami',
    image: '/images/cuisines/japanese.jpg',
    keyFlavors: ['Soy', 'Dashi', 'Mirin', 'Wasabi']
  },
  {
    id: 'mexican',
    name: 'Mexican',
    description: 'Bold flavors with chilies, corn, beans, and vibrant spices',
    image: '/images/cuisines/mexican.jpg',
    keyFlavors: ['Lime', 'Cilantro', 'Chili', 'Cumin']
  },
  {
    id: 'indian',
    name: 'Indian',
    description: 'Complex spice blends, aromatic curries, and regional diversity',
    image: '/images/cuisines/indian.jpg',
    keyFlavors: ['Garam Masala', 'Cardamom', 'Turmeric', 'Ghee']
  },
  {
    id: 'thai',
    name: 'Thai',
    description: 'Harmony of sweet, sour, salty, and spicy in every dish',
    image: '/images/cuisines/thai.jpg',
    keyFlavors: ['Lemongrass', 'Fish Sauce', 'Coconut', 'Chilies']
  },
  {
    id: 'french',
    name: 'French',
    description: 'Refined techniques, rich sauces, and emphasis on quality ingredients',
    image: '/images/cuisines/french.jpg',
    keyFlavors: ['Butter', 'Wine', 'Herbs', 'Cream']
  },
  {
    id: 'chinese',
    name: 'Chinese',
    description: 'Diverse styles from different regions, with balance of flavors and textures',
    image: '/images/cuisines/chinese.jpg',
    keyFlavors: ['Soy Sauce', 'Ginger', 'Sesame', 'Five Spice']
  },
  {
    id: 'middle-eastern',
    name: 'Middle Eastern',
    description: 'Aromatic spices, mezze platters, and grilled meats',
    image: '/images/cuisines/middle-eastern.jpg',
    keyFlavors: ['Tahini', 'Za\'atar', 'Sumac', 'Mint']
  }
];

// Handle image errors
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/images/placeholder-food.jpg';
};

const CuisineSelector: React.FC<CuisineSelectorProps> = ({ 
  selectedCuisines, 
  setSelectedCuisines 
}) => {
  const theme = useTheme();

  const handleCuisineClick = (cuisineId: string) => {
    if (selectedCuisines.includes(cuisineId)) {
      setSelectedCuisines(selectedCuisines.filter(id => id !== cuisineId));
    } else if (selectedCuisines.length < 3) {
      // Limit to 3 selections
      setSelectedCuisines([...selectedCuisines, cuisineId]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select 2-3 cuisines to combine
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose cuisines that you'd like to blend together. We recommend picking cuisines with complementary flavors.
      </Typography>
      
      <Grid container spacing={3}>
        {cuisines.map((cuisine) => {
          const isSelected = selectedCuisines.includes(cuisine.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={cuisine.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.08)',
                  border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => handleCuisineClick(cuisine.id)}
              >
                {isSelected && (
                  <CheckCircleIcon 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      color: theme.palette.primary.main,
                      fontSize: 28,
                      zIndex: 1
                    }} 
                  />
                )}
                <CardMedia
                  component="img"
                  height="140"
                  image={cuisine.image}
                  alt={cuisine.name}
                  onError={handleImageError}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {cuisine.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {cuisine.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {cuisine.keyFlavors.map(flavor => (
                      <Chip
                        key={flavor}
                        label={flavor}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
        <Typography variant="subtitle1">
          Selected cuisines: {selectedCuisines.length === 0 ? 'None' : selectedCuisines.map(id => 
            cuisines.find(c => c.id === id)?.name
          ).join(' + ')}
        </Typography>
      </Box>
    </Box>
  );
};

export default CuisineSelector; 
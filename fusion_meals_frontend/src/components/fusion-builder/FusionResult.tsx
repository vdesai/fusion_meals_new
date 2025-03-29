'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import { 
  AccessTime, 
  Restaurant, 
  FreeBreakfast, 
  LocalDining,
  Check, 
  Info, 
  Print, 
  Share, 
  BookmarkBorder,
  Scale
} from '@mui/icons-material';

interface FusionResultProps {
  recipe: {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: string;
    servings: number;
    difficultyLevel: string;
    nutritionalInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    cuisineFusion: {
      primary: string;
      secondary: string;
      techniques: string[];
      flavorProfile: string;
    };
    image: string;
  };
}

// Handle image not found errors
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/images/placeholder-food.jpg';
};

const FusionResult: React.FC<FusionResultProps> = ({ recipe }) => {
  // Calculate nutrition distribution for pie chart
  const totalMacros = recipe.nutritionalInfo.protein + recipe.nutritionalInfo.carbs + recipe.nutritionalInfo.fat;
  
  const proteinPercent = Math.round((recipe.nutritionalInfo.protein / totalMacros) * 100);
  const carbsPercent = Math.round((recipe.nutritionalInfo.carbs / totalMacros) * 100);
  const fatPercent = Math.round((recipe.nutritionalInfo.fat / totalMacros) * 100);
  
  // Create a SVG pie chart
  const createPieChart = () => {
    // Start angles for each segment
    const proteinStart = 0;
    const carbsStart = (proteinPercent / 100) * 360;
    const fatStart = ((proteinPercent + carbsPercent) / 100) * 360;
    
    // Create SVG arcs
    const createArc = (startAngle: number, endAngle: number) => {
      // Convert angles to radians
      const start = (startAngle - 90) * (Math.PI / 180);
      const end = (endAngle - 90) * (Math.PI / 180);
      
      const radius = 50;
      const centerX = 60;
      const centerY = 60;
      
      // Calculate start and end points
      const startX = centerX + radius * Math.cos(start);
      const startY = centerY + radius * Math.sin(start);
      const endX = centerX + radius * Math.cos(end);
      const endY = centerY + radius * Math.sin(end);
      
      // Determine large arc flag
      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
      
      return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
    };
    
    return (
      <>
        <path d={createArc(proteinStart, carbsStart)} fill="#4CAF50" />
        <path d={createArc(carbsStart, fatStart)} fill="#2196F3" />
        <path d={createArc(fatStart, 360)} fill="#FFC107" />
      </>
    );
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {recipe.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            {recipe.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              icon={<Restaurant />} 
              label={`${recipe.servings} servings`} 
              variant="outlined" 
            />
            <Chip 
              icon={<AccessTime />} 
              label={recipe.cookingTime} 
              variant="outlined" 
            />
            <Chip 
              icon={<Info />} 
              label={recipe.difficultyLevel} 
              variant="outlined" 
            />
            <Chip 
              icon={<LocalDining />} 
              label={`${recipe.cuisineFusion.primary} + ${recipe.cuisineFusion.secondary}`} 
              color="primary" 
            />
          </Box>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Restaurant sx={{ mr: 1 }} fontSize="small" /> 
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} dense sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Check color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Nutritional Information
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                    <svg viewBox="0 0 120 120">
                      {createPieChart()}
                      <text x="60" y="50" fontSize="12" textAnchor="middle">
                        {recipe.nutritionalInfo.calories}
                      </text>
                      <text x="60" y="70" fontSize="10" textAnchor="middle">
                        calories
                      </text>
                    </svg>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ bgcolor: '#4CAF50', width: 16, height: 16, mr: 1, borderRadius: '50%' }} />
                    <Typography variant="body2">Protein: {recipe.nutritionalInfo.protein}g ({proteinPercent}%)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ bgcolor: '#2196F3', width: 16, height: 16, mr: 1, borderRadius: '50%' }} />
                    <Typography variant="body2">Carbs: {recipe.nutritionalInfo.carbs}g ({carbsPercent}%)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: '#FFC107', width: 16, height: 16, mr: 1, borderRadius: '50%' }} />
                    <Typography variant="body2">Fat: {recipe.nutritionalInfo.fat}g ({fatPercent}%)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <Box 
              component="img"
              sx={{ 
                width: '100%', 
                height: 300, 
                objectFit: 'cover', 
                borderRadius: 2,
                mb: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              src={recipe.image}
              alt={recipe.name}
              onError={handleImageError}
            />
            
            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Fusion Profile
              </Typography>
              <Typography variant="body2">
                This recipe blends <strong>{recipe.cuisineFusion.primary}</strong> and <strong>{recipe.cuisineFusion.secondary}</strong> cuisines
                using {recipe.cuisineFusion.techniques.join(' and ')}. The flavor profile is {recipe.cuisineFusion.flavorProfile}.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          <List>
            {recipe.instructions.map((step, index) => (
              <ListItem key={index} alignItems="flex-start" sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 42, mt: 0 }}>
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
          <Button startIcon={<Print />} variant="outlined">
            Print Recipe
          </Button>
          <Button startIcon={<Share />} variant="outlined">
            Share
          </Button>
          <Button startIcon={<BookmarkBorder />} variant="outlined">
            Save Recipe
          </Button>
          <Button startIcon={<Scale />} variant="outlined">
            Adjust Servings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FusionResult; 
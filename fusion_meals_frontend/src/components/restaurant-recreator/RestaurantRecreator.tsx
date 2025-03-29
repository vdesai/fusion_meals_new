'use client';

import React, { useState } from 'react';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  Search,
  Restaurant,
  FitnessCenter,
  MonetizationOn,
  Timer,
  Favorite,
  ShoppingCart,
  Check,
  TrendingDown,
  LocalDining
} from '@mui/icons-material';

// Sample data structure
interface DishTransformation {
  originalName: string;
  restaurantName: string;
  estimatedCalories: number;
  estimatedCost: number;
  prepTime: number;
  cookTime: number;
  healthierVersion: {
    name: string;
    description: string;
    calories: number;
    costSavings: number;
    healthBenefits: string[];
    mainSubstitutions: {original: string, healthier: string}[];
  };
  budgetVersion: {
    name: string;
    description: string;
    costSavings: number;
    totalCost: number;
    valueIngredients: string[];
  };
  quickVersion: {
    name: string;
    description: string;
    totalTime: number;
    timeSavings: number;
    shortcuts: string[];
  };
  image: string;
}

// Sample data for demonstration
const sampleTransformations: DishTransformation[] = [
  {
    originalName: "Creamy Fettuccine Alfredo",
    restaurantName: "Olive Garden",
    estimatedCalories: 1200,
    estimatedCost: 18.99,
    prepTime: 20,
    cookTime: 15,
    healthierVersion: {
      name: "Greek Yogurt Fettuccine Alfredo",
      description: "A lighter take on the classic using Greek yogurt instead of heavy cream, whole wheat pasta, and added vegetables for nutrients.",
      calories: 450,
      costSavings: 12.50,
      healthBenefits: ["62% fewer calories", "Lower saturated fat", "Higher protein content", "Added fiber"],
      mainSubstitutions: [
        {original: "Heavy cream", healthier: "Greek yogurt"},
        {original: "Regular pasta", healthier: "Whole wheat pasta"},
        {original: "Extra butter", healthier: "Olive oil (reduced amount)"},
        {original: "No vegetables", healthier: "Added broccoli and peas"}
      ]
    },
    budgetVersion: {
      name: "Budget-Friendly Alfredo",
      description: "Use more affordable ingredients while maintaining creamy texture and flavor.",
      costSavings: 15.00,
      totalCost: 3.99,
      valueIngredients: ["Use milk + flour instead of cream", "Add small amount of cream cheese", "Bulk up with inexpensive pasta", "Add frozen vegetables for volume"]
    },
    quickVersion: {
      name: "15-Minute Alfredo",
      description: "Streamlined version that doesn't sacrifice flavor but cuts prep and cooking time.",
      totalTime: 15,
      timeSavings: 20,
      shortcuts: ["Use pre-grated Parmesan", "Skip reducing the sauce", "Cook pasta and sauce simultaneously", "Use microwave-steamed vegetables"]
    },
    image: "/images/restaurant-dishes/fettuccine-alfredo.jpg"
  },
  {
    originalName: "Double Cheeseburger with Fries",
    restaurantName: "Fast Food Chain",
    estimatedCalories: 1450,
    estimatedCost: 12.99,
    prepTime: 15,
    cookTime: 15,
    healthierVersion: {
      name: "Lean Turkey Burger with Sweet Potato Wedges",
      description: "All the flavor with leaner meat, whole grain bun, and nutrient-rich sweet potato instead of fries.",
      calories: 650,
      costSavings: 7.00,
      healthBenefits: ["55% fewer calories", "Lower sodium", "More fiber", "More nutrients from sweet potatoes"],
      mainSubstitutions: [
        {original: "Beef patty", healthier: "Lean turkey patty"},
        {original: "White flour bun", healthier: "Whole grain bun"},
        {original: "Deep-fried potatoes", healthier: "Baked sweet potato wedges"},
        {original: "American cheese", healthier: "Thin slice of real cheddar"}
      ]
    },
    budgetVersion: {
      name: "Homestyle Budget Burger",
      description: "Create a delicious burger at a fraction of the restaurant cost.",
      costSavings: 9.00,
      totalCost: 3.99,
      valueIngredients: ["Make larger, thinner patties with less meat", "Make your own burger seasoning", "Bake fries instead of frying", "Buy buns on sale and freeze"]
    },
    quickVersion: {
      name: "Express Burger Meal",
      description: "Streamlined burger preparation that's ready in no time.",
      totalTime: 15,
      timeSavings: 15,
      shortcuts: ["Use pre-formed patties", "Microwave + broil cooking method", "One-pan cooking for meat and vegetables", "Pre-cut vegetables"]
    },
    image: "/images/restaurant-dishes/cheeseburger.jpg"
  }
];

// Props interface for the component
interface RestaurantRecreatorProps {
  // Add props here if needed in the future
}

const RestaurantRecreator: React.FC<RestaurantRecreatorProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedDish, setSelectedDish] = useState<DishTransformation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // For demonstration, we'll use the sample data
  // In a real implementation, this would call an API
  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleDishSelect = (dish: DishTransformation) => {
    setSelectedDish(dish);
  };
  
  const handleBackToResults = () => {
    setSelectedDish(null);
  };
  
  return (
    <Box>
      {/* Search Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Find Your Restaurant Favorite
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter a restaurant dish you&apos;d like to recreate at home with healthier ingredients, lower cost, or faster preparation.
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search for a restaurant dish (e.g., Olive Garden Fettuccine Alfredo)"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <Search />}
              onClick={handleSearch}
              disabled={isLoading || searchQuery.trim() === ''}
              sx={{ py: 1.5 }}
            >
              {isLoading ? 'Searching...' : 'Find Homemade Version'}
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2">Popular searches:</Typography>
          <Chip 
            label="Olive Garden Alfredo" 
            size="small" 
            onClick={() => setSearchQuery('Olive Garden Alfredo')}
            clickable
          />
          <Chip 
            label="Chipotle Burrito Bowl" 
            size="small" 
            onClick={() => setSearchQuery('Chipotle Burrito Bowl')}
            clickable
          />
          <Chip 
            label="Cheesecake Factory Pasta" 
            size="small" 
            onClick={() => setSearchQuery('Cheesecake Factory Pasta')}
            clickable
          />
        </Box>
      </Paper>
      
      {/* Results Display */}
      {showResults && !selectedDish && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Restaurant Dishes Found
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Select a dish to see healthier, budget-friendly, and quicker versions:
          </Typography>
          
          <Grid container spacing={3}>
            {sampleTransformations.map((dish) => (
              <Grid item key={dish.originalName} xs={12} md={6} lg={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleDishSelect(dish)}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={dish.image}
                    alt={dish.originalName}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {dish.originalName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {dish.restaurantName}
                    </Typography>
                    
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid item xs={4}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Calories
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {dish.estimatedCalories}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Cost
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ${dish.estimatedCost.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {dish.prepTime + dish.cookTime} min
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip 
                        icon={<FitnessCenter fontSize="small" />} 
                        label={`-${Math.round((dish.estimatedCalories - dish.healthierVersion.calories) / dish.estimatedCalories * 100)}% cal`}
                        size="small"
                        color="success"
                      />
                      <Chip 
                        icon={<MonetizationOn fontSize="small" />} 
                        label={`Save $${dish.budgetVersion.costSavings.toFixed(0)}`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Detailed Dish View */}
      {selectedDish && (
        <Box>
          <Button 
            variant="text" 
            startIcon={<Restaurant />}
            onClick={handleBackToResults}
            sx={{ mb: 2 }}
          >
            Back to all dishes
          </Button>
          
          <Paper elevation={3} sx={{ p: 0, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Grid container>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: { xs: 200, md: '100%' },
                    position: 'relative',
                    backgroundImage: `url(${selectedDish.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    p: 2,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white'
                  }}>
                    <Typography variant="h6">{selectedDish.originalName}</Typography>
                    <Typography variant="body2">{selectedDish.restaurantName}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Restaurant vs. Homemade
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Restaurant Price
                        </Typography>
                        <Typography variant="h6" color="error">
                          ${selectedDish.estimatedCost.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Restaurant Calories
                        </Typography>
                        <Typography variant="h6" color="error">
                          {selectedDish.estimatedCalories}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Savings Potential
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          Up to ${selectedDish.budgetVersion.costSavings.toFixed(0)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Transformation Tabs */}
          <Box sx={{ mb: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab 
                icon={<Favorite />} 
                label="Healthier Version" 
                iconPosition="start"
              />
              <Tab 
                icon={<MonetizationOn />} 
                label="Budget Version" 
                iconPosition="start"
              />
              <Tab 
                icon={<Timer />} 
                label="Quick Version" 
                iconPosition="start"
              />
            </Tabs>
            
            {/* Health Version */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" color="success.main" gutterBottom>
                  {selectedDish.healthierVersion.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedDish.healthierVersion.description}
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Health Benefits
                    </Typography>
                    <List>
                      {selectedDish.healthierVersion.healthBenefits.map((benefit, index) => (
                        <ListItem key={index} dense>
                          <ListItemIcon>
                            <Check color="success" />
                          </ListItemIcon>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Ingredient Swaps
                    </Typography>
                    
                    {selectedDish.healthierVersion.mainSubstitutions.map((swap, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1, color: 'error.main' }}>
                          {swap.original}
                        </Typography>
                        <TrendingDown sx={{ mx: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ flex: 1, color: 'success.main', fontWeight: 'bold' }}>
                          {swap.healthier}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="success"
                    startIcon={<LocalDining />}
                    size="large"
                  >
                    Get Full Healthy Recipe
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Budget Version */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" color="primary" gutterBottom>
                  {selectedDish.budgetVersion.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedDish.budgetVersion.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white', p: 2, borderRadius: 2 }}>
                      <Typography variant="overline">Restaurant Cost</Typography>
                      <Typography variant="h5">${selectedDish.estimatedCost.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white', p: 2, borderRadius: 2 }}>
                      <Typography variant="overline">Your Cost</Typography>
                      <Typography variant="h5">${selectedDish.budgetVersion.totalCost.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white', p: 2, borderRadius: 2 }}>
                      <Typography variant="overline">Annual Savings (once weekly)</Typography>
                      <Typography variant="h5">${(selectedDish.budgetVersion.costSavings * 52).toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" gutterBottom>
                  Smart Budget Swaps
                </Typography>
                <List>
                  {selectedDish.budgetVersion.valueIngredients.map((tip, index) => (
                    <ListItem key={index} dense>
                      <ListItemIcon>
                        <MonetizationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<ShoppingCart />}
                    size="large"
                  >
                    Get Budget Recipe & Shopping List
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Quick Version */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" color="info.main" gutterBottom>
                  {selectedDish.quickVersion.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedDish.quickVersion.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white', p: 2, borderRadius: 2 }}>
                      <Typography variant="overline">Restaurant Wait</Typography>
                      <Typography variant="h5">30-45 min</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white', p: 2, borderRadius: 2 }}>
                      <Typography variant="overline">Your Total Time</Typography>
                      <Typography variant="h5">{selectedDish.quickVersion.totalTime} min</Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" gutterBottom>
                  Time-Saving Techniques
                </Typography>
                <List>
                  {selectedDish.quickVersion.shortcuts.map((shortcut, index) => (
                    <ListItem key={index} dense>
                      <ListItemIcon>
                        <Timer color="info" />
                      </ListItemIcon>
                      <ListItemText primary={shortcut} />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="info"
                    startIcon={<Timer />}
                    size="large"
                  >
                    Get Quick Recipe
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RestaurantRecreator; 
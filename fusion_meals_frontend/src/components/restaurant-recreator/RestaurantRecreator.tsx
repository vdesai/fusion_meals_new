'use client';

import React, { useState, useEffect } from 'react';
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
import { DishTransformation } from '../../types/restaurant';
import { restaurantService } from '../../services/restaurantService';
import { fallbackDishes } from '../../services/fallbackService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

const RestaurantRecreator: React.FC = () => {
  // Log fallback dishes on component initialization to check if they're available
  console.log('RestaurantRecreator init - Available fallback dishes:', fallbackDishes);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedDish, setSelectedDish] = useState<DishTransformation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<DishTransformation[]>([]);
  const [popularDishes, setPopularDishes] = useState<DishTransformation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch popular dishes on component mount
  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const dishes = await restaurantService.getPopularDishes();
        console.log('Fetched popular dishes:', dishes);
        setPopularDishes(dishes);
      } catch (err) {
        console.error('Error fetching popular dishes:', err);
        setError('Unable to load popular dishes. Please try again later.');
      }
    };
    
    fetchPopularDishes();
  }, []);
  
  // Handle search using the API
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching for:', searchQuery);
      
      // Debug - Directly try fallback data first to see what's available
      console.log('DEBUG: Attempting to fetch all fallback dishes');
      const allFallbackDishes = await restaurantService.searchDishes('');
      console.log('DEBUG: All available fallback dishes:', allFallbackDishes);
      
      if (!allFallbackDishes || allFallbackDishes.length === 0) {
        console.error('DEBUG: No fallback dishes available!');
        setError('No sample dishes available. Please check the console for errors.');
        setIsLoading(false);
        return;
      }
      
      // Now do the actual search
      const results = await restaurantService.searchDishes(searchQuery);
      console.log('Search results from API:', results);
      
      if (results && results.length > 0) {
        setSearchResults(results);
        setShowResults(true);
      } else {
        // If no results, try a more permissive search by splitting the query manually
        console.log('No direct results, trying with individual terms');
        
        const terms = searchQuery.toLowerCase().split(' ');
        console.log('Search terms:', terms);
        
        // Manually filter the fallback dishes
        const filteredResults = allFallbackDishes.filter(dish => {
          const dishFullText = `${dish.restaurantName} ${dish.originalName}`.toLowerCase();
          console.log(`Checking "${dishFullText}" against search terms`);
          return terms.some(term => {
            const match = term.length > 2 && dishFullText.includes(term);
            if (match) console.log(`Match found for term: "${term}" in dish: "${dishFullText}"`);
            return match;
          });
        });
        
        console.log('Manually filtered results:', filteredResults);
        
        // If still no results, just show all dishes
        if (filteredResults.length === 0) {
          console.log('No matches found, showing all dishes instead');
          setSearchResults(allFallbackDishes);
        } else {
          setSearchResults(filteredResults);
        }
        
        setShowResults(true);
      }
    } catch (err) {
      console.error('Error searching dishes:', err);
      setError('An error occurred while searching. Using sample data instead.');
      
      // Try to get fallback dishes from the service
      try {
        const fallbackDishesFromService = await restaurantService.searchDishes('');
        console.log('Fallback dishes in error handler:', fallbackDishesFromService);
        
        if (fallbackDishesFromService && fallbackDishesFromService.length > 0) {
          setSearchResults(fallbackDishesFromService);
        } else {
          // Last resort - use directly imported fallback dishes
          console.log('Using directly imported fallback dishes as last resort');
          setSearchResults(fallbackDishes);
        }
      } catch (fallbackErr) {
        // Ultimate fallback - use the directly imported fallback dishes
        console.error('Failed to get even fallback dishes from service:', fallbackErr);
        console.log('Using directly imported fallback dishes as final resort');
        setSearchResults(fallbackDishes);
      }
      
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleDishSelect = async (dishId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dish = await restaurantService.getDishById(dishId);
      if (dish) {
        setSelectedDish(dish);
      } else {
        setError('Dish not found. Please try another selection.');
      }
    } catch (err) {
      console.error('Error fetching dish details:', err);
      setError('Unable to load dish details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToResults = () => {
    setSelectedDish(null);
  };

  const handleSaveDish = async (dishId: string) => {
    try {
      setSuccessMessage(null);
      setError(null);
      
      await restaurantService.saveDishTransformation(dishId);
      setSuccessMessage('Recipe saved successfully! You can access it from your profile.');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Error saving dish:', err);
      setError('Unable to save dish. Please try again.');
    }
  };
  
  const getImageUrl = (path: string) => {
    // Default image to use if the requested image is not found
    const defaultImage = '/images/restaurant-dishes/default-dish.jpg';
    
    // Check if path is valid
    if (!path || path.trim() === '') {
      return defaultImage;
    }
    
    return path;
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
        
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
          {USE_MOCK_DATA 
            ? "Using sample data (mock mode)" 
            : `Connected to API: ${API_URL}`
          }
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
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        {successMessage && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2">Popular searches:</Typography>
          {popularDishes.slice(0, 3).map((dish) => (
            <Chip 
              key={dish.id}
              label={`${dish.restaurantName} ${dish.originalName}`}
              size="small" 
              onClick={() => setSearchQuery(`${dish.restaurantName} ${dish.originalName}`)}
              clickable
            />
          ))}
          {popularDishes.length === 0 && !isLoading && (
            <>
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
            </>
          )}
        </Box>
      </Paper>
      
      {/* Results Display */}
      {showResults && !selectedDish && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Restaurant Dishes Found
          </Typography>
          
          {searchResults.length === 0 ? (
            <Typography variant="body1">
              No dishes found matching your search. Please try another query.
            </Typography>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select a dish to see healthier, budget-friendly, and quicker versions:
              </Typography>
              
              <Grid container spacing={3}>
                {searchResults.map((dish) => (
                  <Grid item key={dish.id} xs={12} md={6} lg={4}>
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
                      onClick={() => handleDishSelect(dish.id)}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={getImageUrl(dish.image)}
                        alt={dish.originalName}
                        sx={{ objectFit: 'cover' }}
                        onError={(e) => {
                          // If image fails to load, replace with default
                          (e.target as HTMLImageElement).src = '/images/restaurant-dishes/default-dish.jpg';
                        }}
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
            </>
          )}
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
                    backgroundImage: `url(${getImageUrl(selectedDish.image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'grey.300', // Add background color as fallback
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
                    onClick={() => handleSaveDish(selectedDish.id)}
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
                    onClick={() => handleSaveDish(selectedDish.id)}
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
                    onClick={() => handleSaveDish(selectedDish.id)}
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
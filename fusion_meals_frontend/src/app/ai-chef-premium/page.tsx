'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Tab, Tabs, Grid, Paper, Chip, CircularProgress, Alert, Divider, Stack, IconButton, CardActions } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Interface for the request types
interface AIChefRequest {
  request_type: 'meal_plan' | 'cooking_guidance' | 'ingredient_sourcing' | 'recipe_curation' | 'student_meals';
  recipe_text?: string;
  occasion?: string;
  timeframe?: string;
  budget_level?: string;
  specific_ingredient?: string;
  cuisine_type?: string;
  cooking_method?: string;
  detailed_instructions: boolean;
  video_instructions: boolean;
  kitchen_equipment?: string;
  cooking_skill?: string;
  prep_time_limit?: string;
  dietary_preference?: string;
}

// Interface for the premium content response
interface PremiumContent {
  [key: string]: unknown;
}

interface AIChefResponse {
  premium_content: PremiumContent;
  user_subscription: {
    level: string;
    expiry_date: string;
  };
  request_remaining: number;
  suggestions: string[];
}

// Request options interfaces
interface MealPlanOptions {
  timeframe: string;
  occasion: string;
  budget_level: string;
}

interface CookingGuidanceOptions {
  recipe_text: string;
  cooking_method: string;
  video_instructions: boolean;
}

interface IngredientSourcingOptions {
  specific_ingredient: string;
  recipe_text: string;
}

interface RecipeCurationOptions {
  cuisine_type: string;
  occasion: string;
}

// Add StudentMealsOptions interface
interface StudentMealsOptions {
  budget_level: string;
  prep_time_limit: string;
  kitchen_equipment: string;
  cooking_skill: string;
  dietary_preference: string;
}

// Interfaces for meal plan content structure
interface MealPlanDay {
  day: string;
  breakfast: { name: string; description: string; time_to_prepare: string; calories: string };
  lunch: { name: string; description: string; time_to_prepare: string; calories: string };
  dinner: { name: string; description: string; time_to_prepare: string; calories: string; wine_pairing: string };
  snacks: Array<{ name: string; description: string; calories: string }>;
}

interface MealPlanContent {
  meal_plan: {
    days: MealPlanDay[];
  };
  grocery_list: Record<string, string[]>;
  meal_prep_guide: {
    day: string;
    instructions: string[];
    storage_tips: string[];
  };
  nutrition_summary: {
    average_daily_calories: string;
    protein_ratio: string;
    carb_ratio: string;
    fat_ratio: string;
    daily_macros: {
      calories_breakdown: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snacks: string;
      };
      protein: {
        grams: string;
        sources: string[];
      };
      carbohydrates: {
        grams: string;
        sources: string[];
      };
      fats: {
        grams: string;
        sources: string[];
      };
      fiber: {
        grams: string;
        sources: string[];
      };
    };
    micronutrients: {
      vitamin_a: string;
      vitamin_c: string;
      calcium: string;
      iron: string;
    };
  };
  estimated_total_cost: string;
}

export default function AIChefPremium() {
  // State for handling the form and responses
  const [requestType, setRequestType] = useState<'meal_plan' | 'cooking_guidance' | 'ingredient_sourcing' | 'recipe_curation' | 'student_meals'>('meal_plan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<boolean>(false);
  const [resultTabs, setResultTabs] = useState(0);
  const [copiedTexts, setCopiedTexts] = useState<{[key: string]: boolean}>({});
  
  // State for request options
  const [mealPlanOptions, setMealPlanOptions] = useState<MealPlanOptions>({
    timeframe: 'week',
    occasion: '',
    budget_level: 'moderate',
  });
  
  const [cookingGuidanceOptions, setCookingGuidanceOptions] = useState<CookingGuidanceOptions>({
    recipe_text: '',
    cooking_method: '',
    video_instructions: false,
  });
  
  const [ingredientSourcingOptions, setIngredientSourcingOptions] = useState<IngredientSourcingOptions>({
    specific_ingredient: '',
    recipe_text: '',
  });
  
  const [recipeCurationOptions, setRecipeCurationOptions] = useState<RecipeCurationOptions>({
    cuisine_type: '',
    occasion: '',
  });

  // New state for student meals options
  const [studentMealsOptions, setStudentMealsOptions] = useState<StudentMealsOptions>({
    budget_level: 'budget',
    prep_time_limit: '15_minutes',
    kitchen_equipment: 'minimal',
    cooking_skill: 'beginner',
    dietary_preference: '',
  });
  
  // Response state
  const [response, setResponse] = useState<AIChefResponse | null>(null);
  
  // Handle form input changes based on request type
  const handleMealPlanOptionsChange = (prop: keyof MealPlanOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setMealPlanOptions({ ...mealPlanOptions, [prop]: event.target.value });
  };
  
  const handleCookingGuidanceOptionsChange = (prop: keyof CookingGuidanceOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (prop === 'video_instructions') {
      setCookingGuidanceOptions({ ...cookingGuidanceOptions, [prop]: event.target.checked });
    } else {
      setCookingGuidanceOptions({ ...cookingGuidanceOptions, [prop]: event.target.value });
    }
  };
  
  const handleIngredientSourcingOptionsChange = (prop: keyof IngredientSourcingOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setIngredientSourcingOptions({ ...ingredientSourcingOptions, [prop]: event.target.value });
  };
  
  const handleRecipeCurationOptionsChange = (prop: keyof RecipeCurationOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeCurationOptions({ ...recipeCurationOptions, [prop]: event.target.value });
  };
  
  // Add handler for student meals options
  const handleStudentMealsOptionsChange = (prop: keyof StudentMealsOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentMealsOptions({ ...studentMealsOptions, [prop]: event.target.value });
  };
  
  // Handle request type change
  const handleRequestTypeChange = (event: React.SyntheticEvent, newValue: 'meal_plan' | 'cooking_guidance' | 'ingredient_sourcing' | 'recipe_curation' | 'student_meals') => {
    setRequestType(newValue);
  };
  
  // Handle result tabs change
  const handleResultTabsChange = (event: React.SyntheticEvent, newValue: number) => {
    setResultTabs(newValue);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSubscriptionError(false);
    setCopiedTexts({});
    
    console.log("Starting AI Chef Premium request...");

    try {
      // Prepare request object based on request type
      let requestObj: AIChefRequest = {
        request_type: requestType,
        detailed_instructions: true,
        video_instructions: false,
      };
      
      // Add options specific to the request type
      switch (requestType) {
        case 'meal_plan':
          requestObj = { ...requestObj, ...mealPlanOptions };
          break;
        case 'cooking_guidance':
          requestObj = { ...requestObj, ...cookingGuidanceOptions };
          break;
        case 'ingredient_sourcing':
          requestObj = { ...requestObj, ...ingredientSourcingOptions };
          break;
        case 'recipe_curation':
          requestObj = { ...requestObj, ...recipeCurationOptions };
          console.log(`Recipe Curation - Selected cuisine: "${recipeCurationOptions.cuisine_type}"`);
          break;
        case 'student_meals':
          requestObj = { ...requestObj, ...studentMealsOptions };
          break;
      }
      
      // Log the full request for debugging
      console.log('Sending request to AI Chef API:', JSON.stringify(requestObj, null, 2));
      
      // Track request start time for performance monitoring
      const requestStartTime = Date.now();
      
      // Make API request
      console.log(`Sending ${requestType} request with options:`, requestObj);
      const response = await fetch('/api/ai-chef/premium/ai-chef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestObj),
      });
      
      // Calculate request duration
      const requestDuration = Date.now() - requestStartTime;
      console.log(`AI Chef API request completed in ${requestDuration}ms`);
      
      // Get response details
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
        console.log('AI Chef API response received:', data);
        
        // Check specifically for demo data indicators
        if (
          requestType === 'recipe_curation' && 
          data.premium_content?.curated_recipes?.[0]?.name?.includes('DEMO DATA')
        ) {
          console.warn('DEMO DATA detected in response! Backend connection may have failed.');
          setError('Warning: Using demo data because backend connection failed. Check the console for details.');
        }
      } catch (parseError) {
        console.error('Failed to parse API response as JSON:', parseError);
        console.error('Raw response text:', responseText);
        throw new Error('Invalid response format from server');
      }
      
      // Handle response error
      if (!response.ok) {
        console.error('API response error:', response.status, data);
        setError(data.detail || 'An error occurred while processing your request');
        return;
      }
      
      // Set the response data
      setResponse(data);
      setResultTabs(0); // Reset results tab
      
      // Check if this appears to be mock data by checking response time
      if (requestDuration < 1000) {
        console.warn('Response received very quickly - may be using mock data');
      }
      
    } catch (err) {
      console.error('Error in AI Chef API request:', err);
      setError('An error occurred while communicating with the server. Please try again.');
    } finally {
      setLoading(false);
      console.log("AI Chef Premium request completed");
    }
  };
  
  // Handle copy text to clipboard
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTexts({ ...copiedTexts, [key]: true });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCopiedTexts({ ...copiedTexts, [key]: false });
      }, 3000);
    });
  };
  
  // Render input form based on request type
  const renderInputForm = () => {
    switch (requestType) {
      case 'meal_plan':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Meal Plan Options</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Timeframe"
                  value={mealPlanOptions.timeframe}
                  onChange={handleMealPlanOptionsChange('timeframe')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="day">One Day</option>
                  <option value="weekend">Weekend</option>
                  <option value="week">One Week</option>
                  <option value="two_weeks">Two Weeks</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Special Occasion (optional)"
                  value={mealPlanOptions.occasion}
                  onChange={handleMealPlanOptionsChange('occasion')}
                  fullWidth
                  placeholder="e.g., Anniversary, Birthday, Holiday"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Budget Level"
                  value={mealPlanOptions.budget_level}
                  onChange={handleMealPlanOptionsChange('budget_level')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="budget">Budget-Friendly</option>
                  <option value="moderate">Moderate</option>
                  <option value="premium">Premium</option>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'cooking_guidance':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Cooking Guidance Options</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Recipe Text"
                  value={cookingGuidanceOptions.recipe_text}
                  onChange={handleCookingGuidanceOptionsChange('recipe_text')}
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Paste your recipe here..."
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cooking Method (optional)"
                  value={cookingGuidanceOptions.cooking_method}
                  onChange={handleCookingGuidanceOptionsChange('cooking_method')}
                  fullWidth
                  placeholder="e.g., Sous Vide, Grilling, Baking"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <Button
                    variant={cookingGuidanceOptions.video_instructions ? "contained" : "outlined"}
                    color={cookingGuidanceOptions.video_instructions ? "primary" : "inherit"}
                    onClick={() => setCookingGuidanceOptions({
                      ...cookingGuidanceOptions,
                      video_instructions: !cookingGuidanceOptions.video_instructions
                    })}
                    startIcon={cookingGuidanceOptions.video_instructions ? <CheckCircleIcon /> : null}
                  >
                    Include Video Instructions
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'ingredient_sourcing':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Ingredient Sourcing Options</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Specific Ingredient"
                  value={ingredientSourcingOptions.specific_ingredient}
                  onChange={handleIngredientSourcingOptionsChange('specific_ingredient')}
                  fullWidth
                  placeholder="e.g., Truffle, Wagyu Beef, Saffron"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Recipe (optional)"
                  value={ingredientSourcingOptions.recipe_text}
                  onChange={handleIngredientSourcingOptionsChange('recipe_text')}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="If you have a specific recipe in mind, paste it here..."
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'recipe_curation':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Recipe Curation Options</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cuisine Type (optional)"
                  value={recipeCurationOptions.cuisine_type}
                  onChange={handleRecipeCurationOptionsChange('cuisine_type')}
                  fullWidth
                  placeholder="e.g., French, Japanese, Mediterranean"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Occasion (optional)"
                  value={recipeCurationOptions.occasion}
                  onChange={handleRecipeCurationOptionsChange('occasion')}
                  fullWidth
                  placeholder="e.g., Date Night, Holiday Gathering"
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'student_meals':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Student Meal Options</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Budget Level"
                  value={studentMealsOptions.budget_level}
                  onChange={handleStudentMealsOptionsChange('budget_level')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="ultra_budget">Ultra Budget (Under $5 per meal)</option>
                  <option value="budget">Budget-Friendly ($5-$7 per meal)</option>
                  <option value="moderate">Moderate ($7-$10 per meal)</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Prep Time Limit"
                  value={studentMealsOptions.prep_time_limit}
                  onChange={handleStudentMealsOptionsChange('prep_time_limit')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="15_minutes">Quick (15 minutes or less)</option>
                  <option value="30_minutes">Medium (30 minutes or less)</option>
                  <option value="45_minutes">Longer (45 minutes or less)</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Kitchen Equipment"
                  value={studentMealsOptions.kitchen_equipment}
                  onChange={handleStudentMealsOptionsChange('kitchen_equipment')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="minimal">Minimal (Microwave, toaster)</option>
                  <option value="basic">Basic (Stovetop, no oven)</option>
                  <option value="standard">Standard (Stovetop, oven)</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Cooking Skill"
                  value={studentMealsOptions.cooking_skill}
                  onChange={handleStudentMealsOptionsChange('cooking_skill')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="beginner">Beginner (New to cooking)</option>
                  <option value="intermediate">Intermediate (Some experience)</option>
                  <option value="advanced">Advanced (Experienced cook)</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Dietary Preference"
                  value={studentMealsOptions.dietary_preference}
                  onChange={handleStudentMealsOptionsChange('dietary_preference')}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">No specific preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="high_protein">High Protein</option>
                  <option value="gluten_free">Gluten-Free</option>
                  <option value="dairy_free">Dairy-Free</option>
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Student-Friendly Meals:</strong> Optimized for nutrition, budget, and quick preparation with limited equipment. Perfect for busy academic schedules!
              </Typography>
            </Box>
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  // Render the results based on the response and request type
  const renderResults = () => {
    if (!response) return null;
    
    // Use a safer type approach
    const content = response.premium_content as unknown as any;
    
    // Log response data for debugging
    console.log("Request type:", requestType);
    console.log("Full response:", response);
    console.log("Premium content:", content);
    
    // General response display components based on request type
    switch (requestType) {
      case 'meal_plan':
        return (
          <Box sx={{ mt: 4 }}>
            <Tabs value={resultTabs} onChange={handleResultTabsChange} aria-label="meal plan results tabs" centered>
              <Tab label="Meal Plan" icon={<RestaurantIcon />} />
              <Tab label="Grocery List" icon={<ShoppingBasketIcon />} />
              <Tab label="Prep Guide" icon={<KitchenIcon />} />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {resultTabs === 0 && content.meal_plan && (
                <Box>
                  <Typography variant="h5" gutterBottom>Your Personalized Meal Plan</Typography>
                  {content.meal_plan.days && content.meal_plan.days.map((day: MealPlanDay, index: number) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>{day.day}</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle1" color="text.secondary">Breakfast</Typography>
                            <Typography variant="body1">{day.breakfast.name}</Typography>
                            <Typography variant="body2">{day.breakfast.description}</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle1" color="text.secondary">Lunch</Typography>
                            <Typography variant="body1">{day.lunch.name}</Typography>
                            <Typography variant="body2">{day.lunch.description}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" color="text.secondary">Dinner</Typography>
                            <Typography variant="body1">{day.dinner.name}</Typography>
                            <Typography variant="body2">{day.dinner.description}</Typography>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                              <LocalBarIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>{day.dinner.wine_pairing}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Typography variant="subtitle1" color="text.secondary">Snacks</Typography>
                            {day.snacks && day.snacks.map((snack: any, snackIndex: number) => (
                              <Typography key={snackIndex} variant="body2">{snack.name}</Typography>
                            ))}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Nutrition Summary</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">Daily Calories</Typography>
                          <Typography variant="h6">{content.nutrition_summary?.average_daily_calories}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">Protein</Typography>
                          <Typography variant="h6">{content.nutrition_summary?.protein_ratio}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">Carbs</Typography>
                          <Typography variant="h6">{content.nutrition_summary?.carb_ratio}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">Fat</Typography>
                          <Typography variant="h6">{content.nutrition_summary?.fat_ratio}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    {content.nutrition_summary?.daily_macros && (
                      <>
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Detailed Nutrition Breakdown</Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Card>
                              <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom>
                                  Macronutrient Distribution
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                  Daily Calorie Allocation:
                                </Typography>
                                <Box sx={{ ml: 2, mb: 2 }}>
                                  <Typography variant="body2">
                                    Breakfast: {content.nutrition_summary.daily_macros.calories_breakdown.breakfast}
                                  </Typography>
                                  <Typography variant="body2">
                                    Lunch: {content.nutrition_summary.daily_macros.calories_breakdown.lunch}
                                  </Typography>
                                  <Typography variant="body2">
                                    Dinner: {content.nutrition_summary.daily_macros.calories_breakdown.dinner}
                                  </Typography>
                                  <Typography variant="body2">
                                    Snacks: {content.nutrition_summary.daily_macros.calories_breakdown.snacks}
                                  </Typography>
                                </Box>
                                
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={4}>
                                    <Paper sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                      <Typography variant="subtitle2" align="center">
                                        Protein: {content.nutrition_summary.daily_macros.protein.grams}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Paper sx={{ p: 1.5, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                                      <Typography variant="subtitle2" align="center">
                                        Carbs: {content.nutrition_summary.daily_macros.carbohydrates.grams}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Paper sx={{ p: 1.5, bgcolor: 'info.light', color: 'info.contrastText' }}>
                                      <Typography variant="subtitle2" align="center">
                                        Fats: {content.nutrition_summary.daily_macros.fats.grams}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                                
                                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                  Fiber: {content.nutrition_summary.daily_macros.fiber.grams}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Card>
                              <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom>
                                  Micronutrients & Sources
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                                      <Typography variant="caption">Vitamin A</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients.vitamin_a}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                                      <Typography variant="caption">Vitamin C</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients.vitamin_c}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                                      <Typography variant="caption">Calcium</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients.calcium}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                                      <Typography variant="caption">Iron</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients.iron}</Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                                
                                <Typography variant="subtitle2" gutterBottom>Key Sources:</Typography>
                                <Box sx={{ ml: 2 }}>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <span style={{ width: '80px' }}>Protein:</span>
                                    <Chip 
                                      size="small" 
                                      label={content.nutrition_summary.daily_macros.protein.sources.join(', ')} 
                                      variant="outlined" 
                                      color="primary"
                                    />
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <span style={{ width: '80px' }}>Carbs:</span>
                                    <Chip 
                                      size="small" 
                                      label={content.nutrition_summary.daily_macros.carbohydrates.sources.join(', ')} 
                                      variant="outlined" 
                                      color="secondary"
                                    />
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <span style={{ width: '80px' }}>Fats:</span>
                                    <Chip 
                                      size="small" 
                                      label={content.nutrition_summary.daily_macros.fats.sources.join(', ')} 
                                      variant="outlined" 
                                      color="info"
                                    />
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '80px' }}>Fiber:</span>
                                    <Chip 
                                      size="small" 
                                      label={content.nutrition_summary.daily_macros.fiber.sources.join(', ')} 
                                      variant="outlined" 
                                      color="success"
                                    />
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Box>
                </Box>
              )}
              
              {resultTabs === 1 && content.grocery_list && (
                <Box>
                  <Typography variant="h5" gutterBottom>Your Grocery List</Typography>
                  <Grid container spacing={3}>
                    {Object.entries(content.grocery_list).map((entry, index) => {
                      const category = entry[0];
                      const items = entry[1] as string[];
                      return (
                      <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                              {category}
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              {items && items.map((item: string, i: number) => (
                                <Typography component="li" key={i}>{item}</Typography>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )})}
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Estimated Total Cost: <strong>{content.estimated_total_cost}</strong></Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={copiedTexts['grocery_list'] ? <CheckCircleIcon /> : <ContentCopyIcon />}
                      onClick={() => copyToClipboard(JSON.stringify(content.grocery_list, null, 2), 'grocery_list')}
                    >
                      {copiedTexts['grocery_list'] ? 'Copied!' : 'Copy List'}
                    </Button>
                  </Box>
                </Box>
              )}
              
              {resultTabs === 2 && content.meal_prep_guide && (
                <Box>
                  <Typography variant="h5" gutterBottom>Meal Prep Guide</Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">Prep Day: {content.meal_prep_guide.day}</Typography>
                      <Box component="ol" sx={{ pl: 2, mt: 2 }}>
                        {content.meal_prep_guide.instructions && content.meal_prep_guide.instructions.map((instruction: string, i: number) => (
                          <Typography component="li" key={i} sx={{ mb: 1 }}>{instruction}</Typography>
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="h6" color="primary">Storage Tips</Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                        {content.meal_prep_guide.storage_tips && content.meal_prep_guide.storage_tips.map((tip: string, i: number) => (
                          <Typography component="li" key={i} sx={{ mb: 1 }}>{tip}</Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          </Box>
        );
        
      case 'cooking_guidance':
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Professional Cooking Guidance</Typography>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary">{content.recipe_overview?.name}</Typography>
                  <Box>
                    <Chip 
                      label={`Difficulty: ${content.recipe_overview?.difficulty}`} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`Time: ${content.recipe_overview?.estimated_time}`} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>
                </Box>
                
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Professional Techniques</Typography>
                <Grid container spacing={2}>
                  {content.professional_techniques?.map((technique: any, index: number) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" color="primary" gutterBottom>{technique.name}</Typography>
                          <Typography variant="body2" paragraph>{technique.description}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                            <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
                            <Typography variant="body2" fontStyle="italic">
                              <strong>Pro Tip:</strong> {technique.pro_tip}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Step-by-Step Instructions</Typography>
                <Box>
                  {content.step_by_step_guide?.map((step: any, index: number) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex' }}>
                          <Box 
                            sx={{ 
                              width: 35, 
                              height: 35, 
                              borderRadius: '50%', 
                              bgcolor: 'primary.main', 
                              color: 'white', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              mr: 2,
                              flexShrink: 0
                            }}
                          >
                            {step.step}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">{step.instruction}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                <strong>Timing:</strong> {step.timing}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                <strong>Chef's Note:</strong> {step.chef_notes}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Common Pitfalls & Solutions</Typography>
                    {content.common_pitfalls?.map((pitfall: any, index: number) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="error">{pitfall.issue}</Typography>
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          <strong>Solution:</strong> {pitfall.solution}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Recommended Equipment</Typography>
                    {content.equipment_recommendations?.map((equipment: any, index: number) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary">{equipment.item}</Typography>
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          <strong>Purpose:</strong> {equipment.purpose}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          <strong>Alternative:</strong> {equipment.alternative}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Presentation & Plating</Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1" paragraph>{content.plating_guide?.description}</Typography>
                      <Typography variant="subtitle2">Garnish Suggestions:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, ml: 2 }}>
                        {content.plating_guide?.garnish_suggestions.map((garnish: string, index: number) => (
                          <Chip key={index} label={garnish} variant="outlined" size="small" />
                        ))}
                      </Box>
                      <Typography variant="subtitle2">Presentation Tips:</Typography>
                      <Box component="ul" sx={{ pl: 4 }}>
                        {content.plating_guide?.presentation_tips.map((tip: string, index: number) => (
                          <Typography component="li" key={index} variant="body2">{tip}</Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Advanced Variations</Typography>
                  <Grid container spacing={2}>
                    {content.advanced_variations?.map((variation: any, index: number) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom>{variation.name}</Typography>
                            <Typography variant="body2" paragraph>{variation.modification}</Typography>
                            <Typography variant="subtitle2" gutterBottom>Additional Ingredients:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {variation.additional_ingredients.map((ingredient: string, i: number) => (
                                <Chip key={i} label={ingredient} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'ingredient_sourcing':
        // Get the first ingredient from the guide
        const ingredientGuide = content.ingredient_guide?.[0] || {};
        
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Ingredient Sourcing Guide</Typography>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h4" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {ingredientGuide.ingredient}
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Quality Indicators</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {ingredientGuide.quality_indicators?.map((indicator: string, index: number) => (
                        <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>{indicator}</Typography>
                      ))}
                    </Box>
                    
                    <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Selection Tips</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {ingredientGuide.selection_tips?.map((tip: string, index: number) => (
                        <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>{tip}</Typography>
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Seasonality</Typography>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle2">Peak Season:</Typography>
                        <Typography variant="body2" paragraph>{ingredientGuide.seasonality?.peak_season}</Typography>
                        
                        <Typography variant="subtitle2">Availability:</Typography>
                        <Typography variant="body2" paragraph>{ingredientGuide.seasonality?.availability}</Typography>
                        
                        <Typography variant="subtitle2">Seasonal Notes:</Typography>
                        <Typography variant="body2">{ingredientGuide.seasonality?.seasonal_notes}</Typography>
                      </CardContent>
                    </Card>
                    
                    <Typography variant="h6" sx={{ mb: 2 }}>Storage Method</Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Duration:</Typography>
                        <Typography variant="body2" paragraph>{ingredientGuide.storage_method?.duration}</Typography>
                        
                        <Typography variant="subtitle2">Instructions:</Typography>
                        <Typography variant="body2">{ingredientGuide.storage_method?.instructions}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Where to Source</Typography>
                <Grid container spacing={2}>
                  {ingredientGuide.sourcing_locations?.map((location: any, index: number) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" color="primary" gutterBottom>{location.name}</Typography>
                          <Chip label={location.type} size="small" sx={{ mb: 1 }} />
                          <Typography variant="body2"><strong>Price Range:</strong> {location.price_range}</Typography>
                          <Typography variant="body2"><strong>Quality:</strong> {location.quality}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Sustainable Options</Typography>
                  <Grid container spacing={2}>
                    {ingredientGuide.sustainable_options?.map((option: any, index: number) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom>{option.description}</Typography>
                            <Typography variant="body2"><strong>Certification:</strong> {option.certification}</Typography>
                            <Typography variant="body2"><strong>Benefits:</strong> {option.benefits}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Recommended Specialty Stores</Typography>
                  <Grid container spacing={2}>
                    {content.specialty_recommendations?.map((store: any, index: number) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom>{store.store}</Typography>
                            <Typography variant="body2"><strong>Location:</strong> {store.location}</Typography>
                            <Typography variant="body2"><strong>Specialty:</strong> {store.specialty}</Typography>
                            <Typography variant="body2"><strong>Notes:</strong> {store.notes}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                {content.preparing_and_serving && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Preparing & Serving</Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Cleaning:</Typography>
                        <Typography variant="body2" paragraph>{content.preparing_and_serving.cleaning}</Typography>
                        
                        <Typography variant="subtitle2">Serving Temperature:</Typography>
                        <Typography variant="body2" paragraph>{content.preparing_and_serving.serving_temperature}</Typography>
                        
                        <Typography variant="subtitle2">Preserving Methods:</Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {content.preparing_and_serving.preserving_methods?.map((method: string, index: number) => (
                            <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>{method}</Typography>
                          ))}
                        </Box>
                        
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Pairing Recommendations:</Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {content.preparing_and_serving.pairing_recommendations?.map((pairing: string, index: number) => (
                            <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>{pairing}</Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Estimated Cost</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ bgcolor: 'error.lighter' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="error.main">Premium</Typography>
                          <Typography variant="body2">{content.estimated_total_cost?.premium}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ bgcolor: 'warning.lighter' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="warning.main">Mid-Range</Typography>
                          <Typography variant="body2">{content.estimated_total_cost?.mid_range}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ bgcolor: 'success.lighter' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="success.main">Budget</Typography>
                          <Typography variant="body2">{content.estimated_total_cost?.budget}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'recipe_curation':
        // Create a safer and more comprehensive way to access the recipes
        // First, ensure we have the recipe data in a reliable way
        let recipeData = null;
        let hasRecipes = false;
        
        try {
          // Log the raw response to see the structure
          console.log('Recipe Curation Raw Response:', response);
          
          // First, check if the response has the expected premium_content structure
          if (response && response.premium_content) {
            // Access premium_content directly
            recipeData = response.premium_content;
            console.log('Recipe Data:', recipeData);
            
            // Try all possible locations where recipes might be
            let recipesArray = null;
            
            // Option 1: Directly in premium_content
            if (Array.isArray((recipeData as any).recipes)) {
              recipesArray = (recipeData as any).recipes;
              console.log('Found recipes directly in premium_content.recipes');
            } 
            // Option 2: In premium_content.curated_menu
            else if ((recipeData as any).curated_menu && Array.isArray((recipeData as any).curated_menu.recipes)) {
              recipesArray = (recipeData as any).curated_menu.recipes;
              console.log('Found recipes in curated_menu.recipes');
            }
            // Option 3: In premium_content.recipe_collection
            else if ((recipeData as any).recipe_collection && Array.isArray((recipeData as any).recipe_collection)) {
              recipesArray = (recipeData as any).recipe_collection;
              console.log('Found recipes in recipe_collection');
            }
            // Option 4: In premium_content.curated_recipes (added based on actual API response)
            else if (Array.isArray((recipeData as any).curated_recipes)) {
              recipesArray = (recipeData as any).curated_recipes;
              console.log('Found recipes in curated_recipes');
            }
            // Option 5: Check for student_meals structure and transform it (added for compatibility)
            else if ((recipeData as any).student_meals && Array.isArray((recipeData as any).student_meals.recipes)) {
              console.log('Found student_meals.recipes - converting to recipe format');
              // Convert student meals recipes to the expected recipe format
              recipesArray = (recipeData as any).student_meals.recipes.map((meal: any) => ({
                name: meal.name,
                chef_inspiration: "Student Meal Special",
                history: "Designed for students and budget-conscious cooks",
                difficulty: "Easy",
                preparation_time: meal.prep_time,
                cooking_time: "Quick",
                ingredients: meal.ingredients.map((item: string) => ({
                  name: item,
                  amount: "As needed",
                  special_notes: ""
                })),
                instructions: meal.instructions.map((step: string, index: number) => ({
                  step: index + 1,
                  description: step,
                  technique: "",
                  chef_tip: meal.storage || "Prepare in advance for busy days"
                })),
                wine_pairing: {
                  recommendation: "Budget-friendly option",
                  flavor_notes: "Light and refreshing",
                  alternative: "Non-alcoholic beverage"
                },
                presentation: {
                  plating_description: "Simple and appealing presentation",
                  garnishes: ["Fresh herbs"],
                  visual_elements: ["Colorful ingredients"]
                },
                make_ahead: [{
                  component: "Full dish",
                  instructions: meal.storage || "Store in refrigerator",
                  storage: "Up to 3 days"
                }]
              }));
              console.log('Converted student meals to recipe format', recipesArray);
            }
            
            // Store the recipes array for rendering
            if (recipesArray && recipesArray.length > 0) {
              hasRecipes = true;
              (recipeData as any).recipes = recipesArray; // Normalize the structure
              console.log(`Found ${recipesArray.length} recipes:`, recipesArray);
            } else {
              console.error('Could not find a valid recipes array in the response');
            }
          } else {
            console.error('Invalid response or premium_content structure');
          }
        } catch (err) {
          console.error('Error accessing recipe data:', err);
        }
        
        // Create a friendly display when there are issues
        if (!recipeData || !hasRecipes) {
          return (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>Curated Recipe Collection</Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                We couldn't load your recipe collection. This might be a temporary issue.
              </Alert>
              
              {/* Debug information to help diagnose the issue */}
              <Box sx={{ mt: 2, mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Debug Information:</Typography>
                <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '300px', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify({
                    responseExists: !!response,
                    responseType: typeof response,
                    premiumContentExists: response && !!response.premium_content,
                    responseKeys: response?.premium_content ? Object.keys(response.premium_content) : [],
                    fullResponse: response,
                  }, null, 2)}
                </pre>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.reload()}
                startIcon={<RefreshIcon />}
              >
                Try Again
              </Button>
            </Box>
          );
        }
        
        // If we have valid data, render the recipe curation UI
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Curated Recipe Collection</Typography>
            
            {/* Debug information if no recipes found */}
            {!hasRecipes && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Debug Information: Could not find recipe data in the response.
                <pre style={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify({
                    responseType: typeof response,
                    premiumContentType: response ? typeof response.premium_content : 'N/A',
                    hasRecipesProperty: recipeData ? 'recipes' in recipeData : false,
                  }, null, 2)}
                </pre>
              </Alert>
            )}
            
            <Card sx={{ mb: 4 }}>
              <CardContent>
                {/* Look for menu info in curated_menu first, then in the main recipeData object */}
                {recipeData && ((recipeData as any).curated_menu || (recipeData as any).theme || (recipeData as any).overview || (recipeData as any).chef_notes) ? (
                  <>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {(recipeData as any).curated_menu?.theme || (recipeData as any).theme || 'Gourmet Recipe Collection'}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {(recipeData as any).curated_menu?.overview || (recipeData as any).overview || 'A collection of chef-curated recipes for your culinary enjoyment.'}
                    </Typography>
                    
                    {((recipeData as any).curated_menu?.chef_notes || (recipeData as any).chef_notes) && (
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.lighter', mb: 4 }}>
                        <Typography variant="subtitle1" fontStyle="italic">
                          <strong>Chef's Note:</strong> {(recipeData as any).curated_menu?.chef_notes || (recipeData as any).chef_notes}
                        </Typography>
                      </Paper>
                    )}
                  </>
                ) : hasRecipes ? (
                  // If we have recipes but no menu info, show a simple header
                  <>
                    <Typography variant="h4" color="primary" gutterBottom>
                      Curated Recipe Collection
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      Enjoy this carefully curated collection of chef-inspired recipes.
                    </Typography>
                  </>
                ) : (
                  <Alert severity="info" sx={{ mb: 2 }}>Menu information not available</Alert>
                )}
                
                <Typography variant="h6" gutterBottom>Complete Menu</Typography>
                
                {hasRecipes ? (recipeData as any).recipes.map((recipe: any, index: number) => (
                  <Card key={index} variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Chip 
                            label={recipe.course || recipe.name.split(' ')[0]} 
                            color="primary" 
                            size="small" 
                            sx={{ mb: 1 }} 
                          />
                          <Typography variant="h6" color="secondary">{recipe.dish_name || recipe.name}</Typography>
                        </Box>
                        <Box>
                          <Chip 
                            label={`Difficulty: ${recipe.difficulty}`} 
                            size="small" 
                            sx={{ mr: 1 }} 
                          />
                          <Chip 
                            label={`Prep: ${recipe.prep_time || recipe.preparation_time || '20 minutes'}`} 
                            size="small" 
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" paragraph>{recipe.description || recipe.chef_inspiration}</Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2">Make-Ahead:</Typography>
                            <Typography variant="body2" paragraph>
                              {typeof recipe.make_ahead === 'string' 
                                ? recipe.make_ahead 
                                : Array.isArray(recipe.make_ahead) && recipe.make_ahead.length > 0
                                  ? recipe.make_ahead[0].instructions || 'Prepare components ahead as needed'
                                  : 'Prepare marinade ahead of time if desired'}
                            </Typography>
                            
                            <Typography variant="subtitle2">Wine Pairing:</Typography>
                            <Typography variant="body2" paragraph>
                              {typeof recipe.wine_pairing === 'string'
                                ? recipe.wine_pairing
                                : typeof recipe.wine_pairing === 'object' && recipe.wine_pairing
                                  ? recipe.wine_pairing.recommendation || 'Wine pairing available'
                                  : 'Pairs well with white wine'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2">Chef's Technique:</Typography>
                            <Typography variant="body2" paragraph>
                              {recipe.chef_technique || 
                                (recipe.instructions && recipe.instructions[0]?.technique) || 
                                'Follow standard preparation techniques'}
                            </Typography>
                            
                            <Typography variant="subtitle2">Presentation Tip:</Typography>
                            <Typography variant="body2">
                              {recipe.presentation_tip || 
                                (recipe.presentation && recipe.presentation.plating_description) || 
                                'Plate carefully for best presentation'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )) : (
                  <Alert severity="info">No recipes found in the response</Alert>
                )}
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Shopping List</Typography>
                  {(recipeData as any) && (recipeData as any).shopping_list ? (
                    <Grid container spacing={2}>
                      {Object.entries((recipeData as any).shopping_list).map(([category, items]: [string, any], index: number) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                                {category}
                              </Typography>
                              <Box component="ul" sx={{ pl: 2 }}>
                                {Array.isArray(items) && items.map((item: string, i: number) => (
                                  <Typography component="li" key={i} variant="body2">{item}</Typography>
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : hasRecipes ? (
                    // Generate shopping list from recipe data if not explicitly provided
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                              Main Ingredients
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              {(recipeData as any).recipes.slice(0, 1).map((recipe: any) => 
                                Array.isArray(recipe.ingredients) ? 
                                  recipe.ingredients.map((ingredient: any, i: number) => (
                                    <Typography component="li" key={i} variant="body2">
                                      {typeof ingredient === 'string' ? ingredient : ingredient.name || ingredient.item || JSON.stringify(ingredient)}
                                    </Typography>
                                  )) : 
                                  recipe.ingredient_list ? 
                                    recipe.ingredient_list.split(',').map((item: string, i: number) => (
                                      <Typography component="li" key={i} variant="body2">{item.trim()}</Typography>
                                    )) :
                                    <Typography variant="body2">Ingredients list not available</Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                              Spices & Seasonings
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <Typography component="li" variant="body2">Salt and pepper to taste</Typography>
                              <Typography component="li" variant="body2">Herbs and spices as needed for recipes</Typography>
                              <Typography component="li" variant="body2">Cooking oil or butter</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                              Additional Items
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <Typography component="li" variant="body2">Wine for pairing (optional)</Typography>
                              <Typography component="li" variant="body2">Fresh garnishes for presentation</Typography>
                              <Typography component="li" variant="body2">Pantry staples as needed</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>Shopping list not available for this recipe collection</Alert>
                  )}
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Preparation Timeline</Typography>
                  {(recipeData as any) && (recipeData as any).preparation_timeline ? (
                    <Grid container spacing={2}>
                      {Object.entries((recipeData as any).preparation_timeline).map(([timepoint, tasks]: [string, any], index: number) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom>
                                {timepoint}
                              </Typography>
                              <Box component="ul" sx={{ pl: 2 }}>
                                {Array.isArray(tasks) && tasks.map((task: string, i: number) => (
                                  <Typography component="li" key={i} variant="body2" sx={{ mb: 0.5 }}>{task}</Typography>
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : hasRecipes ? (
                    // Generate a simple preparation timeline if not explicitly provided
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                              Day Before
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Shop for all ingredients</Typography>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Prepare any marinades or sauces that can be made ahead</Typography>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Organize cooking equipment and utensils</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                              Day Of
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Prep ingredients: wash, chop, and measure all components</Typography>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                                {(recipeData as any).recipes[0]?.prep_time || (recipeData as any).recipes[0]?.preparation_time ? 
                                  `Allow ${(recipeData as any).recipes[0].prep_time || (recipeData as any).recipes[0].preparation_time} for preparation` :
                                  'Allow adequate time for preparation before cooking'}
                              </Typography>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Cook dishes according to recipe instructions</Typography>
                              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Plate and garnish before serving</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>Preparation timeline not available for this recipe collection</Alert>
                  )}
                </Box>
                
                {(recipeData as any) && (recipeData as any).cultural_context ? (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Cultural Context</Typography>
                    <Card variant="outlined">
                      <CardContent>
                        {(recipeData as any).cultural_context.history && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>History:</Typography>
                            <Typography variant="body2" paragraph>{(recipeData as any).cultural_context.history}</Typography>
                          </>
                        )}
                        
                        {(recipeData as any).cultural_context.regional_significance && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>Regional Significance:</Typography>
                            <Typography variant="body2" paragraph>{(recipeData as any).cultural_context.regional_significance}</Typography>
                          </>
                        )}
                        
                        {(recipeData as any).cultural_context.traditional_occasions && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>Traditional Occasions:</Typography>
                            <Typography variant="body2">{(recipeData as any).cultural_context.traditional_occasions}</Typography>
                          </>
                        )}
                        
                        {!(recipeData as any).cultural_context.history && 
                         !(recipeData as any).cultural_context.regional_significance && 
                         !(recipeData as any).cultural_context.traditional_occasions && (
                          <Typography variant="body2">Cultural context information not available</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                ) : null}
                
                {(recipeData as any) && (recipeData as any).dietary_modifications ? (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Dietary Modifications</Typography>
                    <Grid container spacing={2}>
                      {(recipeData as any).dietary_modifications.gluten_free && (
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom>Gluten-Free</Typography>
                              <Typography variant="body2">{(recipeData as any).dietary_modifications.gluten_free}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      
                      {(recipeData as any).dietary_modifications.vegetarian && (
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom>Vegetarian</Typography>
                              <Typography variant="body2">{(recipeData as any).dietary_modifications.vegetarian}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      
                      {(recipeData as any).dietary_modifications.dairy_free && (
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom>Dairy-Free</Typography>
                              <Typography variant="body2">{(recipeData as any).dietary_modifications.dairy_free}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      
                      {!(recipeData as any).dietary_modifications.gluten_free && 
                       !(recipeData as any).dietary_modifications.vegetarian && 
                       !(recipeData as any).dietary_modifications.dairy_free && (
                        <Grid item xs={12}>
                          <Alert severity="info">No dietary modifications available for this recipe collection</Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'student_meals':
        // Student meals will have a similar structure to meal plan but with student-specific data
        return (
          <Box sx={{ mt: 4 }}>
            <Tabs value={resultTabs} onChange={handleResultTabsChange} aria-label="student meals results tabs" centered>
              <Tab label="Quick Meals" icon={<RestaurantIcon />} />
              <Tab label="Shopping List" icon={<ShoppingBasketIcon />} />
              <Tab label="Study Week Plan" icon={<KitchenIcon />} />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {resultTabs === 0 && content.student_meals?.recipes && (
                <Box>
                  <Typography variant="h5" gutterBottom>Student-Friendly Quick Meals</Typography>
                  <Grid container spacing={3}>
                    {content.student_meals.recipes.map((recipe: any, index: number) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" color="primary">{recipe.name}</Typography>
                              <Box>
                                <Chip 
                                  label={`${recipe.prep_time || '15 min'}`} 
                                  color="secondary" 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                />
                                <Chip 
                                  label={`${recipe.cost || 'Budget'}`} 
                                  color="primary" 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" paragraph>{recipe.description}</Typography>
                            
                            <Typography variant="subtitle2" gutterBottom>Key Ingredients:</Typography>
                            <Box sx={{ mb: 2 }}>
                              {recipe.ingredients && recipe.ingredients.map((ingredient: string, i: number) => (
                                <Chip key={i} label={ingredient} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                              ))}
                            </Box>
                            
                            <Typography variant="subtitle2" gutterBottom>Quick Instructions:</Typography>
                            <Box component="ol" sx={{ pl: 3, mt: 1 }}>
                              {recipe.instructions && recipe.instructions.map((step: string, i: number) => (
                                <Typography component="li" key={i} variant="body2" sx={{ mb: 0.5 }}>{step}</Typography>
                              ))}
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Nutrition:</strong> {recipe.nutrition || 'Balanced'}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Brain Food:</strong> {recipe.brain_boost || 'Focus enhancing'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {resultTabs === 1 && content.student_meals?.shopping_list && (
                <Box>
                  <Typography variant="h5" gutterBottom>Budget Shopping List</Typography>
                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Student Tip:</strong> This shopping list is optimized for one week of meals with minimal waste and maximum budget efficiency.
                      </Typography>
                    </Alert>
                  </Box>
                  <Grid container spacing={3}>
                    {Object.entries(content.student_meals.shopping_list).map(([category, items]: [string, any], index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                              {category}
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              {Array.isArray(items) && items.map((item: any, i: number) => (
                                <Typography component="li" key={i} variant="body2">
                                  {typeof item === 'string' ? item : item.name}
                                  {item.price && <span style={{ color: 'text.secondary', fontSize: '0.85em' }}> (~${item.price})</span>}
                                </Typography>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Estimated Total Cost: <strong>{content.student_meals.estimated_cost || '$35-45 per week'}</strong></Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={copiedTexts['student_shopping'] ? <CheckCircleIcon /> : <ContentCopyIcon />}
                      onClick={() => copyToClipboard(JSON.stringify(content.student_meals.shopping_list, null, 2), 'student_shopping')}
                    >
                      {copiedTexts['student_shopping'] ? 'Copied!' : 'Copy List'}
                    </Button>
                  </Box>
                </Box>
              )}
              
              {resultTabs === 2 && content.student_meals?.study_week_plan && (
                <Box>
                  <Typography variant="h5" gutterBottom>Study Week Meal Plan</Typography>
                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Exam Week Tip:</strong> Meals are scheduled around typical study patterns with brain-boosting foods before study sessions.
                      </Typography>
                    </Alert>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {content.student_meals.study_week_plan.map((day: any, index: number) => (
                      <Grid item xs={12} key={index}>
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>{day.day}</Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" color="text.secondary">Morning</Typography>
                                <Typography variant="body1">{day.morning.name}</Typography>
                                <Typography variant="body2">{day.morning.description}</Typography>
                                <Typography variant="caption" sx={{ color: 'success.main' }}>
                                  Brain boost: {day.morning.brain_boost}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" color="text.secondary">Afternoon</Typography>
                                <Typography variant="body1">{day.afternoon.name}</Typography>
                                <Typography variant="body2">{day.afternoon.description}</Typography>
                                <Typography variant="caption" sx={{ color: 'success.main' }}>
                                  Energy level: {day.afternoon.energy_level}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" color="text.secondary">Evening</Typography>
                                <Typography variant="body1">{day.evening.name}</Typography>
                                <Typography variant="body2">{day.evening.description}</Typography>
                                <Typography variant="caption" sx={{ color: 'info.main' }}>
                                  Sleep quality: {day.evening.sleep_quality}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Study Snack Recommendations</Typography>
                        <Grid container spacing={2}>
                          {content.student_meals.study_snacks && content.student_meals.study_snacks.map((snack: any, index: number) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Box>
                                <Typography variant="subtitle2">{snack.name}</Typography>
                                <Typography variant="body2">{snack.description}</Typography>
                                <Typography variant="caption" sx={{ color: 'primary.main' }}>
                                  Best for: {snack.best_for}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );
        
      default:
        return (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">
              Response received but the specific display format is not implemented for this request type.
              The raw data is available in the response.
            </Alert>
            <pre>{JSON.stringify(content, null, 2)}</pre>
          </Box>
        );
    }
  };
  
  // Function to render subscription error with upgrade button
  const renderSubscriptionError = () => {
    return (
      <Box sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: 'error.lighter', border: '1px solid', borderColor: 'error.light' }}>
        <Typography variant="h6" color="error.main" gutterBottom>
          Premium Feature
        </Typography>
        <Typography gutterBottom>
          AI Personal Chef is a premium feature that requires a subscription. Upgrade your account to access personalized meal plans, cooking guidance, and more.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.href = '/pricing'}
          >
            View Premium Plans
          </Button>
        </Box>
      </Box>
    );
  };
  
  // Render suggestions from the response
  const renderSuggestions = () => {
    if (!response || !response.suggestions || response.suggestions.length === 0) return null;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>You might also like</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {response.suggestions.map((suggestion: string, index: number) => (
            <Chip 
              key={index} 
              label={suggestion} 
              color="primary" 
              variant="outlined" 
              clickable
              onClick={() => {/* Navigate to related feature */}}
            />
          ))}
        </Stack>
      </Box>
    );
  };
  
  // Add this new component for rendering sponsored content
  const renderSponsoredContent = (sponsoredContent: any[]) => {
    if (!sponsoredContent || sponsoredContent.length === 0) return null;
    
    // Track sponsor clicks for analytics
    const trackSponsorClick = (sponsorName: string, url: string) => {
      console.log(`Sponsor click tracked: ${sponsorName}`);
      // In a production app, you'd send this to your analytics service
      // Example: sendAnalyticsEvent('sponsor_click', { sponsor: sponsorName, url });
      
      // For now, just log it
      const event = {
        event_type: 'sponsor_click',
        sponsor: sponsorName,
        timestamp: new Date().toISOString(),
        url: url
      };
      
      // You could send this to your own endpoint for tracking
      // fetch('/api/analytics/track', { method: 'POST', body: JSON.stringify(event) });
    };
    
    return (
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Partner Recommendations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These exclusive offers are selected to complement your request
        </Typography>
        
        <Grid container spacing={2}>
          {sponsoredContent.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  "&:hover": { boxShadow: 3 }
                }}
              >
                <Box 
                  sx={{ 
                    height: 120, 
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: 'grey.100' 
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      top: 5, 
                      left: 5, 
                      bgcolor: 'rgba(255,255,255,0.8)',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      zIndex: 2
                    }}
                  >
                    Sponsored
                  </Typography>
                  <Box 
                    component="img"
                    src={item.banner_image || '/images/sponsors/default-sponsored.jpg'}
                    alt={`${item.partner} promotion`}
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      // Set default fallback image if the specified one fails to load
                      e.currentTarget.src = '/images/sponsors/default-sponsored.jpg';
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.partner}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {item.message}
                  </Typography>
                  {item.promo_code && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Code: {item.promo_code}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard(item.promo_code, 'promo-code')}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component="a" 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => trackSponsorClick(item.partner, item.url)}
                    data-sponsor={item.partner}
                    data-promo={item.promo_code}
                  >
                    View Offer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Personal Chef
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Your exclusive premium cooking companion
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%', bgcolor: 'background.paper', mb: 4 }}>
        <Tabs
          value={requestType}
          onChange={handleRequestTypeChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<RestaurantIcon />} label="Meal Plan" value="meal_plan" />
          <Tab icon={<KitchenIcon />} label="Cooking Guidance" value="cooking_guidance" />
          <Tab icon={<ShoppingBasketIcon />} label="Ingredient Sourcing" value="ingredient_sourcing" />
          <Tab icon={<MenuBookIcon />} label="Recipe Curation" value="recipe_curation" />
          <Tab icon={<MenuBookIcon />} label="Student Meals" value="student_meals" />
        </Tabs>
      </Box>
      
      {renderInputForm()}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ minWidth: 200 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Premium Content'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}
      
      {subscriptionError && renderSubscriptionError()}
      
      {response && !subscriptionError && renderResults()}
      
      {response && !subscriptionError && renderSuggestions()}
      
      {response && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Premium requests remaining: <strong>{response.request_remaining}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Subscription expires: <strong>{new Date(response.user_subscription.expiry_date).toLocaleDateString()}</strong>
          </Typography>
        </Box>
      )}
      
    </Container>
  );
}
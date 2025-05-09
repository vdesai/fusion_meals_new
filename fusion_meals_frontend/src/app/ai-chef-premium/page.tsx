'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import ScienceIcon from '@mui/icons-material/Science';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// Interface for the request types
interface AIChefRequest {
  request_type: 'meal_plan' | 'cooking_guidance' | 'ingredient_sourcing' | 'recipe_curation' | 'student_meals' | 'health_optimization';
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
  // New fields for health optimization
  health_goals?: string[];
  activity_level?: string;
  health_conditions?: string[];
  meal_plan_data?: string; // JSON stringified meal plan data for analysis
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

// Add interface for health optimization options
interface HealthOptimizationOptions {
  health_goals: string[];
  activity_level: string;
  health_conditions: string[];
  meal_plan_data: string;
}

// Add interface for health optimization content/response
interface HealthOptimizationContent {
  overall_analysis: {
    health_score: number; // 0-100 score
    strengths: string[];
    improvement_areas: string[];
  };
  goal_alignment: {
    goal: string;
    alignment_score: number; // 0-100 score
    analysis: string;
    recommendations: string[];
  }[];
  nutrient_analysis: {
    excesses: {
      nutrient: string;
      current_amount: string;
      recommended_amount: string;
      impact: string;
    }[];
    deficiencies: {
      nutrient: string;
      current_amount: string;
      recommended_amount: string;
      food_sources: string[];
    }[];
    balanced_nutrients: string[];
  };
  meal_optimizations: {
    meal_type: string;
    current_meal: string;
    suggested_improvements: {
      component: string;
      suggestion: string;
      benefit: string;
    }[];
  }[];
  scientific_insights: {
    topic: string;
    explanation: string;
    citation: string;
  }[];
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
      // Additional micronutrients
      vitamin_b1?: string; // Thiamin
      vitamin_b2?: string; // Riboflavin
      vitamin_b3?: string; // Niacin
      vitamin_b5?: string; // Pantothenic Acid
      vitamin_b6?: string; // Pyridoxine
      vitamin_b12?: string; // Cobalamin
      folate?: string;     // Vitamin B9
      vitamin_d?: string;  // Calciferol
      vitamin_e?: string;  // Tocopherol
      vitamin_k?: string;  // Phylloquinone
      magnesium?: string;
      phosphorus?: string;
      potassium?: string;
      sodium?: string;
      zinc?: string;
      copper?: string;
      manganese?: string;
      selenium?: string;
      iodine?: string;
      // Sources of micronutrients
      vitamin_a_sources?: string;
      b_vitamins_sources?: string;
      vitamin_c_sources?: string;
      vitamin_d_sources?: string;
      calcium_sources?: string;
      iron_sources?: string;
      magnesium_sources?: string;
      zinc_sources?: string;
    };
  };
  estimated_total_cost: string;
}

// Add an interface for micronutrient requests
interface MicronutrientRequest {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
  isLoading: boolean;
  error: string | null;
  data: Record<string, string> | null;
}

export default function AIChefPremium() {
  // State for handling the form and responses
  const [requestType, setRequestType] = useState<'meal_plan' | 'cooking_guidance' | 'ingredient_sourcing' | 'recipe_curation' | 'student_meals' | 'health_optimization'>('meal_plan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<boolean>(false);
  const [resultTabs, setResultTabs] = useState(0);
  const [copiedTexts, setCopiedTexts] = useState<{[key: string]: boolean}>({});
  
  // State for request options
  const [mealPlanOptions, setMealPlanOptions] = useState<MealPlanOptions>({
    timeframe: 'day', // Changed back to default 'day'
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
  
  // New state for health optimization options
  const [healthOptimizationOptions, setHealthOptimizationOptions] = useState<HealthOptimizationOptions>({
    health_goals: ['balanced_nutrition'],
    activity_level: 'moderate',
    health_conditions: [],
    meal_plan_data: '',
  });
  
  // Response state
  const [response, setResponse] = useState<AIChefResponse | null>(null);
  
  // State for micronutrient requests
  const [micronutrientRequests, setMicronutrientRequests] = useState<{[key: string]: MicronutrientRequest}>({});
  
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
  
  // Add handler for health optimization options changes
  const handleHealthOptimizationOptionsChange = (prop: keyof HealthOptimizationOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setHealthOptimizationOptions({
      ...healthOptimizationOptions,
      [prop]: event.target.value,
    });
  };
  
  // Handle request type change
  const handleRequestTypeChange = (event: React.SyntheticEvent, newValue: 'meal_plan' | 'cooking_guidance' | 'ingredient_sourcing' | 'recipe_curation' | 'student_meals' | 'health_optimization') => {
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
        case 'health_optimization':
          requestObj.health_goals = healthOptimizationOptions.health_goals;
          requestObj.activity_level = healthOptimizationOptions.activity_level;
          requestObj.health_conditions = healthOptimizationOptions.health_conditions;
          requestObj.meal_plan_data = healthOptimizationOptions.meal_plan_data;
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
      
      // Check for network errors
      if (!response.ok) {
        console.error(`API response error: ${response.status} ${response.statusText}`);
        const errorData = await response.text();
        console.error('Error response:', errorData);
        try {
          // Try to parse as JSON
          const errorJson = JSON.parse(errorData);
          setError(errorJson.detail || `Error ${response.status}: ${response.statusText}`);
        } catch (e) {
          // If not JSON, use the raw text
          setError(`Error ${response.status}: ${response.statusText || errorData}`);
        }
        return;
      }
      
      // Get response details
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
        console.log('AI Chef API response received:', data);
        
        // Debug log specifically for micronutrients
        if (data.premium_content?.nutrition_summary?.micronutrients) {
          console.log('Micronutrient data received:', JSON.stringify(data.premium_content.nutrition_summary.micronutrients, null, 2));
        } else {
          console.warn('No micronutrient data found in the response');
        }
        
        // Check specifically for demo data indicators
        if (
          requestType === 'meal_plan' && 
          !data.premium_content?.nutrition_summary?.micronutrients?.vitamin_a
        ) {
          console.warn('Missing micronutrient data detected! May be using demo data.');
          setError('Warning: The response may be demo data. Check the console for details.');
        }

        if (
          requestType === 'recipe_curation' && 
          data.premium_content?.curated_recipes?.[0]?.name?.includes('DEMO DATA')
        ) {
          console.warn('DEMO DATA detected in response! Backend connection may have failed.');
          setError('Warning: Using demo data because backend connection failed. Check the console for details.');
        }

        // Set the response data
        setResponse(data);
        setResultTabs(0); // Reset results tab
      } catch (parseError) {
        console.error('Failed to parse API response as JSON:', parseError);
        console.error('Raw response text:', responseText);
        setError('Invalid response format from server. Check the console for details.');
        return;
      }
      
    } catch (err) {
      console.error('Error in AI Chef API request:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
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
                  helperText="Micronutrient data available on demand for any day"
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
        
      case 'health_optimization':
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom color="primary">
              Advanced Health Optimization
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Analyze your meal plans against specific health goals and get personalized recommendations for optimization.
              Our AI nutritionist will provide scientific insights tailored to your needs.
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f8f8' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Step 1: Select your primary health goals
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { value: 'weight_management', label: 'Weight Management' },
                  { value: 'muscle_building', label: 'Muscle Building' },
                  { value: 'heart_health', label: 'Heart Health' },
                  { value: 'gut_health', label: 'Gut Health' },
                  { value: 'energy_optimization', label: 'Energy Optimization' },
                  { value: 'immune_support', label: 'Immune Support' },
                  { value: 'mental_clarity', label: 'Mental Clarity' },
                  { value: 'balanced_nutrition', label: 'Balanced Nutrition' }
                ].map((goal) => (
                  <Grid item xs={6} sm={4} md={3} key={goal.value}>
                    <Chip
                      label={goal.label}
                      onClick={() => {
                        const updatedGoals = [...healthOptimizationOptions.health_goals];
                        if (updatedGoals.includes(goal.value)) {
                          const index = updatedGoals.indexOf(goal.value);
                          updatedGoals.splice(index, 1);
                        } else {
                          updatedGoals.push(goal.value);
                        }
                        setHealthOptimizationOptions({
                          ...healthOptimizationOptions,
                          health_goals: updatedGoals,
                        });
                      }}
                      color={healthOptimizationOptions.health_goals.includes(goal.value) ? 'primary' : 'default'}
                      variant={healthOptimizationOptions.health_goals.includes(goal.value) ? 'filled' : 'outlined'}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Step 2: Select your activity level
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { value: 'sedentary', label: 'Sedentary (little exercise)' },
                  { value: 'light', label: 'Light (exercise 1-3 days/week)' },
                  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
                  { value: 'active', label: 'Very Active (exercise 6-7 days/week)' },
                  { value: 'extra_active', label: 'Extra Active (physical job & exercise)' }
                ].map((level) => (
                  <Grid item xs={12} sm={6} md={4} key={level.value}>
                    <Chip
                      label={level.label}
                      onClick={() => {
                        setHealthOptimizationOptions({
                          ...healthOptimizationOptions,
                          activity_level: level.value,
                        });
                      }}
                      color={healthOptimizationOptions.activity_level === level.value ? 'primary' : 'default'}
                      variant={healthOptimizationOptions.activity_level === level.value ? 'filled' : 'outlined'}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Step 3: Add any health conditions (optional)
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { value: 'diabetes', label: 'Diabetes Type 2' },
                  { value: 'hypertension', label: 'Hypertension' },
                  { value: 'high_cholesterol', label: 'High Cholesterol' },
                  { value: 'ibs', label: 'Irritable Bowel Syndrome' },
                  { value: 'celiac', label: 'Celiac Disease' },
                  { value: 'gerd', label: 'GERD/Acid Reflux' },
                  { value: 'arthritis', label: 'Arthritis' },
                  { value: 'none', label: 'None' }
                ].map((condition) => (
                  <Grid item xs={6} sm={4} md={3} key={condition.value}>
                    <Chip
                      label={condition.label}
                      onClick={() => {
                        if (condition.value === 'none') {
                          // If "None" is selected, clear all health conditions
                          setHealthOptimizationOptions({
                            ...healthOptimizationOptions,
                            health_conditions: [],
                          });
                        } else {
                          const updatedConditions = [...healthOptimizationOptions.health_conditions];
                          if (updatedConditions.includes(condition.value)) {
                            const index = updatedConditions.indexOf(condition.value);
                            updatedConditions.splice(index, 1);
                          } else {
                            updatedConditions.push(condition.value);
                          }
                          setHealthOptimizationOptions({
                            ...healthOptimizationOptions,
                            health_conditions: updatedConditions,
                          });
                        }
                      }}
                      color={
                        condition.value === 'none' 
                          ? (healthOptimizationOptions.health_conditions.length === 0 ? 'primary' : 'default')
                          : (healthOptimizationOptions.health_conditions.includes(condition.value) ? 'primary' : 'default')
                      }
                      variant={
                        condition.value === 'none'
                          ? (healthOptimizationOptions.health_conditions.length === 0 ? 'filled' : 'outlined')
                          : (healthOptimizationOptions.health_conditions.includes(condition.value) ? 'filled' : 'outlined')
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Step 4: Enter your meal plan information for analysis
              </Typography>
              <TextField
                label="Paste your meal plan details here"
                multiline
                rows={6}
                value={healthOptimizationOptions.meal_plan_data}
                onChange={(e) => setHealthOptimizationOptions({
                  ...healthOptimizationOptions,
                  meal_plan_data: e.target.value,
                })}
                fullWidth
                placeholder="Enter meals for analysis. For best results, include information about breakfast, lunch, dinner, and snacks with approximate quantities."
                helperText="Example: 'Breakfast: 2 scrambled eggs with spinach, whole grain toast, coffee. Lunch: Grilled chicken salad with mixed greens, cherry tomatoes, avocado. Dinner: Salmon with quinoa and roasted broccoli.'"
              />
              
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Or analyze your last generated meal plan:
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    // If there's a meal plan in state, use it for analysis
                    const mealPlanContent = response?.premium_content as unknown as MealPlanContent;
                    if (mealPlanContent?.meal_plan?.days) {
                      const mealPlanText = mealPlanContent.meal_plan.days.map(day => {
                        return `${day.day}:\n` +
                          `Breakfast: ${day.breakfast.name} - ${day.breakfast.description}\n` +
                          `Lunch: ${day.lunch.name} - ${day.lunch.description}\n` +
                          `Dinner: ${day.dinner.name} - ${day.dinner.description}\n` +
                          `Snacks: ${day.snacks.map(s => s.name).join(', ')}`;
                      }).join('\n\n');
                      
                      setHealthOptimizationOptions({
                        ...healthOptimizationOptions,
                        meal_plan_data: mealPlanText,
                      });
                    }
                  }}
                >
                  Use Last Generated Meal Plan
                </Button>
              </Box>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!healthOptimizationOptions.meal_plan_data || healthOptimizationOptions.health_goals.length === 0}
                onClick={handleSubmit}
                startIcon={<ScienceIcon />}
              >
                Analyze and Optimize
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                <LockIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Premium Feature
              </Typography>
            </Box>
          </React.Fragment>
        );
        
      default:
        return null;
    }
  };
  
  // Render the results based on the response and request type
  const renderResults = () => {
    if (!response) return null;
    
    // Use a safer type approach
    const content = response.premium_content as unknown as Record<string, any>;
    
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
                  {/* Check the timeframe and only display the first day if timeframe is "day" */}
                  {content.meal_plan.days && (mealPlanOptions.timeframe === 'day' 
                    ? content.meal_plan.days.slice(0, 1).map((day: MealPlanDay, index: number) => (
                        <Card key={index} sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>Today</Typography>
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
                                {day.snacks && day.snacks.map((snack: { name: string; description: string; calories: string }, snackIndex: number) => (
                                  <Typography key={snackIndex} variant="body2">{snack.name}</Typography>
                                ))}
                              </Grid>
                            </Grid>
                            
                            {/* Add micronutrient analysis button */}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<ScienceIcon />}
                                onClick={() => handleMicronutrientRequest(day, index)}
                                disabled={micronutrientRequests[`day_${index}`]?.isLoading}
                              >
                                {micronutrientRequests[`day_${index}`]?.isLoading ? 'Analyzing...' : 
                                 micronutrientRequests[`day_${index}`]?.data ? 'View Micronutrients' : 'Analyze Micronutrients'}
                              </Button>
                            </Box>
                            
                            {/* Display micronutrient results */}
                            {micronutrientRequests[`day_${index}`]?.data && (
                              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>Micronutrient Analysis</Typography>
                                <Grid container spacing={2}>
                                  {Object.entries(micronutrientRequests[`day_${index}`].data || {})
                                    .filter(([key]) => !key.includes('_sources'))
                                    .map(([key, value]) => (
                                      <Grid item xs={6} sm={4} md={3} key={key}>
                                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                                          <Typography variant="caption">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Typography>
                                          <Typography variant="subtitle2">{String(value)}</Typography>
                                        </Paper>
                                      </Grid>
                                    ))}
                                </Grid>
                              </Box>
                            )}
                            
                            {/* Display error if any */}
                            {micronutrientRequests[`day_${index}`]?.error && (
                              <Alert severity="error" sx={{ mt: 2 }}>
                                Error analyzing micronutrients: {micronutrientRequests[`day_${index}`].error}
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    : content.meal_plan.days.map((day: MealPlanDay, index: number) => (
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
                                {day.snacks && day.snacks.map((snack: { name: string; description: string; calories: string }, snackIndex: number) => (
                                  <Typography key={snackIndex} variant="body2">{snack.name}</Typography>
                                ))}
                              </Grid>
                            </Grid>
                            
                            {/* Add micronutrient analysis button */}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<ScienceIcon />}
                                onClick={() => handleMicronutrientRequest(day, index)}
                                disabled={micronutrientRequests[`day_${index}`]?.isLoading}
                              >
                                {micronutrientRequests[`day_${index}`]?.isLoading ? 'Analyzing...' : 
                                 micronutrientRequests[`day_${index}`]?.data ? 'View Micronutrients' : 'Analyze Micronutrients'}
                              </Button>
                            </Box>
                            
                            {/* Display micronutrient results */}
                            {micronutrientRequests[`day_${index}`]?.data && (
                              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>Micronutrient Analysis</Typography>
                                <Grid container spacing={2}>
                                  {Object.entries(micronutrientRequests[`day_${index}`].data || {})
                                    .filter(([key]) => !key.includes('_sources'))
                                    .map(([key, value]) => (
                                      <Grid item xs={6} sm={4} md={3} key={key}>
                                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                                          <Typography variant="caption">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Typography>
                                          <Typography variant="subtitle2">{String(value)}</Typography>
                                        </Paper>
                                      </Grid>
                                    ))}
                                </Grid>
                              </Box>
                            )}
                            
                            {/* Display error if any */}
                            {micronutrientRequests[`day_${index}`]?.error && (
                              <Alert severity="error" sx={{ mt: 2 }}>
                                Error analyzing micronutrients: {micronutrientRequests[`day_${index}`].error}
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      ))
                  )}
                  
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
                                </CardContent>
                            </Card>
                          </Grid>
                        </Grid>

                        {/* New Detailed Micronutrient Section */}
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Detailed Micronutrient Profile</Typography>
                        <Card sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="subtitle1" color="primary" gutterBottom>Essential Vitamins</Typography>
                            <Grid container spacing={1}>
                              {/* Water-soluble vitamins */}
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                                  Water-soluble Vitamins
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B1 (Thiamin)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_b1 || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B2 (Riboflavin)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_b2 || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B3 (Niacin)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_b3 || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B5 (Pantothenic Acid)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_b5 || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B6 (Pyridoxine)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_b6 || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B9 (Folate)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.folate || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin B12 (Cobalamin)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_b12 || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'success.lighter' }}>
                                      <Typography variant="caption">Vitamin C (Ascorbic Acid)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_c || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Grid>

                              {/* Fat-soluble vitamins */}
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                                  Fat-soluble Vitamins
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                                      <Typography variant="caption">Vitamin A (Retinol)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_a || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                                      <Typography variant="caption">Vitamin D (Calciferol)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_d || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                                      <Typography variant="caption">Vitamin E (Tocopherol)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_e || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                                      <Typography variant="caption">Vitamin K (Phylloquinone)</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.vitamin_k || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 3 }}>Essential Minerals</Typography>
                            <Grid container spacing={1}>
                              {/* Major minerals */}
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                                  Major Minerals
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                                      <Typography variant="caption">Calcium</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.calcium || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                                      <Typography variant="caption">Magnesium</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.magnesium || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                                      <Typography variant="caption">Phosphorus</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.phosphorus || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                                      <Typography variant="caption">Potassium</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.potassium || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                                      <Typography variant="caption">Sodium</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.sodium || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Grid>

                              {/* Trace minerals */}
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                                  Trace Minerals
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                                      <Typography variant="caption">Iron</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.iron || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                                      <Typography variant="caption">Zinc</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.zinc || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                                      <Typography variant="caption">Copper</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.copper || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                                      <Typography variant="caption">Manganese</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.manganese || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                                      <Typography variant="caption">Selenium</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.selenium || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                                      <Typography variant="caption">Iodine</Typography>
                                      <Typography variant="subtitle2">{content.nutrition_summary.micronutrients?.iodine || '-'}</Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle1" color="primary" gutterBottom>
                                Micronutrient Recommendations
                              </Typography>
                              <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                  <strong>What are micronutrients?</strong> Micronutrients are essential vitamins and minerals required in small amounts for normal growth, development, and body functioning.
                                </Typography>
                              </Alert>
                              <Typography variant="body2" paragraph>
                                <strong>Key Micronutrient Sources in Your Meal Plan:</strong>
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ pl: 2 }}>
                                    <Typography variant="body2">• <strong>Vitamin A:</strong> {content.nutrition_summary.micronutrients?.vitamin_a_sources}</Typography>
                                    <Typography variant="body2">• <strong>B Vitamins:</strong> {content.nutrition_summary.micronutrients?.b_vitamins_sources}</Typography>
                                    <Typography variant="body2">• <strong>Vitamin C:</strong> {content.nutrition_summary.micronutrients?.vitamin_c_sources}</Typography>
                                    <Typography variant="body2">• <strong>Vitamin D:</strong> {content.nutrition_summary.micronutrients?.vitamin_d_sources}</Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ pl: 2 }}>
                                    <Typography variant="body2">• <strong>Calcium:</strong> {content.nutrition_summary.micronutrients?.calcium_sources}</Typography>
                                    <Typography variant="body2">• <strong>Iron:</strong> {content.nutrition_summary.micronutrients?.iron_sources}</Typography>
                                    <Typography variant="body2">• <strong>Magnesium:</strong> {content.nutrition_summary.micronutrients?.magnesium_sources}</Typography>
                                    <Typography variant="body2">• <strong>Zinc:</strong> {content.nutrition_summary.micronutrients?.zinc_sources}</Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </CardContent>
                        </Card>
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
        
      case 'health_optimization':
        const healthContent = response?.premium_content as unknown as HealthOptimizationContent;
        if (!healthContent) {
          return <Typography>No health optimization data available</Typography>;
        }
        
        return (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f8fffe', border: '1px solid #e0f7fa' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <ScienceIcon color="primary" sx={{ fontSize: 36 }} />
                <Typography variant="h5" color="primary">Health Optimization Analysis</Typography>
              </Stack>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Overall Health Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <CircularProgress
                      variant="determinate"
                      value={healthContent.overall_analysis.health_score}
                      size={80}
                      thickness={4}
                      sx={{ color: healthContent.overall_analysis.health_score > 70 ? 'success.main' : 
                            healthContent.overall_analysis.health_score > 40 ? 'warning.main' : 'error.main' }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h5" component="div" color="text.secondary">
                        {healthContent.overall_analysis.health_score}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {healthContent.overall_analysis.health_score > 70 ? 'Excellent' : 
                       healthContent.overall_analysis.health_score > 60 ? 'Very Good' :
                       healthContent.overall_analysis.health_score > 50 ? 'Good' :
                       healthContent.overall_analysis.health_score > 40 ? 'Fair' : 'Needs Improvement'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on your goals and nutritional profile
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Nutritional Strengths</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
                    <List dense>
                      {healthContent.overall_analysis.strengths.map((strength, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} fontSize="small" />
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Areas for Improvement</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.04)' }}>
                    <List dense>
                      {healthContent.overall_analysis.improvement_areas.map((area, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <RefreshIcon sx={{ color: 'warning.main', mr: 1 }} fontSize="small" />
                          <ListItemText primary={area} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>Goal Alignment Analysis</Typography>
              <Box sx={{ mb: 4 }}>
                {healthContent.goal_alignment.map((goal, index) => (
                  <Accordion key={index} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ flexGrow: 1, fontWeight: 'medium' }}>{goal.goal}</Typography>
                        <Chip 
                          label={`${goal.alignment_score}%`} 
                          size="small" 
                          color={
                            goal.alignment_score > 70 ? 'success' : 
                            goal.alignment_score > 40 ? 'warning' : 'error'
                          }
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography paragraph>{goal.analysis}</Typography>
                      <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
                      <List dense>
                        {goal.recommendations.map((rec, recIndex) => (
                          <ListItem key={recIndex}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <ArrowRightIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>Nutrient Analysis</Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom color="error">Nutrient Excesses</Typography>
                  {healthContent.nutrient_analysis.excesses.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nutrient</TableCell>
                            <TableCell>Current</TableCell>
                            <TableCell>Recommended</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {healthContent.nutrient_analysis.excesses.map((excess, index) => (
                            <TableRow key={index}>
                              <TableCell>{excess.nutrient}</TableCell>
                              <TableCell>{excess.current_amount}</TableCell>
                              <TableCell>{excess.recommended_amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No significant excesses detected.</Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom color="warning.main">Nutrient Deficiencies</Typography>
                  {healthContent.nutrient_analysis.deficiencies.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nutrient</TableCell>
                            <TableCell>Current</TableCell>
                            <TableCell>Recommended</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {healthContent.nutrient_analysis.deficiencies.map((deficiency, index) => (
                            <Tooltip 
                              key={index}
                              title={
                                <React.Fragment>
                                  <Typography variant="subtitle2">Food Sources:</Typography>
                                  <List dense>
                                    {deficiency.food_sources.map((food, foodIndex) => (
                                      <ListItem key={foodIndex}>
                                        <ListItemText primary={food} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </React.Fragment>
                              }
                            >
                              <TableRow hover>
                                <TableCell>{deficiency.nutrient}</TableCell>
                                <TableCell>{deficiency.current_amount}</TableCell>
                                <TableCell>{deficiency.recommended_amount}</TableCell>
                              </TableRow>
                            </Tooltip>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No significant deficiencies detected.</Typography>
                  )}
                </Grid>
              </Grid>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="success.main">Balanced Nutrients</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {healthContent.nutrient_analysis.balanced_nutrients.map((nutrient, index) => (
                    <Chip 
                      key={index} 
                      label={nutrient} 
                      color="success" 
                      variant="outlined" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>Meal Optimization Suggestions</Typography>
              <Box sx={{ mb: 4 }}>
                {healthContent.meal_optimizations.map((meal, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {meal.meal_type}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Current: {meal.current_meal}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>Suggested Improvements:</Typography>
                    <List dense>
                      {meal.suggested_improvements.map((improvement, impIndex) => (
                        <ListItem key={impIndex}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <SwapHorizIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${improvement.component}: ${improvement.suggestion}`}
                            secondary={improvement.benefit} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>Scientific Insights</Typography>
              <Box sx={{ mb: 2 }}>
                {healthContent.scientific_insights.map((insight, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'rgba(3, 169, 244, 0.04)' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {insight.topic}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {insight.explanation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Source: {insight.citation}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
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
      
      // Gather useful analytics data
      const analyticsData = {
        event_type: 'sponsor_click',
        sponsor: sponsorName,
        timestamp: new Date().toISOString(),
        url: url,
        request_type: requestType, // Track which feature led to this click
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        page_path: window.location.pathname
      };
      
      // Log for development
      console.log('Affiliate click data:', analyticsData);
      
      // TODO: AFFILIATE TRACKING IMPLEMENTATION
      // Uncomment and implement one of these tracking methods:
      
      // 1. Send to your own analytics endpoint
      // fetch('/api/analytics/track', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analyticsData) 
      // });
      
      // 2. Track with Google Analytics
      // if (window.gtag) {
      //   window.gtag('event', 'affiliate_click', {
      //     affiliate_partner: sponsorName,
      //     affiliate_url: url,
      //     content_type: requestType
      //   });
      // }
      
      // 3. Track with Facebook Pixel
      // if (window.fbq) {
      //   window.fbq('track', 'ClickAffiliate', {
      //     partner: sponsorName,
      //     content_type: requestType
      //   });
      // }
      
      // Always return true so the link click continues
      return true;
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
  
  // Handle micronutrient request for a specific day
  const handleMicronutrientRequest = async (day: MealPlanDay, dayIndex: number) => {
    const dayId = `day_${dayIndex}`;
    
    // If already loaded or loading, don't make another request
    if (micronutrientRequests[dayId]?.isLoading || micronutrientRequests[dayId]?.data) {
      return;
    }
    
    // Create initial request state
    setMicronutrientRequests(prev => ({
      ...prev,
      [dayId]: {
        day: day.day,
        breakfast: day.breakfast.name,
        lunch: day.lunch.name,
        dinner: day.dinner.name,
        snacks: day.snacks ? day.snacks.map(snack => snack.name) : [],
        isLoading: true,
        error: null,
        data: null
      }
    }));
    
    try {
      // Prepare request for micronutrient analysis
      const requestData = {
        request_type: "micronutrient_analysis",
        meals: {
          breakfast: `${day.breakfast.name}: ${day.breakfast.description}`,
          lunch: `${day.lunch.name}: ${day.lunch.description}`,
          dinner: `${day.dinner.name}: ${day.dinner.description}`,
          snacks: day.snacks ? day.snacks.map(snack => `${snack.name}: ${snack.description || ''}`) : []
        },
        day_name: day.day // Include day name for better tracking in the backend
      };
      
      console.log("Sending micronutrient request:", requestData);
      
      // Track start time for performance monitoring
      const requestStartTime = Date.now();
      
      // Make API request
      const response = await fetch('/api/ai-chef/premium/ai-chef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      // Log request duration
      const requestDuration = Date.now() - requestStartTime;
      console.log(`Micronutrient analysis completed in ${requestDuration}ms`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Micronutrient data received:", data);
      
      // Update state with results
      setMicronutrientRequests(prev => ({
        ...prev,
        [dayId]: {
          ...prev[dayId],
          isLoading: false,
          data: data.premium_content?.micronutrient_analysis || data.premium_content?.nutrition_summary?.micronutrients || null
        }
      }));
    } catch (error) {
      console.error("Error fetching micronutrient data:", error);
      setMicronutrientRequests(prev => ({
        ...prev,
        [dayId]: {
          ...prev[dayId],
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error"
        }
      }));
    }
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
      
      <Box sx={{ width: '100%', bgcolor: 'background.paper', mb: 4, overflowX: 'auto' }}>
        <Tabs
          value={requestType}
          onChange={handleRequestTypeChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<RestaurantIcon />} label="Meal Plan" value="meal_plan" />
          <Tab icon={<KitchenIcon />} label="Cooking Guidance" value="cooking_guidance" />
          <Tab icon={<ShoppingBasketIcon />} label="Ingredient Sourcing" value="ingredient_sourcing" />
          <Tab icon={<MenuBookIcon />} label="Recipe Curation" value="recipe_curation" />
          <Tab icon={<MenuBookIcon />} label="Student Meals" value="student_meals" />
          <Tab
            icon={<ScienceIcon />}
            label="Health Optimization"
            value="health_optimization"
            sx={{ flexGrow: 1 }}
          />
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
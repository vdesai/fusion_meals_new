'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Slider, 
  Grid,
  Divider,
  SelectChangeEvent,
  Chip
} from '@mui/material';
import { AccessTime, Restaurant, BarChart } from '@mui/icons-material';

interface PreferencesSelectorProps {
  preferences: {
    dietaryRestrictions: string[];
    mealType: string;
    complexity: string;
    prepTime: number;
    servings: number;
  };
  setPreferences: React.Dispatch<React.SetStateAction<{
    dietaryRestrictions: string[];
    mealType: string;
    complexity: string;
    prepTime: number;
    servings: number;
  }>>;
}

const dietaryOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' }
];

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast / Brunch' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'appetizer', label: 'Appetizer / Starter' },
  { value: 'side', label: 'Side Dish' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'snack', label: 'Snack' },
  { value: 'drink', label: 'Beverage' }
];

const complexityLevels = [
  { value: 'easy', label: 'Easy - Few ingredients, simple steps' },
  { value: 'medium', label: 'Medium - Balanced complexity' },
  { value: 'advanced', label: 'Advanced - Multiple components, techniques' }
];

const PreferencesSelector: React.FC<PreferencesSelectorProps> = ({ 
  preferences, 
  setPreferences 
}) => {
  const handleDietaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
      setPreferences({
        ...preferences,
        dietaryRestrictions: [...preferences.dietaryRestrictions, value]
      });
    } else {
      setPreferences({
        ...preferences,
        dietaryRestrictions: preferences.dietaryRestrictions.filter(item => item !== value)
      });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    setPreferences({
      ...preferences,
      [name]: newValue as number
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Set Your Preferences
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Fine-tune your recipe by setting dietary restrictions, meal type, and other preferences.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Restaurant sx={{ mr: 1 }} fontSize="small" /> 
              Meal Specifications
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="meal-type-label">Meal Type</InputLabel>
              <Select
                labelId="meal-type-label"
                id="meal-type"
                name="mealType"
                value={preferences.mealType}
                label="Meal Type"
                onChange={handleSelectChange}
              >
                {mealTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="complexity-label">Recipe Complexity</InputLabel>
              <Select
                labelId="complexity-label"
                id="complexity"
                name="complexity"
                value={preferences.complexity}
                label="Recipe Complexity"
                onChange={handleSelectChange}
              >
                {complexityLevels.map(level => (
                  <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Preparation Time (minutes)
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={preferences.prepTime}
                  onChange={handleSliderChange('prepTime')}
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    { value: 15, label: '15m' },
                    { value: 30, label: '30m' },
                    { value: 60, label: '1h' },
                    { value: 120, label: '2h' }
                  ]}
                  min={15}
                  max={120}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Quick & Easy
                </Typography>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  More Elaborate
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography gutterBottom>
                Number of Servings
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={preferences.servings}
                  onChange={handleSliderChange('servings')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 4, label: '4' },
                    { value: 8, label: '8' }
                  ]}
                  min={1}
                  max={8}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChart sx={{ mr: 1 }} fontSize="small" /> 
              Dietary Restrictions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select any dietary restrictions that apply. Your fusion recipe will be tailored accordingly.
            </Typography>
            
            <FormGroup>
              <Grid container spacing={1}>
                {dietaryOptions.map(option => (
                  <Grid item xs={6} key={option.value}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={preferences.dietaryRestrictions.includes(option.value)}
                          onChange={handleDietaryChange}
                          value={option.value}
                        />
                      }
                      label={option.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Selected Preferences Summary:
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              mt: 2 
            }}>
              <Chip 
                label={`${mealTypes.find(t => t.value === preferences.mealType)?.label ?? 'Dinner'}`} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
              
              <Chip 
                label={`${preferences.prepTime} minutes prep`} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
              
              <Chip 
                label={`${preferences.servings} servings`} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
              
              <Chip 
                label={`${complexityLevels.find(c => c.value === preferences.complexity)?.label?.split(' - ')[0] ?? 'Medium'}`} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
              
              {preferences.dietaryRestrictions.map(restriction => (
                <Chip 
                  key={restriction}
                  label={dietaryOptions.find(o => o.value === restriction)?.label} 
                  color="secondary" 
                  size="small" 
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PreferencesSelector; 
'use client';

import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Button, 
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
  Slider,
  Chip,
  Grid,
  RadioGroup,
  Radio,
  Alert,
  Snackbar
} from "@mui/material";
import { Save, Settings, User as UserIcon, Bell, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

// Type for dietary preferences
interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  lowCarb: boolean;
  keto: boolean;
  pescatarian: boolean;
}

// Type for cooking preferences
interface CookingPreferences {
  cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  maxPrepTime: number;
  servingSize: number;
  caloriesPerMeal: number;
}

// Type for notification settings
interface NotificationSettings {
  emailRecipes: boolean;
  emailMealPlans: boolean;
  emailNewFeatures: boolean;
  pushNewRecipes: boolean;
  pushCookingReminders: boolean;
}

export default function UserSettingsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  // State for the different settings sections
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowCarb: false,
    keto: false,
    pescatarian: false,
  });
  
  const [cookingPreferences, setCookingPreferences] = useState<CookingPreferences>({
    cookingSkillLevel: 'intermediate',
    maxPrepTime: 30,
    servingSize: 2,
    caloriesPerMeal: 600,
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailRecipes: true,
    emailMealPlans: true,
    emailNewFeatures: true,
    pushNewRecipes: false,
    pushCookingReminders: false,
  });
  
  const [allergies, setAllergies] = useState<string[]>(['Peanuts']);
  const [newAllergy, setNewAllergy] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle dietary preference changes
  const handleDietaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDietaryPreferences({
      ...dietaryPreferences,
      [event.target.name]: event.target.checked,
    });
  };

  // Handle cooking preference changes
  const handleCookingSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCookingPreferences({
      ...cookingPreferences,
      cookingSkillLevel: event.target.value as 'beginner' | 'intermediate' | 'advanced',
    });
  };

  const handlePrepTimeChange = (event: Event, newValue: number | number[]) => {
    setCookingPreferences({
      ...cookingPreferences,
      maxPrepTime: newValue as number,
    });
  };

  const handleServingSizeChange = (event: Event, newValue: number | number[]) => {
    setCookingPreferences({
      ...cookingPreferences,
      servingSize: newValue as number,
    });
  };

  const handleCaloriesChange = (event: Event, newValue: number | number[]) => {
    setCookingPreferences({
      ...cookingPreferences,
      caloriesPerMeal: newValue as number,
    });
  };

  // Handle notification setting changes
  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked,
    });
  };

  // Handle allergies
  const handleAddAllergy = () => {
    if (newAllergy.trim() !== '' && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  // Handle form submission
  const handleSaveSettings = () => {
    // Here you would typically save settings to your backend or a service like Clerk's user metadata
    // For now, we'll just show a success message
    console.log('Settings saved:', {
      dietaryPreferences,
      cookingPreferences,
      notificationSettings,
      allergies,
      userId: user?.id
    });
    
    setSaveSuccess(true);
  };

  const handleCloseSnackbar = () => {
    setSaveSuccess(false);
  };

  if (!isLoaded) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading settings...
        </Typography>
      </Container>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Please sign in to view your settings
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          href="/sign-in"
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          User Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Customize your experience with Fusion Meals.
        </Typography>
      </Box>

      {/* Account Settings Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <UserIcon size={24} style={{ marginRight: 8 }} />
          <Typography variant="h5" component="h2">
            Account Settings
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              Profile Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your name, email, and profile picture
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            endIcon={<ChevronRight size={16} />}
            onClick={() => user?.update({})}
          >
            Manage
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              Password & Security
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your password and security settings
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            endIcon={<Lock size={16} />}
          >
            Manage
          </Button>
        </Box>
      </Paper>

      {/* Dietary Preferences Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Settings size={24} style={{ marginRight: 8 }} />
          <Typography variant="h5" component="h2">
            Dietary Preferences
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <FormControl component="fieldset" variant="standard" sx={{ mb: 3 }}>
          <FormLabel component="legend">Diet Types</FormLabel>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.vegetarian} 
                      onChange={handleDietaryChange} 
                      name="vegetarian"
                    />
                  }
                  label="Vegetarian"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.vegan} 
                      onChange={handleDietaryChange} 
                      name="vegan"
                    />
                  }
                  label="Vegan"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.glutenFree} 
                      onChange={handleDietaryChange} 
                      name="glutenFree"
                    />
                  }
                  label="Gluten-Free"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.dairyFree} 
                      onChange={handleDietaryChange} 
                      name="dairyFree"
                    />
                  }
                  label="Dairy-Free"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.nutFree} 
                      onChange={handleDietaryChange} 
                      name="nutFree"
                    />
                  }
                  label="Nut-Free"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.lowCarb} 
                      onChange={handleDietaryChange} 
                      name="lowCarb"
                    />
                  }
                  label="Low-Carb"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.keto} 
                      onChange={handleDietaryChange} 
                      name="keto"
                    />
                  }
                  label="Keto"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={dietaryPreferences.pescatarian} 
                      onChange={handleDietaryChange} 
                      name="pescatarian"
                    />
                  }
                  label="Pescatarian"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Allergies & Intolerances
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <TextField 
              size="small" 
              label="Add allergy" 
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              sx={{ mr: 1, flexGrow: 1 }}
            />
            <Button 
              variant="contained" 
              size="small"
              onClick={handleAddAllergy}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allergies.map((allergy) => (
              <Chip 
                key={allergy} 
                label={allergy} 
                onDelete={() => handleRemoveAllergy(allergy)} 
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Cooking Preferences Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Cooking Preferences
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel id="cooking-skill-label">Cooking Skill Level</FormLabel>
          <RadioGroup
            aria-labelledby="cooking-skill-label"
            name="cookingSkillLevel"
            value={cookingPreferences.cookingSkillLevel}
            onChange={handleCookingSkillChange}
            row
          >
            <FormControlLabel value="beginner" control={<Radio />} label="Beginner" />
            <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
            <FormControlLabel value="advanced" control={<Radio />} label="Advanced" />
          </RadioGroup>
        </FormControl>
        
        <Box sx={{ mb: 3 }}>
          <Typography id="prep-time-slider" gutterBottom>
            Maximum Preparation Time: {cookingPreferences.maxPrepTime} minutes
          </Typography>
          <Slider
            aria-labelledby="prep-time-slider"
            value={cookingPreferences.maxPrepTime}
            onChange={handlePrepTimeChange}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={5}
            max={120}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography id="serving-size-slider" gutterBottom>
            Default Serving Size: {cookingPreferences.servingSize} {cookingPreferences.servingSize === 1 ? 'person' : 'people'}
          </Typography>
          <Slider
            aria-labelledby="serving-size-slider"
            value={cookingPreferences.servingSize}
            onChange={handleServingSizeChange}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography id="calories-slider" gutterBottom>
            Calories Per Meal: {cookingPreferences.caloriesPerMeal} calories
          </Typography>
          <Slider
            aria-labelledby="calories-slider"
            value={cookingPreferences.caloriesPerMeal}
            onChange={handleCaloriesChange}
            valueLabelDisplay="auto"
            step={50}
            marks
            min={200}
            max={1200}
          />
        </Box>
      </Paper>

      {/* Notification Preferences Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Bell size={24} style={{ marginRight: 8 }} />
          <Typography variant="h5" component="h2">
            Notification Preferences
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Email Notifications
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch 
                checked={notificationSettings.emailRecipes} 
                onChange={handleNotificationChange} 
                name="emailRecipes"
              />
            }
            label="Weekly recipe recommendations"
          />
          <FormControlLabel
            control={
              <Switch 
                checked={notificationSettings.emailMealPlans} 
                onChange={handleNotificationChange} 
                name="emailMealPlans"
              />
            }
            label="Meal plan reminders"
          />
          <FormControlLabel
            control={
              <Switch 
                checked={notificationSettings.emailNewFeatures} 
                onChange={handleNotificationChange} 
                name="emailNewFeatures"
              />
            }
            label="New features and updates"
          />
        </FormGroup>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Push Notifications
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch 
                checked={notificationSettings.pushNewRecipes} 
                onChange={handleNotificationChange} 
                name="pushNewRecipes"
              />
            }
            label="New recipe alerts"
          />
          <FormControlLabel
            control={
              <Switch 
                checked={notificationSettings.pushCookingReminders} 
                onChange={handleNotificationChange} 
                name="pushCookingReminders"
              />
            }
            label="Cooking reminders"
          />
        </FormGroup>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<Save />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>

      {/* Success Message */}
      <Snackbar 
        open={saveSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your settings have been saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
} 
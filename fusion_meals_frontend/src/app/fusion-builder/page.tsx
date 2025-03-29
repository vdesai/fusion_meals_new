'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import CuisineSelector from '@/components/fusion-builder/CuisineSelector';
import TechniqueSelector from '@/components/fusion-builder/TechniqueSelector';
import FlavorProfileSelector from '@/components/fusion-builder/FlavorProfileSelector';
import PreferencesSelector from '@/components/fusion-builder/PreferencesSelector';
import FusionResult from '@/components/fusion-builder/FusionResult';

const steps = ['Select Cuisines', 'Choose Techniques', 'Define Flavor Profile', 'Set Preferences'];

// Define an interface for the fusion result
interface FusionRecipe {
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
}

export default function FusionBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fusionResult, setFusionResult] = useState<FusionRecipe | null>(null);
  
  // Selection states
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [flavorProfile, setFlavorProfile] = useState({
    sweet: 50,
    salty: 50,
    sour: 50,
    spicy: 50,
    umami: 50,
    bitter: 50
  });
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [] as string[],
    mealType: 'dinner',
    complexity: 'medium',
    prepTime: 30,
    servings: 4
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleGenerateFusion();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedCuisines([]);
    setSelectedTechniques([]);
    setFlavorProfile({
      sweet: 50,
      salty: 50,
      sour: 50,
      spicy: 50,
      umami: 50,
      bitter: 50
    });
    setPreferences({
      dietaryRestrictions: [],
      mealType: 'dinner',
      complexity: 'medium',
      prepTime: 30,
      servings: 4
    });
    setFusionResult(null);
  };

  const handleGenerateFusion = async () => {
    setIsGenerating(true);
    
    try {
      // Call our API endpoint that connects to the backend
      const response = await fetch('/api/fusion-builder/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cuisines: selectedCuisines,
          techniques: selectedTechniques,
          flavorProfile,
          preferences
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const fusionRecipe = await response.json();
      setFusionResult(fusionRecipe);
    } catch (error) {
      console.error("Error generating fusion recipe:", error);
      // Handle error state
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CuisineSelector selectedCuisines={selectedCuisines} setSelectedCuisines={setSelectedCuisines} />;
      case 1:
        return <TechniqueSelector selectedTechniques={selectedTechniques} setSelectedTechniques={setSelectedTechniques} selectedCuisines={selectedCuisines} />;
      case 2:
        return <FlavorProfileSelector flavorProfile={flavorProfile} setFlavorProfile={setFlavorProfile} />;
      case 3:
        return <PreferencesSelector preferences={preferences} setPreferences={setPreferences} />;
      default:
        return 'Unknown step';
    }
  };

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
          Fusion Recipe Builder
        </Typography>
      </Box>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Create unique fusion recipes by combining elements from different culinary traditions.
      </Typography>

      {fusionResult ? (
        <Box>
          <FusionResult recipe={fusionResult} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" onClick={handleReset} sx={{ mr: 2 }}>
              Create Another Fusion
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              href={`/generate-recipe?name=${encodeURIComponent(fusionResult.name)}`}
            >
              Refine This Recipe
            </Button>
          </Box>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          
          <Box sx={{ mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && selectedCuisines.length < 2) ||
                (activeStep === 1 && selectedTechniques.length === 0) ||
                isGenerating
              }
              startIcon={activeStep === steps.length - 1 && isGenerating ? <CircularProgress size={24} color="inherit" /> : null}
            >
              {activeStep === steps.length - 1 ? 'Generate Fusion Recipe' : 'Next'}
            </Button>
          </Box>
        </Paper>
      )}
      
      <Box sx={{ mt: 6, p: 3, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          What is Fusion Cooking?
        </Typography>
        <Typography variant="body1">
          Fusion cuisine blends elements of different culinary traditions to create innovative, cross-cultural dishes. 
          It&apos;s about finding harmony between diverse ingredients, techniques, and flavor profiles to craft something new 
          and exciting. Our Fusion Recipe Builder uses AI to help you explore these creative combinations with confidence.
        </Typography>
      </Box>
    </Container>
  );
} 
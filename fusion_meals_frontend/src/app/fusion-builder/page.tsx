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
  Grid,
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

export default function FusionBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fusionResult, setFusionResult] = useState<any>(null);
  
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
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response data
      const mockFusionResult = {
        name: "Thai-Italian Fusion Pasta",
        description: "A vibrant fusion dish combining the aromatic herbs of Thailand with the rich traditions of Italian pasta making. This dish balances the creamy elements of Italian cuisine with the bright, spicy notes of Thai cooking.",
        ingredients: [
          "8 oz linguine pasta",
          "1 cup coconut milk",
          "2 tbsp red curry paste",
          "1/4 cup fresh basil, chopped",
          "1/4 cup fresh cilantro, chopped",
          "2 tbsp olive oil",
          "3 cloves garlic, minced",
          "1 red bell pepper, sliced thin",
          "1 cup cherry tomatoes, halved",
          "2 tbsp fish sauce (or soy sauce for vegetarian)",
          "1 lime, juiced",
          "1/4 cup grated Parmesan cheese",
          "Red pepper flakes, to taste",
          "Salt and pepper, to taste"
        ],
        instructions: [
          "Bring a large pot of salted water to a boil. Cook linguine according to package directions until al dente. Reserve 1/2 cup pasta water before draining.",
          "While pasta cooks, heat olive oil in a large skillet over medium heat. Add garlic and sauté until fragrant, about 30 seconds.",
          "Add red bell pepper and cherry tomatoes, cooking until softened, about 3-4 minutes.",
          "Stir in red curry paste and cook for 1 minute until fragrant.",
          "Pour in coconut milk and bring to a simmer. Cook for 2-3 minutes until slightly thickened.",
          "Add fish sauce (or soy sauce) and lime juice, stirring to combine.",
          "Add drained pasta to the sauce, tossing to coat. If sauce is too thick, add reserved pasta water a little at a time.",
          "Remove from heat and stir in fresh basil, cilantro, and half of the Parmesan cheese.",
          "Season with salt, pepper, and red pepper flakes to taste.",
          "Serve immediately, garnished with remaining Parmesan cheese and additional herbs if desired."
        ],
        cookingTime: "25 minutes",
        servings: 4,
        difficultyLevel: "Medium",
        nutritionalInfo: {
          calories: 420,
          protein: 12,
          carbs: 48,
          fat: 22
        },
        cuisineFusion: {
          primary: "Italian",
          secondary: "Thai",
          techniques: ["Al dente pasta cooking", "Thai curry preparation"],
          flavorProfile: "Creamy, spicy, aromatic with umami notes"
        },
        image: "/images/generated/thai-italian-fusion.jpg"
      };
      
      setFusionResult(mockFusionResult);
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
          It's about finding harmony between diverse ingredients, techniques, and flavor profiles to craft something new 
          and exciting. Our Fusion Recipe Builder uses AI to help you explore these creative combinations with confidence.
        </Typography>
      </Box>
    </Container>
  );
} 
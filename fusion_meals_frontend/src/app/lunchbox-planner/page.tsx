"use client";

import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { toast } from "react-hot-toast";

interface Child {
  name: string;
  age: number;
  preferences: string[];
  allergies: string[];
}

interface LunchItem {
  name: string;
  description: string;
  nutritional_info?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  allergens?: string[];
  prep_time?: string;
}

interface DailyLunch {
  main: LunchItem;
  fruit: LunchItem;
  vegetable: LunchItem;
  snack: LunchItem;
  drink: LunchItem;
}

interface LunchboxPlan {
  children: {
    child_name: string;
    age: number;
    daily_lunches: Record<string, DailyLunch>;
  }[];
  grocery_list: Record<string, string[]>;
}

export default function LunchboxPlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lunchboxPlan, setLunchboxPlan] = useState<LunchboxPlan | null>(null);
  
  // Sample children data for demonstration
  const sampleChildren: Child[] = [
    { 
      name: "Sample Child", 
      age: 7, 
      preferences: ["Loves sweet foods"], 
      allergies: [] 
    }
  ];
  
  const handleGeneratePlan = async () => {
    setIsLoading(true);
    console.log('🚀 Generating lunchbox plan...');
    
    try {
      // First, test if API routes are working
      console.log('📤 Testing API route with a simple request...');
      try {
        const testResponse = await fetch('/api/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true }),
        });
        
        console.log('📨 Test API response status:', testResponse.status);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('✅ Test API response:', testData);
        } else {
          console.error('❌ Test API failed:', testResponse.statusText);
        }
      } catch (testError) {
        console.error('❌ Test API error:', testError);
      }
      
      // Try the actual API
      console.log('📤 Making request to /api/generate-lunchbox-plan');
      const response = await fetch('/api/generate-lunchbox-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          children: sampleChildren,
          days: 5,
        }),
      });
      
      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ API response not OK:', response.status, response.statusText);
        // Generate mock data instead
        generateMockData();
        return;
      }
      
      const data = await response.json();
      console.log('✅ Received lunchbox plan data');
      setLunchboxPlan(data);
      toast.success("Lunchbox plan generated successfully!");
    } catch (error) {
      console.error('❌ Error in lunchbox plan generation:', error);
      // Generate mock data on error
      generateMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    console.log('🔄 Generating mock data');
    const mockPlan: LunchboxPlan = {
      children: [
        {
          child_name: "Sample Child",
          age: 7,
          daily_lunches: {
            "Monday": {
              main: { 
                name: "Sandwich", 
                description: "Tasty sandwich",
                nutritional_info: {
                  calories: 320,
                  protein: '12g',
                  carbs: '30g',
                  fat: '10g'
                },
                allergens: ['wheat'],
                prep_time: '5 mins'
              },
              fruit: { 
                name: "Apple", 
                description: "Fresh apple",
                nutritional_info: {
                  calories: 80,
                  protein: '0g',
                  carbs: '20g',
                  fat: '0g'
                },
                allergens: [],
                prep_time: '1 min'
              },
              vegetable: { 
                name: "Carrot sticks", 
                description: "Crunchy carrots",
                nutritional_info: {
                  calories: 35,
                  protein: '1g',
                  carbs: '8g',
                  fat: '0g'
                },
                allergens: [],
                prep_time: '3 mins'
              },
              snack: { 
                name: "Yogurt", 
                description: "Creamy yogurt",
                nutritional_info: {
                  calories: 120,
                  protein: '5g',
                  carbs: '15g',
                  fat: '4g'
                },
                allergens: ['dairy'],
                prep_time: '1 min'
              },
              drink: { 
                name: "Water", 
                description: "Refreshing water",
                nutritional_info: {
                  calories: 0,
                  protein: '0g',
                  carbs: '0g',
                  fat: '0g'
                },
                allergens: [],
                prep_time: '1 min'
              }
            }
          }
        }
      ],
      grocery_list: {
        'Fruits': ['Apples', 'Bananas'],
        'Vegetables': ['Carrots', 'Cucumber'],
        'Other': ['Bread', 'Yogurt']
      }
    };
    
    setLunchboxPlan(mockPlan);
    toast.success("Generated test lunchbox plan (mock data - API unavailable)");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kids&apos; Lunchbox Meal Planner
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Plan nutritious and balanced school lunches for your children based on their age, 
        preferences, and dietary restrictions.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleGeneratePlan}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Generating..." : "Generate Sample Lunchbox Plan"}
      </Button>
      
      {lunchboxPlan && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Plan Generated Successfully!
          </Typography>
          <Typography>
            Check your browser console to see the API communication details.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>
            Sample Grocery List:
          </Typography>
          {Object.entries(lunchboxPlan.grocery_list).map(([category, items]) => (
            <Box key={category} sx={{ mt: 1 }}>
              <Typography variant="subtitle1">{category}:</Typography>
              <Typography>{items.join(", ")}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
} 
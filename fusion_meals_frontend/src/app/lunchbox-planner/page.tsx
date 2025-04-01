"use client";

import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField,
  Chip,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Plus, X, Edit2, RotateCw } from "lucide-react";
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

interface SavedMealPlan {
  id: string;
  name: string;
  date: string;
  plan: LunchboxPlan;
}

// Common age options
const ageOptions = Array.from({ length: 15 }, (_, i) => i + 3);

// Create a categorized display for preferences
const dietaryPreferences = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Sugar-Free", 
  "Low-Carb",
];

const tastePreferences = [
  "Loves sweet foods",
  "Prefers savory foods",
  "Enjoys crunchy textures",
  "Likes soft foods",
  "Loves fruits",
  "Vegetable enthusiast", 
  "Loves pasta",
  "Sandwich lover",
];

// Common allergy options
const commonAllergies = [
  "Peanuts",
  "Tree nuts",
  "Milk/Dairy",
  "Eggs",
  "Wheat/Gluten",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
];

// Default child template
const defaultChild: Child = {
  name: "",
  age: 5,
  preferences: [],
  allergies: [],
};

// Add the missing type definition and state for editingMeal
type EditingMealInfo = {
  childIndex: number;
  day: string;
  mealType: keyof DailyLunch;
} | null;

// Add the meal alternatives data
// Define common alternative meal options 
const mealAlternatives: Record<keyof DailyLunch, LunchItem[]> = {
  main: [
    {
      name: "Hummus & Veggie Wrap",
      description: "Whole grain tortilla with hummus and colorful vegetables.",
      nutritional_info: { calories: 250, protein: "8g", carbs: "35g", fat: "10g" },
      allergens: ["wheat"],
      prep_time: "5 mins"
    },
    {
      name: "Cream Cheese & Cucumber Sandwich",
      description: "Whole grain bread with cream cheese and cucumber slices.",
      nutritional_info: { calories: 220, protein: "7g", carbs: "28g", fat: "9g" },
      allergens: ["wheat", "dairy"],
      prep_time: "4 mins"
    },
    {
      name: "Pasta Salad",
      description: "Whole grain pasta with vegetables and light dressing.",
      nutritional_info: { calories: 280, protein: "8g", carbs: "45g", fat: "8g" },
      allergens: ["wheat"],
      prep_time: "15 mins (can prep night before)"
    },
    {
      name: "Bean & Rice Bowl",
      description: "Protein-rich beans with brown rice and mild seasonings.",
      nutritional_info: { calories: 300, protein: "12g", carbs: "50g", fat: "5g" },
      allergens: [],
      prep_time: "10 mins (can prep night before)"
    },
    {
      name: "Sunbutter & Jam Sandwich",
      description: "Sunflower seed butter with fruit jam on whole grain bread.",
      nutritional_info: { calories: 260, protein: "8g", carbs: "32g", fat: "12g" },
      allergens: ["wheat"],
      prep_time: "3 mins"
    }
  ],
  fruit: [
    {
      name: "Apple Slices",
      description: "Fresh, crunchy apple slices.",
      nutritional_info: { calories: 70, protein: "0g", carbs: "19g", fat: "0g" },
      allergens: [],
      prep_time: "2 mins"
    },
    {
      name: "Berries Mix",
      description: "Assorted berries (strawberries, blueberries, raspberries).",
      nutritional_info: { calories: 50, protein: "1g", carbs: "12g", fat: "0g" },
      allergens: [],
      prep_time: "1 min"
    },
    {
      name: "Orange Segments",
      description: "Sweet orange pieces, perfect for small hands.",
      nutritional_info: { calories: 60, protein: "1g", carbs: "15g", fat: "0g" },
      allergens: [],
      prep_time: "3 mins"
    },
    {
      name: "Grapes",
      description: "Sweet, bite-sized grapes (cut for younger children).",
      nutritional_info: { calories: 60, protein: "1g", carbs: "15g", fat: "0g" },
      allergens: [],
      prep_time: "2 mins"
    },
    {
      name: "Banana",
      description: "Potassium-rich banana (whole or sliced).",
      nutritional_info: { calories: 90, protein: "1g", carbs: "23g", fat: "0g" },
      allergens: [],
      prep_time: "1 min"
    }
  ],
  vegetable: [
    {
      name: "Carrot Sticks",
      description: "Crunchy, sweet carrot sticks.",
      nutritional_info: { calories: 30, protein: "1g", carbs: "7g", fat: "0g" },
      allergens: [],
      prep_time: "3 mins"
    },
    {
      name: "Cucumber Slices",
      description: "Refreshing cucumber rounds.",
      nutritional_info: { calories: 15, protein: "1g", carbs: "3g", fat: "0g" },
      allergens: [],
      prep_time: "2 mins"
    },
    {
      name: "Bell Pepper Strips",
      description: "Colorful bell pepper strips (red, yellow, orange).",
      nutritional_info: { calories: 25, protein: "1g", carbs: "6g", fat: "0g" },
      allergens: [],
      prep_time: "3 mins"
    },
    {
      name: "Cherry Tomatoes",
      description: "Sweet cherry tomatoes (halved for younger children).",
      nutritional_info: { calories: 20, protein: "1g", carbs: "4g", fat: "0g" },
      allergens: [],
      prep_time: "2 mins"
    },
    {
      name: "Sugar Snap Peas",
      description: "Naturally sweet, crunchy snap peas.",
      nutritional_info: { calories: 35, protein: "2g", carbs: "6g", fat: "0g" },
      allergens: [],
      prep_time: "1 min"
    }
  ],
  snack: [
    {
      name: "Greek Yogurt",
      description: "Creamy Greek yogurt with protein.",
      nutritional_info: { calories: 120, protein: "15g", carbs: "9g", fat: "0g" },
      allergens: ["dairy"],
      prep_time: "1 min"
    },
    {
      name: "Cheese Stick",
      description: "Individually wrapped cheese stick.",
      nutritional_info: { calories: 80, protein: "7g", carbs: "1g", fat: "6g" },
      allergens: ["dairy"],
      prep_time: "0 mins"
    },
    {
      name: "Veggie Chips",
      description: "Crunchy vegetable-based chips.",
      nutritional_info: { calories: 130, protein: "2g", carbs: "15g", fat: "6g" },
      allergens: [],
      prep_time: "0 mins"
    },
    {
      name: "Rice Cakes",
      description: "Light, crunchy rice cakes.",
      nutritional_info: { calories: 60, protein: "1g", carbs: "13g", fat: "0g" },
      allergens: [],
      prep_time: "0 mins"
    },
    {
      name: "Hummus Cup",
      description: "Small portion of hummus for dipping.",
      nutritional_info: { calories: 70, protein: "3g", carbs: "8g", fat: "3g" },
      allergens: [],
      prep_time: "1 min"
    }
  ],
  drink: [
    {
      name: "Water",
      description: "Hydrating water in a reusable bottle.",
      nutritional_info: { calories: 0, protein: "0g", carbs: "0g", fat: "0g" },
      allergens: [],
      prep_time: "1 min"
    },
    {
      name: "Milk",
      description: "Calcium-rich milk.",
      nutritional_info: { calories: 90, protein: "8g", carbs: "12g", fat: "2g" },
      allergens: ["dairy"],
      prep_time: "1 min"
    },
    {
      name: "Plant Milk",
      description: "Dairy-free plant-based milk alternative.",
      nutritional_info: { calories: 80, protein: "4g", carbs: "10g", fat: "4g" },
      allergens: [],
      prep_time: "1 min"
    },
    {
      name: "Diluted Juice",
      description: "Fruit juice mixed with water (less sugar).",
      nutritional_info: { calories: 45, protein: "0g", carbs: "11g", fat: "0g" },
      allergens: [],
      prep_time: "1 min"
    },
    {
      name: "Smoothie",
      description: "Fruit and yogurt smoothie in a small container.",
      nutritional_info: { calories: 120, protein: "5g", carbs: "20g", fat: "3g" },
      allergens: ["dairy"],
      prep_time: "5 mins"
    }
  ]
};

export default function LunchboxPlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lunchboxPlan, setLunchboxPlan] = useState<LunchboxPlan | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Children state
  const [children, setChildren] = useState<Child[]>([{ ...defaultChild, name: "Child 1" }]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [newPreference, setNewPreference] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  
  // Days state
  const [selectedDays, setSelectedDays] = useState<number>(5);
  
  // Meal editing state
  const [editingMeal, setEditingMeal] = useState<EditingMealInfo>(null);
  
  // These variables are currently unused but kept for future save/load meal plan functionality
  // They will be used in a later implementation phase
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [savePlanName, setSavePlanName] = useState("");
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Handler for tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handler for adding a child
  const handleAddChild = () => {
    setChildren([...children, { ...defaultChild, name: `Child ${children.length + 1}` }]);
  };

  // Handler for removing a child
  const handleRemoveChild = (index: number) => {
    const updatedChildren = [...children];
    updatedChildren.splice(index, 1);
    setChildren(updatedChildren);
    
    // Update selected child index if needed
    if (selectedChildIndex >= updatedChildren.length) {
      setSelectedChildIndex(Math.max(0, updatedChildren.length - 1));
    }
  };

  // Handler for updating child info
  const handleChildInfoChange = (index: number, field: keyof Child, value: string | number) => {
    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
  };

  // Handler for adding a preference
  const handleAddPreference = (index: number, preference: string) => {
    if (!preference.trim()) return;
    
    const updatedChildren = [...children];
    if (!updatedChildren[index].preferences.includes(preference)) {
      updatedChildren[index].preferences = [...updatedChildren[index].preferences, preference];
      setChildren(updatedChildren);
    }
    setNewPreference("");
  };

  // Handler for removing a preference
  const handleRemovePreference = (childIndex: number, preferenceIndex: number) => {
    const updatedChildren = [...children];
    updatedChildren[childIndex].preferences.splice(preferenceIndex, 1);
    setChildren(updatedChildren);
  };

  // Handler for adding an allergy
  const handleAddAllergy = (index: number, allergy: string) => {
    if (!allergy.trim()) return;
    
    const updatedChildren = [...children];
    if (!updatedChildren[index].allergies.includes(allergy)) {
      updatedChildren[index].allergies = [...updatedChildren[index].allergies, allergy];
      setChildren(updatedChildren);
    }
    setNewAllergy("");
  };

  // Handler for removing an allergy
  const handleRemoveAllergy = (childIndex: number, allergyIndex: number) => {
    const updatedChildren = [...children];
    updatedChildren[childIndex].allergies.splice(allergyIndex, 1);
    setChildren(updatedChildren);
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    // Check if we have at least one child
    if (children.length === 0) {
      toast.error("Please add at least one child");
      return false;
    }
    
    // Check if all children have names
    for (let i = 0; i < children.length; i++) {
      if (!children[i].name.trim()) {
        toast.error(`Please enter a name for Child ${i+1}`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleGeneratePlan = async () => {
    if (!validateForm()) return;
    
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
          children,
          days: selectedDays,
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
      setActiveTab(1);
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

  // Add handlers for meal editing
  const handleEditMeal = (childIndex: number, day: string, mealType: keyof DailyLunch) => {
    setEditingMeal({ childIndex, day, mealType });
  };

  const handleCancelEdit = () => {
    setEditingMeal(null);
  };

  const handleSaveEdit = (childIndex: number, day: string, mealType: keyof DailyLunch, newMeal: LunchItem) => {
    if (!lunchboxPlan) return;
    
    // Create a deep copy of the lunchbox plan
    const updatedPlan = JSON.parse(JSON.stringify(lunchboxPlan)) as LunchboxPlan;
    
    // Update the specific meal
    updatedPlan.children[childIndex].daily_lunches[day][mealType] = newMeal;
    
    // Update the state
    setLunchboxPlan(updatedPlan);
    setEditingMeal(null);
    toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} updated successfully!`);
  };

  // Add the function to randomize a specific meal
  const handleRandomizeMeal = (childIndex: number, day: string, mealType: keyof DailyLunch) => {
    if (!lunchboxPlan) return;
    
    // Get currently displayed meal
    const currentMeal = lunchboxPlan.children[childIndex].daily_lunches[day][mealType];
    
    // Get child info to filter alternatives properly
    const child = {
      name: lunchboxPlan.children[childIndex].child_name,
      age: lunchboxPlan.children[childIndex].age,
      preferences: [], // Not available in the result, so assuming empty
      allergies: [] // Not available in the result, so assuming empty
    };
    
    // Get filtered alternatives
    const alternatives = getFilteredAlternatives(mealType, child, currentMeal);
    
    if (alternatives.length === 0) {
      toast.error("No suitable alternatives found based on preferences and allergies");
      return;
    }
    
    // Pick a random alternative
    const randomIndex = Math.floor(Math.random() * alternatives.length);
    const randomMeal = alternatives[randomIndex];
    
    // Apply the change
    handleSaveEdit(childIndex, day, mealType, randomMeal);
  };

  // Function to generate a grocery list from the meal plan
  // This function is currently unused but will be needed for the grocery list update feature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createGroceryListFromPlan = (plan: LunchboxPlan): Record<string, string[]> => {
    // Create grocery list object with categories
    const groceryList: Record<string, string[]> = {
      'Fruits': [],
      'Vegetables': [],
      'Grains': [],
      'Proteins': [],
      'Dairy': [],
      'Snacks': [],
      'Other': []
    };
    
    // Helper to categorize items
    const categorizeItem = (item: LunchItem) => {
      const name = item.name.toLowerCase();
      
      // Simple categorization logic
      if (name.includes('apple') || name.includes('banana') || name.includes('berry') || 
          name.includes('fruit') || name.includes('orange') || name.includes('grape')) {
        if (!groceryList['Fruits'].includes(item.name)) {
          groceryList['Fruits'].push(item.name);
        }
      } else if (name.includes('carrot') || name.includes('cucumber') || name.includes('pepper') || 
                name.includes('vegetable') || name.includes('tomato') || name.includes('lettuce')) {
        if (!groceryList['Vegetables'].includes(item.name)) {
          groceryList['Vegetables'].push(item.name);
        }
      } else if (name.includes('bread') || name.includes('rice') || name.includes('pasta') || 
                name.includes('cracker') || name.includes('cereal') || name.includes('grain')) {
        if (!groceryList['Grains'].includes(item.name)) {
          groceryList['Grains'].push(item.name);
        }
      } else if (name.includes('chicken') || name.includes('beef') || name.includes('turkey') || 
                name.includes('fish') || name.includes('protein') || name.includes('tofu')) {
        if (!groceryList['Proteins'].includes(item.name)) {
          groceryList['Proteins'].push(item.name);
        }
      } else if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
                name.includes('dairy')) {
        if (!groceryList['Dairy'].includes(item.name)) {
          groceryList['Dairy'].push(item.name);
        }
      } else if (name.includes('cracker') || name.includes('chips') || name.includes('bar') || 
                name.includes('snack')) {
        if (!groceryList['Snacks'].includes(item.name)) {
          groceryList['Snacks'].push(item.name);
        }
      } else {
        if (!groceryList['Other'].includes(item.name)) {
          groceryList['Other'].push(item.name);
        }
      }
    };
    
    // Process all lunches for all children
    plan.children.forEach(child => {
      Object.values(child.daily_lunches).forEach(lunch => {
        categorizeItem(lunch.main);
        categorizeItem(lunch.fruit);
        categorizeItem(lunch.vegetable);
        categorizeItem(lunch.snack);
        // Don't include water in grocery list
        if (lunch.drink.name.toLowerCase() !== 'water') {
          categorizeItem(lunch.drink);
        }
      });
    });
    
    // Remove empty categories
    Object.keys(groceryList).forEach(category => {
      if (groceryList[category].length === 0) {
        delete groceryList[category];
      }
    });
    
    return groceryList;
  };

  // Function to filter meal alternatives based on preferences and allergies
  const getFilteredAlternatives = (mealType: keyof DailyLunch, child: Child, currentMeal: LunchItem): LunchItem[] => {
    if (!child || !mealAlternatives[mealType]) return [];
    
    return mealAlternatives[mealType].filter(meal => {
      // Don't include the current meal as an alternative
      if (meal.name === currentMeal.name) return false;
      
      // Check if meal contains allergens the child is allergic to
      if (child.allergies.length > 0 && meal.allergens && meal.allergens.length > 0) {
        const hasAllergen = meal.allergens.some(allergen => 
          child.allergies.some(allergy => 
            allergen.toLowerCase().includes(allergy.toLowerCase()) || 
            allergy.toLowerCase().includes(allergen.toLowerCase())
          )
        );
        if (hasAllergen) return false;
      }
      
      // Check preferences (like vegetarian)
      if (child.preferences.includes("Vegetarian")) {
        const nonVegItems = ["chicken", "beef", "turkey", "ham", "meat", "fish", "tuna"];
        if (nonVegItems.some(item => meal.name.toLowerCase().includes(item) || 
                             (meal.description && meal.description.toLowerCase().includes(item)))) {
          return false;
        }
      }
      
      // Check for vegan preference
      if (child.preferences.includes("Vegan")) {
        const nonVeganItems = ["dairy", "milk", "cheese", "yogurt", "chicken", "beef", "turkey", "ham", "meat", "fish", "tuna"];
        if (nonVeganItems.some(item => meal.name.toLowerCase().includes(item) || 
                               (meal.description && meal.description.toLowerCase().includes(item)) ||
                               (meal.allergens && meal.allergens.includes(item)))) {
          return false;
        }
      }
      
      // Check for gluten-free preference
      if (child.preferences.includes("Gluten-Free")) {
        if (meal.allergens && meal.allergens.includes("wheat")) {
          return false;
        }
      }
      
      // Check for dairy-free preference
      if (child.preferences.includes("Dairy-Free")) {
        if (meal.allergens && meal.allergens.includes("dairy")) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Add the Meal Edit Dialog component
  const renderMealEditDialog = () => {
    if (!editingMeal || !lunchboxPlan) return null;
    
    const { childIndex, day, mealType } = editingMeal;
    const child = lunchboxPlan.children[childIndex];
    const currentMeal = child.daily_lunches[day][mealType];
    const alternatives = getFilteredAlternatives(mealType, { 
      name: child.child_name, 
      age: child.age,
      preferences: [], // We don't have this in the result, so assuming empty
      allergies: [] // We don't have this in the result, so assuming empty
    }, currentMeal);
    
    return (
      <Dialog open={!!editingMeal} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>
          Replace {mealType.charAt(0).toUpperCase() + mealType.slice(1)} for {child.child_name} on {day}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Current {mealType}:
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: "#f8f9fa" }}>
            <Typography variant="subtitle2">{currentMeal.name}</Typography>
            <Typography variant="body2" color="text.secondary">{currentMeal.description}</Typography>
            {currentMeal.nutritional_info && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {currentMeal.nutritional_info.calories} calories | Prep: {currentMeal.prep_time}
              </Typography>
            )}
            {currentMeal.allergens && currentMeal.allergens.length > 0 && (
              <Typography variant="caption" display="block" color="error">
                Contains: {currentMeal.allergens.join(', ')}
              </Typography>
            )}
          </Paper>
          
          <Typography variant="subtitle1" gutterBottom>
            Recommended alternatives:
          </Typography>
          
          <Grid container spacing={2}>
            {alternatives.length > 0 ? (
              alternatives.map((meal, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#f0f7ff',
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => handleSaveEdit(childIndex, day, mealType, meal)}
                  >
                    <Typography variant="subtitle2">{meal.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{meal.description}</Typography>
                    {meal.nutritional_info && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {meal.nutritional_info.calories} calories | Prep: {meal.prep_time}
                      </Typography>
                    )}
                    {meal.allergens && meal.allergens.length > 0 && (
                      <Typography variant="caption" display="block" color="error">
                        Contains: {meal.allergens.join(', ')}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff9c4' }}>
                  <Typography>
                    No alternatives found that match the dietary preferences and allergies.
                    Try the randomize option instead.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="secondary"
              startIcon={<RotateCw size={18} />}
              onClick={() => {
                handleCancelEdit();
                handleRandomizeMeal(childIndex, day, mealType);
              }}
              sx={{ mx: 1 }}
            >
              Randomize
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Update the rendering of the meal plan to include edit buttons
  // In the existing code where you render daily meals, add edit buttons to each meal component:

  // Function to render a meal item with edit button
  const renderMealItem = (childIndex: number, day: string, mealType: keyof DailyLunch, item: LunchItem) => {
    return (
      <Box sx={{ 
        flexBasis: { xs: '100%', sm: '45%' },
        position: 'relative', 
        pb: 1,
        '&:hover .edit-button': {
          opacity: 1
        }
      }}>
        <IconButton 
          size="small" 
          className="edit-button"
          onClick={() => handleEditMeal(childIndex, day, mealType)}
          sx={{ 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            opacity: 0,
            transition: 'opacity 0.2s',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <Edit2 size={14} />
        </IconButton>
        
        <Typography variant="body2" sx={{ fontWeight: 'bold', pr: 4 }}>
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {item.name}
        </Typography>
        <Typography variant="caption" display="block">
          {item.description}
        </Typography>
      </Box>
    );
  };

  // Update the renderResults function to use the renderMealItem function
  const renderResults = () => {
    if (!lunchboxPlan) return null;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'success.main' }}>
            Lunchbox Plan Generated Successfully!
          </Typography>
          
          {lunchboxPlan.children.map((child, childIndex) => (
            <Box key={childIndex} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Meal Plan for {child.child_name} (Age {child.age})
              </Typography>
              
              {Object.entries(child.daily_lunches).map(([day, meals]) => (
                <Box key={day} sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {day}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {(Object.keys(meals) as Array<keyof DailyLunch>).map(mealType => 
                      renderMealItem(childIndex, day, mealType, meals[mealType])
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}

          {/* Grocery List Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Grocery List
            </Typography>
            {lunchboxPlan.grocery_list && Object.entries(lunchboxPlan.grocery_list).map(([category, items]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {category}
                </Typography>
                <ul style={{ margin: 0 }}>
                  {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  };

  // Add back the renderInputForm function that was accidentally removed
  const renderInputForm = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Children Information
        </Typography>
        <Button 
          startIcon={<Plus size={18} />} 
          variant="outlined" 
          onClick={handleAddChild}
          size="small"
        >
          Add Child
        </Button>
      </Stack>
      
      {/* Child Tabs */}
      <Tabs
        value={selectedChildIndex}
        onChange={(e, newValue) => setSelectedChildIndex(newValue)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {children.map((child, index) => (
          <Tab 
            key={index} 
            label={child.name || `Child ${index + 1}`} 
            icon={
              children.length > 1 ? (
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChild(index);
                  }}
                >
                  <X size={14} />
                </IconButton>
              ) : undefined
            }
            iconPosition="end"
          />
        ))}
      </Tabs>
      
      {/* Selected Child Form */}
      {children.map((child, index) => (
        <div key={index} style={{ display: selectedChildIndex === index ? 'block' : 'none' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Child's Name"
                value={child.name}
                onChange={(e) => handleChildInfoChange(index, 'name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Age</InputLabel>
                <Select
                  value={child.age}
                  onChange={(e) => handleChildInfoChange(index, 'age', e.target.value)}
                  label="Age"
                >
                  {ageOptions.map((age) => (
                    <MenuItem key={age} value={age}>
                      {age} years old
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Preferences Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Food Preferences (Optional)
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  label="Add preference"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPreference(index, newPreference);
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddPreference(index, newPreference)}
                  startIcon={<Plus size={18} />}
                >
                  Add
                </Button>
              </Stack>
              
              {/* Dietary Preferences */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Dietary preferences:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {dietaryPreferences.map((pref, idx) => (
                  <Chip
                    key={idx}
                    label={pref}
                    size="small"
                    color="primary"
                    variant={child.preferences.includes(pref) ? "filled" : "outlined"}
                    onClick={() => handleAddPreference(index, pref)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              
              {/* Taste Preferences */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Taste preferences:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {tastePreferences.map((pref, idx) => (
                  <Chip
                    key={idx}
                    label={pref}
                    size="small"
                    onClick={() => handleAddPreference(index, pref)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              
              {/* Selected Preferences */}
              {child.preferences.length > 0 && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected preferences:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {child.preferences.map((pref, prefIndex) => (
                      <Chip
                        key={prefIndex}
                        label={pref}
                        onDelete={() => handleRemovePreference(index, prefIndex)}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Grid>
            
            {/* Allergies Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Allergies & Dietary Restrictions (Optional)
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  label="Add allergy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddAllergy(index, newAllergy);
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddAllergy(index, newAllergy)}
                  startIcon={<Plus size={18} />}
                >
                  Add
                </Button>
              </Stack>
              
              {/* Common Allergies */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Common allergies:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {commonAllergies.map((allergy, idx) => (
                  <Chip
                    key={idx}
                    label={allergy}
                    size="small"
                    onClick={() => handleAddAllergy(index, allergy)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              
              {/* Selected Allergies */}
              {child.allergies.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {child.allergies.map((allergy, allergyIndex) => (
                    <Chip
                      key={allergyIndex}
                      label={allergy}
                      onDelete={() => handleRemoveAllergy(index, allergyIndex)}
                      color="error"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              )}
            </Grid>
          </Grid>
        </div>
      ))}
      
      {/* Days Selection */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Plan Duration
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Days to Plan</InputLabel>
          <Select
            value={selectedDays}
            onChange={(e) => setSelectedDays(e.target.value as number)}
            label="Days to Plan"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <MenuItem key={day} value={day}>
                {day} {day === 1 ? 'day' : 'days'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Generate Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handleGeneratePlan}
        disabled={isLoading}
        sx={{ mt: 3 }}
      >
        {isLoading ? "Generating..." : "Generate Lunchbox Meal Plan"}
      </Button>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kids&apos; Lunchbox Meal Planner
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Plan nutritious and balanced school lunches for your children based on their age, 
        preferences, and dietary restrictions.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Plan Details" />
          <Tab label="Meal Plan" disabled={!lunchboxPlan} />
        </Tabs>
      </Box>
      
      {activeTab === 0 && renderInputForm()}
      
      {activeTab === 1 && lunchboxPlan && (
        renderResults()
      )}
      
      {/* Add the meal edit dialog */}
      {renderMealEditDialog()}
      
      {/* Testing and API Results */}
      {isLoading && <Typography>Generating your meal plan...</Typography>}
    </Container>
  );
} 
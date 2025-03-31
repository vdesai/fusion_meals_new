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
  Tabs
} from "@mui/material";
import { Plus, X } from "lucide-react";
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

  // Render the Input Form
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
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Lunchbox Plan Generated Successfully!
          </Typography>
          
          {/* Child's Meal Plan */}
          {lunchboxPlan.children.map((child, childIndex) => (
            <Box 
              key={childIndex} 
              sx={{ 
                mt: 3, 
                p: 3, 
                border: '1px solid #e0e0e0', 
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Meal Plan for {child.child_name} ({child.age} years old)
              </Typography>
              
              {/* Days of Week */}
              {Object.entries(child.daily_lunches).map(([day, lunch]) => (
                <Box 
                  key={day} 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    border: '1px solid #f0f0f0', 
                    borderRadius: 1,
                    bgcolor: '#fafafa'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: 1
                    }}
                  >
                    {day}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {/* Main */}
                    <Box sx={{ flexBasis: '100%', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Main: {lunch.main.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lunch.main.description}
                      </Typography>
                      {lunch.main.nutritional_info && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          {lunch.main.nutritional_info.calories} calories | Prep: {lunch.main.prep_time}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Side Items */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%' }}>
                      {/* Fruit */}
                      <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Fruit: {lunch.fruit.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {lunch.fruit.description}
                        </Typography>
                      </Box>
                      
                      {/* Vegetable */}
                      <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Vegetable: {lunch.vegetable.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {lunch.vegetable.description}
                        </Typography>
                      </Box>
                      
                      {/* Snack */}
                      <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Snack: {lunch.snack.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {lunch.snack.description}
                        </Typography>
                      </Box>
                      
                      {/* Drink */}
                      <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Drink: {lunch.drink.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {lunch.drink.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Nutritional Summary */}
                    <Box 
                      sx={{ 
                        width: '100%', 
                        mt: 1, 
                        p: 1, 
                        bgcolor: '#f0f7ff', 
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        Nutritional Summary:
                      </Typography> Approximately {
                        (lunch.main.nutritional_info?.calories || 0) +
                        (lunch.fruit.nutritional_info?.calories || 0) +
                        (lunch.vegetable.nutritional_info?.calories || 0) +
                        (lunch.snack.nutritional_info?.calories || 0) +
                        (lunch.drink.nutritional_info?.calories || 0)
                      } calories
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
          
          {/* Grocery List */}
          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              border: '1px solid #e0e0e0', 
              borderRadius: 2,
              bgcolor: '#f9f9f9'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Grocery List
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.entries(lunchboxPlan.grocery_list).map(([category, items]) => (
                <Box 
                  key={category} 
                  sx={{ 
                    flexBasis: { xs: '100%', sm: '45%', md: '30%' },
                    p: 2,
                    bgcolor: 'white',
                    border: '1px solid #eaeaea',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    {category}
                  </Typography>
                  
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {items.map((item, index) => (
                      <Typography component="li" key={index} variant="body2">
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setActiveTab(0)}
            >
              Plan Another Week
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
} 
"use client";

import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { 
  Plus, 
  X, 
  Printer, 
  FileDown, 
  UserPlus, 
  ShoppingBasket,
  CalendarDays,
  Utensils
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Define interfaces
interface Child {
  name: string;
  age: number;
  preferences: string[];
  allergies: string[];
}

interface LunchItem {
  name: string;
  description: string;
  nutritional_info: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  allergens: string[];
  prep_time: string;
}

interface ChildLunchPlan {
  child_name: string;
  age: number;
  daily_lunches: {
    [day: string]: {
      main: LunchItem;
      fruit: LunchItem;
      vegetable: LunchItem;
      snack: LunchItem;
      drink: LunchItem;
    }
  };
}

interface LunchboxPlan {
  children: ChildLunchPlan[];
  grocery_list: {
    [category: string]: string[];
  };
}

// Common age options
const ageOptions = Array.from({ length: 15 }, (_, i) => i + 3);

// Common food preference options
const commonPreferences = [
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

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function LunchboxPlannerPage() {
  // State for managing tabs
  const [activeTab, setActiveTab] = useState(0);
  
  // State for children
  const [children, setChildren] = useState<Child[]>([{ ...defaultChild }]);
  const [newPreference, setNewPreference] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  
  // State for days
  const [selectedDays, setSelectedDays] = useState<number>(5);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  
  // State for lunchbox plan
  const [lunchboxPlan, setLunchboxPlan] = useState<LunchboxPlan | null>(null);
  
  // State for active plan tab
  const [activePlanTab, setActivePlanTab] = useState(0);
  const [activeChildTab, setActiveChildTab] = useState(0);
  
  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  // Handler for tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handler for plan tab changes
  const handlePlanTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActivePlanTab(newValue);
  };
  
  // Handler for child tab changes
  const handleChildTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveChildTab(newValue);
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

  // Handle generating lunchbox plan
  const handleGeneratePlan = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    console.log('🚀 Generating lunchbox plan...');
    
    try {
      // First, test if API routes are working at all
      console.log('📤 Testing API route with a simple request...');
      try {
        const testResponse = await fetch('/api/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      
      // Now try the real API endpoint
      console.log('📤 Making request to /api/generate-lunchbox-plan');
      console.log('📦 Request payload:', JSON.stringify({
        children,
        days: selectedDays,
      }, null, 2));
      
      const response = await fetch('/api/generate-lunchbox-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          children,
          days: selectedDays,
        }),
      });
      
      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ API response not OK:', response.status, response.statusText);
        
        try {
          const errorData = await response.json();
          console.error('❌ Error response:', errorData);
          toast.error(errorData.error || 'Failed to generate lunchbox plan');
        } catch (jsonError) {
          console.error('❌ Could not parse error response as JSON:', jsonError);
          toast.error('Failed to generate lunchbox plan');
        }
        
        // FALLBACK: If real API fails, generate a mock plan for testing UI
        console.log('🔄 API failed - generating mock data for UI testing');
        const mockPlan = generateMockLunchboxPlan(children, selectedDays);
        setLunchboxPlan(mockPlan);
        setActiveTab(1);
        toast.success("Generated test lunchbox plan (mock data - API unavailable)");
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Received lunchbox plan data');
      setLunchboxPlan(data);
      
      // Switch to Plan Results tab
      setActiveTab(1);
      toast.success("Lunchbox plan generated successfully!");
    } catch (error) {
      console.error('❌ Error in lunchbox plan generation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate lunchbox plan');
      
      // FOR DEBUGGING: Show toast with error details
      if (error instanceof Error) {
        console.error('Error details:', error.stack);
        
        // FALLBACK: Generate mock data if API fails completely
        console.log('🔄 Generating mock data after error');
        const mockPlan = generateMockLunchboxPlan(children, selectedDays);
        setLunchboxPlan(mockPlan);
        setActiveTab(1);
        toast.success("Generated test lunchbox plan (mock data - API unavailable)");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // TEMPORARY: Mock data generator for testing UI when API is unavailable
  const generateMockLunchboxPlan = (children: Child[], days: number): LunchboxPlan => {
    console.log('🔄 Generating mock lunchbox plan...');
    const mockPlan: LunchboxPlan = {
      children: [],
      grocery_list: {
        'Fruits': ['Apples', 'Bananas', 'Berries'],
        'Vegetables': ['Carrots', 'Cucumber', 'Bell peppers'],
        'Proteins': ['Turkey slices', 'Chicken breast'],
        'Grains': ['Whole grain bread', 'Tortillas/wraps'],
        'Dairy': ['Cheese', 'Yogurt'],
        'Snacks': ['Granola bars'],
        'Drinks': ['Water bottles'],
        'Other': ['Lunch containers']
      }
    };
    
    // Generate a mock plan for each child
    children.forEach(child => {
      const childPlan: ChildLunchPlan = {
        child_name: child.name,
        age: child.age,
        daily_lunches: {}
      };
      
      // Define mock lunch items
      const mainOptions = [
        {
          name: 'Turkey & Cheese Sandwich',
          description: 'Classic sandwich with lean turkey and cheese.',
          nutritional_info: {
            calories: 320,
            protein: '12g',
            carbs: '30g',
            fat: '10g'
          },
          allergens: ['dairy', 'wheat'],
          prep_time: '5 mins'
        },
        {
          name: 'PB&J Sandwich',
          description: 'Peanut butter and jelly sandwich on whole grain bread.',
          nutritional_info: {
            calories: 350,
            protein: '10g',
            carbs: '40g',
            fat: '12g'
          },
          allergens: ['peanuts', 'wheat'],
          prep_time: '3 mins'
        }
      ];
      
      const fruitOptions = [
        {
          name: 'Apple Slices',
          description: 'Fresh apple slices.',
          nutritional_info: {
            calories: 60,
            protein: '0g',
            carbs: '15g',
            fat: '0g'
          },
          allergens: [],
          prep_time: '2 mins'
        },
        {
          name: 'Banana',
          description: 'Whole banana.',
          nutritional_info: {
            calories: 105,
            protein: '1g',
            carbs: '27g',
            fat: '0g'
          },
          allergens: [],
          prep_time: '1 min'
        }
      ];
      
      const vegetableOptions = [
        {
          name: 'Carrot Sticks',
          description: 'Fresh carrot sticks.',
          nutritional_info: {
            calories: 35,
            protein: '1g',
            carbs: '8g',
            fat: '0g'
          },
          allergens: [],
          prep_time: '3 mins'
        },
        {
          name: 'Cucumber Slices',
          description: 'Fresh cucumber slices.',
          nutritional_info: {
            calories: 15,
            protein: '1g',
            carbs: '3g',
            fat: '0g'
          },
          allergens: [],
          prep_time: '2 mins'
        }
      ];
      
      const snackOptions = [
        {
          name: 'Granola Bar',
          description: 'Whole grain granola bar.',
          nutritional_info: {
            calories: 140,
            protein: '3g',
            carbs: '25g',
            fat: '5g'
          },
          allergens: ['nuts', 'wheat'],
          prep_time: '1 min'
        },
        {
          name: 'Yogurt',
          description: 'Fruit yogurt cup.',
          nutritional_info: {
            calories: 120,
            protein: '5g',
            carbs: '20g',
            fat: '2g'
          },
          allergens: ['dairy'],
          prep_time: '1 min'
        }
      ];
      
      const drinkOptions = [
        {
          name: 'Water',
          description: 'Fresh water in reusable bottle.',
          nutritional_info: {
            calories: 0,
            protein: '0g',
            carbs: '0g',
            fat: '0g'
          },
          allergens: [],
          prep_time: '1 min'
        },
        {
          name: 'Milk',
          description: '2% milk in thermos.',
          nutritional_info: {
            calories: 120,
            protein: '8g',
            carbs: '12g',
            fat: '5g'
          },
          allergens: ['dairy'],
          prep_time: '1 min'
        }
      ];
      
      // Create lunch for each day
      for (let i = 0; i < days; i++) {
        const day = daysOfWeek[i % 7];
        
        childPlan.daily_lunches[day] = {
          main: mainOptions[i % mainOptions.length],
          fruit: fruitOptions[i % fruitOptions.length],
          vegetable: vegetableOptions[i % vegetableOptions.length],
          snack: snackOptions[i % snackOptions.length],
          drink: drinkOptions[i % drinkOptions.length]
        };
      }
      
      mockPlan.children.push(childPlan);
    });
    
    return mockPlan;
  };

  // Set up react-to-print
  const handlePrint = useReactToPrint({
    // @ts-expect-error - type definitions in react-to-print are incorrect
    content: () => printRef.current,
    documentTitle: "Lunchbox Meal Plan",
    // @ts-expect-error - type definitions in react-to-print are incorrect
    onBeforeGetContent: async () => {
      toast.loading("Preparing to print...");
      return Promise.resolve();
    },
    onAfterPrint: async () => {
      toast.dismiss();
      toast.success("Print prepared successfully!");
      return Promise.resolve();
    },
  });

  // Handle downloading as PDF
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    toast.loading("Generating PDF...");

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Lunchbox_Meal_Plan.pdf");

      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error("Failed to generate PDF");
    }
  };

  // Render the Input Form
  const renderInputForm = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Children Information
        </Typography>
        <Button 
          startIcon={<UserPlus size={18} />} 
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
              
              {/* Common Preferences */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Common preferences:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {commonPreferences.map((pref, idx) => (
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

  // Render the Results
  const renderResults = () => {
    if (!lunchboxPlan) return null;
    
    return (
      <div>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Your Lunchbox Meal Plan
          </Typography>
          <Button 
            startIcon={<Printer size={18} />}
            variant="outlined"
            onClick={() => handlePrint()}
          >
            Print
          </Button>
          <Button 
            startIcon={<FileDown size={18} />}
            variant="outlined"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </Stack>
        
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={activePlanTab}
            onChange={handlePlanTabChange}
            variant="fullWidth"
          >
            <Tab icon={<Utensils size={18} />} label="MEAL PLANS" />
            <Tab icon={<ShoppingBasket size={18} />} label="GROCERY LIST" />
          </Tabs>
          
          {/* Meal Plans Tab */}
          <Box sx={{ display: activePlanTab === 0 ? 'block' : 'none', p: 3 }}>
            <Tabs
              value={activeChildTab}
              onChange={handleChildTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3 }}
            >
              {lunchboxPlan.children.map((child, index) => (
                <Tab key={index} label={child.child_name} />
              ))}
            </Tabs>
            
            <div ref={printRef}>
              {lunchboxPlan.children.map((child, childIndex) => (
                <div key={childIndex} style={{ display: activeChildTab === childIndex ? 'block' : 'none' }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Lunchbox Plan for {child.child_name} ({child.age} years old)
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {Object.keys(child.daily_lunches).slice(0, selectedDays).map((day) => (
                        <Grid item xs={12} md={selectedDays <= 3 ? 4 : 6} key={day}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" color="primary" gutterBottom>
                                {day}
                              </Typography>
                              
                              <Typography variant="subtitle1" gutterBottom>
                                Main: {child.daily_lunches[day].main.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {child.daily_lunches[day].main.description}
                              </Typography>
                              
                              <Divider sx={{ my: 1 }} />
                              
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <Typography variant="subtitle2">
                                    Fruit:
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {child.daily_lunches[day].fruit.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="subtitle2">
                                    Vegetable:
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {child.daily_lunches[day].vegetable.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="subtitle2">
                                    Snack:
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {child.daily_lunches[day].snack.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="subtitle2">
                                    Drink:
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {child.daily_lunches[day].drink.name}
                                  </Typography>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                  Total Calories: ~{
                                    child.daily_lunches[day].main.nutritional_info.calories +
                                    child.daily_lunches[day].fruit.nutritional_info.calories +
                                    child.daily_lunches[day].vegetable.nutritional_info.calories +
                                    child.daily_lunches[day].snack.nutritional_info.calories +
                                    child.daily_lunches[day].drink.nutritional_info.calories
                                  } kcal
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                  Prep Time: {child.daily_lunches[day].main.prep_time}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </div>
              ))}
            </div>
          </Box>
          
          {/* Grocery List Tab */}
          <Box sx={{ display: activePlanTab === 1 ? 'block' : 'none', p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grocery List for {selectedDays} {selectedDays === 1 ? 'day' : 'days'}
            </Typography>
            
            <Grid container spacing={2}>
              {Object.keys(lunchboxPlan.grocery_list).map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {category}
                      </Typography>
                      <List dense>
                        {lunchboxPlan.grocery_list[category].map((item, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setActiveTab(0)}
            startIcon={<CalendarDays size={18} />}
          >
            Plan Another Week
          </Button>
        </Box>
      </div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kids&apos; Lunchbox Meal Planner
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Plan nutritious and balanced school lunches for your children based on their age, 
        preferences, and dietary restrictions. Get personalized meal plans, grocery lists, 
        and preparation tips.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Plan Details" />
          <Tab label="Meal Plan" disabled={!lunchboxPlan} />
        </Tabs>
      </Box>
      
      {activeTab === 0 && renderInputForm()}
      {activeTab === 1 && renderResults()}
    </Container>
  );
} 
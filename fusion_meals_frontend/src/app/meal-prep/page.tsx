'use client';

import React, { useState } from 'react';
import { Utensils, Clock, RefreshCw } from 'lucide-react';

// Define types for API responses
interface CookingStep {
  step: number;
  description: string;
  time: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
  storage_instructions: string;
  reheating_instructions: string;
  nutrition_info: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  meal_category: string;
}

interface MealSchedule {
  [day: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

interface BatchPlanResult {
  shopping_list: {
    [category: string]: string[];
  };
  cooking_plan: {
    prep_steps: CookingStep[];
    total_active_time: string;
    total_passive_time: string;
  };
  recipes: Recipe[];
  weekly_schedule: MealSchedule;
  tips: string[];
}

interface RecipeInstruction {
  step: number;
  description: string;
  time: string;
  is_active: boolean;
}

interface RecipeResult {
  name: string;
  description: string;
  ingredients: string[];
  instructions: RecipeInstruction[];
  active_time: string;
  passive_time: string;
  total_time: string;
  nutrition_info: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  efficiency_tips: string[];
}

interface RecipesResult {
  recipes: RecipeResult[];
}

interface Transformation {
  name: string;
  description: string;
  leftover_ingredients_used: string[];
  additional_ingredients: string[];
  instructions: {
    step: number;
    description: string;
  }[];
  prep_time: string;
  cooking_time: string;
  customization_tips?: string[];
}

interface TransformResult {
  transformations: Transformation[];
  general_tips: string[];
}

export default function MealPrepAssistant() {
  // Common state
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Batch cooking plan state
  const [availableTime, setAvailableTime] = useState<number | null>(null);
  const [cookingDays, setCookingDays] = useState<string[]>([]);
  const [servings, setServings] = useState<number>(1);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<string>('intermediate');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [batchPlanResult, setBatchPlanResult] = useState<BatchPlanResult | null>(null);

  // Time-optimized recipes state
  const [maxActiveTime, setMaxActiveTime] = useState<number | null>(null);
  const [mealType, setMealType] = useState<string>('');
  const [recipesResult, setRecipesResult] = useState<RecipesResult | null>(null);

  // Leftover transformation state
  const [leftoverIngredients, setLeftoverIngredients] = useState<string[]>([]);
  const [originalDish, setOriginalDish] = useState<string>('');
  const [transformResult, setTransformResult] = useState<TransformResult | null>(null);

  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // Generate batch cooking plan
  const generateBatchCookingPlan = async () => {
    if (!availableTime) {
      alert('Please enter available time for meal prep');
      return;
    }
    
    if (cookingDays.length === 0) {
      alert('Please select at least one cooking day');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/meal-prep/batch-cooking-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          available_time: availableTime,
          cooking_days: cookingDays,
          servings,
          dietary_restrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
          preferences: preferences.length > 0 ? preferences : undefined,
          skill_level: skillLevel,
          equipment: equipment.length > 0 ? equipment : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBatchPlanResult(data);
    } catch (error) {
      console.error('Error generating batch cooking plan:', error);
      alert('Error generating batch cooking plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get time-optimized recipes
  const getTimeOptimizedRecipes = async () => {
    if (!maxActiveTime) {
      alert('Please enter maximum active cooking time');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/meal-prep/time-optimized-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_active_time: maxActiveTime,
          meal_type: mealType || undefined,
          servings,
          dietary_restrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
          preferences: preferences.length > 0 ? preferences : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRecipesResult(data);
    } catch (error) {
      console.error('Error getting time-optimized recipes:', error);
      alert('Error getting time-optimized recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Transform leftovers
  const transformLeftovers = async () => {
    if (leftoverIngredients.length === 0) {
      alert('Please enter at least one leftover ingredient');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/meal-prep/transform-leftovers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leftover_ingredients: leftoverIngredients,
          original_dish: originalDish || undefined,
          dietary_restrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
          preferences: preferences.length > 0 ? preferences : undefined,
          meal_type: mealType || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Ensure the data has the expected structure
      const safeData = {
        transformations: Array.isArray(data.transformations) ? data.transformations : [],
        general_tips: Array.isArray(data.general_tips) ? data.general_tips : []
      };
      
      // Log the data for debugging
      console.log('Leftover transformation response:', data);
      console.log('Processed transformation data:', safeData);
      
      setTransformResult(safeData);
    } catch (error) {
      console.error('Error transforming leftovers:', error);
      alert('Error transforming leftovers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Allow adding preferences
  const handleAddPreference = (preference: string) => {
    if (preference && !preferences.includes(preference)) {
      setPreferences([...preferences, preference]);
    }
  };

  // Add equipment
  const handleAddEquipment = (item: string) => {
    if (item && !equipment.includes(item)) {
      setEquipment([...equipment, item]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center">Smart Meal Prep Assistant</h1>
      <h2 className="text-xl text-gray-600 dark:text-gray-400 text-center mt-2 mb-8">
        Streamlined solutions for busy professionals to save time in the kitchen
      </h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex -mb-px">
          <button
            onClick={() => handleTabChange(0)}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 0
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <Utensils className="h-5 w-5 mb-1" />
              <span>Batch Cooking Plan</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 1
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <Clock className="h-5 w-5 mb-1" />
              <span>Time-Optimized Recipes</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange(2)}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 2
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <RefreshCw className="h-5 w-5 mb-1" />
              <span>Leftover Transformation</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Batch Cooking Plan Tab */}
      {activeTab === 0 && (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Create Your Batch Cooking Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Available Time (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={availableTime || ''}
                  onChange={(e) => setAvailableTime(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="How much time do you have?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Available Cooking Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        if (cookingDays.includes(day)) {
                          setCookingDays(cookingDays.filter(d => d !== day));
                        } else {
                          setCookingDays([...cookingDays, day]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        cookingDays.includes(day)
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Servings
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={servings}
                  onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : 1)}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skill Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dietary Restrictions
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={dietaryRestrictions[0] || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDietaryRestrictions([e.target.value]);
                    } else {
                      setDietaryRestrictions([]);
                    }
                  }}
                >
                  <option value="">None</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                  <option value="keto">Keto</option>
                  <option value="low-carb">Low-Carb</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Food Preferences
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preferences.map((preference, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center"
                  >
                    {preference}
                    <button 
                      onClick={() => setPreferences(preferences.filter((_, i) => i !== index))}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add a preference (e.g., high-protein, quick meals)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPreference((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add a preference"]') as HTMLInputElement;
                    handleAddPreference(input.value);
                    input.value = '';
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-r-md"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kitchen Equipment
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {equipment.map((item, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center"
                  >
                    {item}
                    <button 
                      onClick={() => setEquipment(equipment.filter((_, i) => i !== index))}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add equipment (e.g., slow cooker, air fryer)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddEquipment((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add equipment"]') as HTMLInputElement;
                    handleAddEquipment(input.value);
                    input.value = '';
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-r-md"
                >
                  Add
                </button>
              </div>
            </div>
            <button
              onClick={generateBatchCookingPlan}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Generating Plan...' : 'Generate Batch Cooking Plan'}
            </button>
          </div>
          
          {batchPlanResult && (
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4">Your Batch Cooking Plan</h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                {/* Shopping List */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">🛒 Shopping List</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(batchPlanResult.shopping_list).map(([category, items]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <h5 className="font-medium capitalize mb-2">{category}</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(items) && items.map((item, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Cooking Plan */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">👨‍🍳 Cooking Plan</h4>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Total Active Time: {batchPlanResult.cooking_plan.total_active_time}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Total Passive Time: {batchPlanResult.cooking_plan.total_passive_time}
                    </span>
                  </div>
                  <ol className="border rounded-lg divide-y">
                    {batchPlanResult.cooking_plan.prep_steps.map((step) => (
                      <li key={step.step} className="p-3 flex items-start">
                        <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                          {step.step}
                        </span>
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                          <span className="text-sm text-gray-500 mt-1">{step.time}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                
                {/* Recipes */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">🍲 Recipes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batchPlanResult.recipes.map((recipe, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium text-lg mb-2">{recipe.name}</h5>
                        <div className="mb-2">
                          <span className="text-sm font-medium">Ingredients:</span>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {recipe.ingredients.map((ingredient, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm mb-2">
                          <p><span className="font-medium">Storage: </span>{recipe.storage_instructions}</p>
                          <p><span className="font-medium">Reheating: </span>{recipe.reheating_instructions}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Nutrition: </span>
                          {recipe.nutrition_info.calories} cal | Protein: {recipe.nutrition_info.protein} | Carbs: {recipe.nutrition_info.carbs} | Fat: {recipe.nutrition_info.fat}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Weekly Schedule */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">📅 Weekly Schedule</h4>
                  <div className="border rounded-lg divide-y">
                    {Object.entries(batchPlanResult.weekly_schedule).map(([day, meals]) => (
                      <div key={day} className="p-3">
                        <h5 className="font-medium mb-2">{day}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          {meals.breakfast && (
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                              <span className="font-medium">Breakfast: </span>{meals.breakfast}
                            </div>
                          )}
                          {meals.lunch && (
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <span className="font-medium">Lunch: </span>{meals.lunch}
                            </div>
                          )}
                          {meals.dinner && (
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                              <span className="font-medium">Dinner: </span>{meals.dinner}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tips */}
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">💡 Tips</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {batchPlanResult.tips.map((tip, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {!batchPlanResult && loading === false && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">Ready to Create Your Meal Prep Plan</h3>
              <p className="text-indigo-600 dark:text-indigo-400">
                Fill out the form above and click &quot;Generate Batch Cooking Plan&quot; to get a personalized meal prep plan optimized for your schedule.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Time-Optimized Recipes Tab */}
      {activeTab === 1 && (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Find Quick Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Active Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={maxActiveTime || ''}
                  onChange={(e) => setMaxActiveTime(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="How much active time can you spend?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meal Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>
            <button
              onClick={getTimeOptimizedRecipes}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Finding Recipes...' : 'Find Quick Recipes'}
            </button>
          </div>
          
          {recipesResult && (
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4">Quick Recipe Ideas</h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="space-y-8">
                  {recipesResult.recipes.map((recipe, index) => (
                    <div key={index} className="border-b pb-8 last:border-0">
                      <h4 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{recipe.name}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{recipe.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Active Time: {recipe.active_time}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Passive Time: {recipe.passive_time}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          Total Time: {recipe.total_time}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium mb-2">Ingredients</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {recipe.ingredients.map((ingredient, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Nutrition Information</h5>
                          <p className="text-gray-700 dark:text-gray-300">
                            Calories: {recipe.nutrition_info.calories}<br />
                            Protein: {recipe.nutrition_info.protein}<br />
                            Carbs: {recipe.nutrition_info.carbs}<br />
                            Fat: {recipe.nutrition_info.fat}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Instructions</h5>
                        <ol className="border rounded-lg divide-y">
                          {recipe.instructions.map((step) => (
                            <li key={step.step} className="p-3 flex items-start">
                              <span className={`rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 ${
                                step.is_active ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {step.step}
                              </span>
                              <div>
                                <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-sm text-gray-500">{step.time}</span>
                                  {step.is_active ? (
                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">Active</span>
                                  ) : (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Passive</span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Efficiency Tips</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {recipe.efficiency_tips.map((tip, i) => (
                            <li key={i} className="text-gray-700 dark:text-gray-300">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {!recipesResult && loading === false && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">Ready to Find Quick Recipes</h3>
              <p className="text-indigo-600 dark:text-indigo-400">
                Fill out the form above and click &quot;Find Quick Recipes&quot; to discover recipes that fit within your time constraints.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Leftover Transformation Tab */}
      {activeTab === 2 && (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Transform Your Leftovers</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Leftover Ingredients
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter ingredients separated by commas"
                value={leftoverIngredients.join(', ')}
                onChange={(e) => setLeftoverIngredients(e.target.value.split(',').map(item => item.trim()).filter(Boolean))}
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Original Dish (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={originalDish}
                onChange={(e) => setOriginalDish(e.target.value)}
                placeholder="What was the original dish?"
              />
            </div>
            <button
              onClick={transformLeftovers}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Transforming...' : 'Transform Leftovers'}
            </button>
          </div>
          
          {transformResult && Array.isArray(transformResult.transformations) && transformResult.transformations.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4">Leftover Transformation Ideas</h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="space-y-8">
                  {transformResult.transformations.map((transform, index) => (
                    <div key={index} className="border-b pb-8 last:border-0">
                      <h4 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{transform.name}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{transform.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Prep Time: {transform.prep_time}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Cooking Time: {transform.cooking_time}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium mb-2">Leftover Ingredients Used</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {transform.leftover_ingredients_used && transform.leftover_ingredients_used.map((ingredient, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Additional Ingredients Needed</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {transform.additional_ingredients && transform.additional_ingredients.map((ingredient, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Instructions</h5>
                        <ol className="border rounded-lg divide-y">
                          {transform.instructions && transform.instructions.map((step) => (
                            <li key={step.step} className="p-3 flex items-start">
                              <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                                {step.step}
                              </span>
                              <div>
                                <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      {transform.customization_tips && transform.customization_tips.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Customization Tips</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {transform.customization_tips.map((tip, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {transformResult && transformResult.general_tips && transformResult.general_tips.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">General Tips</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {transformResult.general_tips.map((tip, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : transformResult ? (
            <div className="mt-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">No Transformation Ideas Found</h3>
                <p className="text-indigo-600 dark:text-indigo-400">
                  We couldn&apos;t find any transformation ideas for your leftovers. Try adding more ingredients or a different combination.
                </p>
              </div>
            </div>
          ) : loading === false && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">Ready to Transform Your Leftovers</h3>
              <p className="text-indigo-600 dark:text-indigo-400">
                Enter your leftover ingredients above and click &quot;Transform Leftovers&quot; to get creative new recipe ideas.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

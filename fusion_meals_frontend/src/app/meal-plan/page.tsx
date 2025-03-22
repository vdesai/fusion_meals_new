'use client';

import { useState } from 'react';
import { CalendarDays, Utensils, User, XCircle, Sparkles, AlertTriangle, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Define interface for the meal plan response
interface Meal {
  name: string;
  recipe_link: string;
  ingredients: string[];
  prep_time: string;
  cook_time: string;
}

interface DayPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

interface MealPlan {
  days: DayPlan[];
  grocery_list: {
    [category: string]: string[];
  };
}

export default function MealPlanPage() {
  const [days, setDays] = useState<number>(3);
  const [people, setPeople] = useState<number>(2);
  const [dietType, setDietType] = useState<string>('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState<string>('');
  const [newExclusion, setNewExclusion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [activeDay, setActiveDay] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'plan' | 'grocery'>('plan');
  const [error, setError] = useState<string | null>(null);

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      setPreferences([...preferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const addExclusion = () => {
    if (newExclusion.trim() && !exclude.includes(newExclusion.trim())) {
      setExclude([...exclude, newExclusion.trim()]);
      setNewExclusion('');
    }
  };

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter(p => p !== pref));
  };

  const removeExclusion = (excl: string) => {
    setExclude(exclude.filter(e => e !== excl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    toast.loading(
      "Generating your meal plan... This may take up to 60 seconds because we're using Render's free tier which has cold starts.",
      { duration: 15000 }
    );

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days,
          people,
          diet_type: dietType || undefined,
          preferences: preferences.length > 0 ? preferences : undefined,
          exclude: exclude.length > 0 ? exclude : undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 504) {
          throw new Error(
            "Request timed out. Our backend is hosted on Render's free tier which has cold starts. Please try again."
          );
        }
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      setMealPlan(data);
      setActiveDay(0);
      setActiveTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success("Your meal plan is ready!");
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError('Error generating meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-yellow-500 mr-2" />
        AI Meal Plan Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Let our AI create a personalized meal plan tailored to your preferences and dietary needs
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 text-indigo-500 mr-2" />
            Customize Your AI Meal Plan
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="days">
                  Number of Days
                </label>
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    id="days"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 14].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'day' : 'days'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="people">
                  Number of People
                </label>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    id="people"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="diet-type">
                Diet Type
              </label>
              <div className="flex items-center">
                <Utensils className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  id="diet-type"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="">Any</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="low-carb">Low-Carb</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="dairy-free">Dairy-Free</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Food Preferences</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  className="flex-grow p-2 border rounded-l-md bg-white dark:bg-gray-700"
                  placeholder="E.g., Italian, spicy, high-protein"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                />
                <button
                  type="button"
                  onClick={addPreference}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <div key={pref} className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    <span className="text-sm">{pref}</span>
                    <button 
                      type="button" 
                      onClick={() => removePreference(pref)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Exclude Ingredients</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  className="flex-grow p-2 border rounded-l-md bg-white dark:bg-gray-700"
                  placeholder="E.g., nuts, shellfish, gluten"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclusion())}
                />
                <button
                  type="button"
                  onClick={addExclusion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {exclude.map((excl) => (
                  <div key={excl} className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    <span className="text-sm">{excl}</span>
                    <button 
                      type="button" 
                      onClick={() => removeExclusion(excl)}
                      className="ml-1 text-red-600 hover:text-red-800"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Your Meal Plan...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Meal Plan
                </div>
              )}
            </button>
          </form>
        </div>
        
        {mealPlan ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('plan')}
                className={`px-4 py-2 ${activeTab === 'plan' ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-px font-medium' : 'text-gray-500'}`}
              >
                Meal Plan
              </button>
              <button
                onClick={() => setActiveTab('grocery')}
                className={`px-4 py-2 ${activeTab === 'grocery' ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-px font-medium' : 'text-gray-500'}`}
              >
                Grocery List
              </button>
            </div>
            
            {activeTab === 'plan' ? (
              <>
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
                    Your {days}-Day AI Meal Plan
                  </h2>
                  <div className="flex space-x-1">
                    {mealPlan.days.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveDay(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activeDay === index
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Day {activeDay + 1}</h3>
                  
                  <div className="space-y-4">
                    {/* Breakfast */}
                    <div className="border rounded-md p-3 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-indigo-600 mb-2">Breakfast</h4>
                      <div className="pl-2 border-l-2 border-indigo-200">
                        <p className="font-medium">{mealPlan.days[activeDay].breakfast.name}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-3 mt-1">
                          <span>Prep: {mealPlan.days[activeDay].breakfast.prep_time}</span>
                          <span>Cook: {mealPlan.days[activeDay].breakfast.cook_time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lunch */}
                    <div className="border rounded-md p-3 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-indigo-600 mb-2">Lunch</h4>
                      <div className="pl-2 border-l-2 border-indigo-200">
                        <p className="font-medium">{mealPlan.days[activeDay].lunch.name}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-3 mt-1">
                          <span>Prep: {mealPlan.days[activeDay].lunch.prep_time}</span>
                          <span>Cook: {mealPlan.days[activeDay].lunch.cook_time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dinner */}
                    <div className="border rounded-md p-3 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-indigo-600 mb-2">Dinner</h4>
                      <div className="pl-2 border-l-2 border-indigo-200">
                        <p className="font-medium">{mealPlan.days[activeDay].dinner.name}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-3 mt-1">
                          <span>Prep: {mealPlan.days[activeDay].dinner.prep_time}</span>
                          <span>Cook: {mealPlan.days[activeDay].dinner.cook_time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Snacks */}
                    {mealPlan.days[activeDay].snacks.length > 0 && (
                      <div className="border rounded-md p-3 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-indigo-600 mb-2">Snacks</h4>
                        <div className="space-y-2">
                          {mealPlan.days[activeDay].snacks.map((snack, i) => (
                            <div key={i} className="pl-2 border-l-2 border-indigo-200">
                              <p className="font-medium">{snack.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
                  AI-Generated Grocery List
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(mealPlan.grocery_list).map(([category, items]) => (
                    <div key={category} className="border rounded-md p-3 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-indigo-600 mb-2">{category}</h3>
                      <ul className="pl-2 space-y-1">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <input 
                              type="checkbox" 
                              id={`item-${category}-${index}`} 
                              className="mr-2 h-4 w-4 text-indigo-600"
                            />
                            <label htmlFor={`item-${category}-${index}`}>{item}</label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <Sparkles className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">AI Meal Plan Generator</h2>
              <p className="text-gray-500 mb-4">Our AI chef will create a personalized meal plan based on your preferences, dietary needs, and household size.</p>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md text-left">
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    AI-generated meals for your specified number of days
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Personalized to your dietary preferences and restrictions
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Complete grocery list organized by category
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Balanced nutrition across your entire meal plan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          How Our AI Creates Your Meal Plan
        </h2>
        <p className="text-indigo-600 dark:text-indigo-400 mb-3">
          Our advanced AI analyzes thousands of recipes to create a personalized meal plan that meets your specific needs and preferences.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
            <div className="font-medium mb-2 text-indigo-600">Personalized Selection</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">The AI considers your dietary preferences, restrictions, and household size to select appropriate recipes.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
            <div className="font-medium mb-2 text-indigo-600">Nutritional Balance</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Each meal plan is designed to provide balanced nutrition throughout the day and across the entire plan period.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
            <div className="font-medium mb-2 text-indigo-600">Smart Grocery Lists</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">The AI consolidates ingredients across recipes to create an efficient shopping list organized by store departments.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
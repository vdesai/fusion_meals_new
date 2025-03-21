'use client';
import { useState } from 'react';
import MealPlanCard from '@/components/MealPlanCard';
import ShareButtons from '@/components/ShareButtons';
import toast from 'react-hot-toast';

export default function MealPlanPage() {
  const [diet, setDiet] = useState('Balanced');
  const [preferences, setPreferences] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const generateMealPlan = async () => {
    setLoading(true);
    setApiStatus('loading');
    let mealPlanData = null;
    const toastId = toast.loading('Generating your meal plan...');
    
    try {
      console.log('Submitting meal plan request for diet:', diet, 'preferences:', preferences); 
      
      // Set up abort controller with a more aggressive timeout for Render's limitations
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout
      
      try {
        const response = await fetch('/api/generate-meal-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            days: 7,
            people: 4,
            diet_type: diet,
            preferences: preferences ? [preferences] : [],
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(`API response error: ${response.status}`);
          throw new Error(`API response error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received API response successfully'); 
        
        // The response format is different than the backend directly
        if (data && data.days) {
          // For compatibility with MealPlanCard, convert structured data back to markdown
          const markdownMealPlan = convertToMarkdown(data, diet);
          setMealPlan(markdownMealPlan);
          mealPlanData = markdownMealPlan;
          setApiStatus('success');
          toast.dismiss(toastId);
          toast.success('Meal Plan generated successfully! 🎉');
        } else if (typeof data === 'string') {
          // Direct markdown response
          setMealPlan(data);
          mealPlanData = data;
          setApiStatus('success');
          toast.dismiss(toastId);
          toast.success('Meal Plan generated successfully! 🎉');
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (apiError: Error | DOMException | unknown) {
        console.error('API route error:', apiError);
        clearTimeout(timeoutId);
        
        // Check if this was a timeout error
        if (apiError instanceof DOMException && apiError.name === 'AbortError') {
          console.log('Request timed out - using mock data');
          toast.dismiss(toastId);
          toast.error('The meal plan is taking too long to generate. Using a demo plan instead.');
        } else {
          toast.dismiss(toastId);
          toast.error('Could not connect to the meal plan service. Using a demo plan instead.');
        }
        
        // If API call fails, fall back to mock data
        const mockData = generateMockMealPlan(diet, preferences);
        setMealPlan(mockData);
        mealPlanData = mockData;
        setApiStatus('error');
      }
    } catch (error) {
      console.error('Top-level error:', error);
      toast.dismiss(toastId);
      
      // Final fallback to ensure we always show something
      const mockData = generateMockMealPlan(diet, preferences);
      setMealPlan(mockData);
      mealPlanData = mockData;
      setApiStatus('error');
      toast.error('Something went wrong. Using demo meal plan instead.');
    } finally {
      setLoading(false);
      
      // If we somehow still don't have data, use mock as a last resort
      if (!mealPlanData) {
        const mockData = generateMockMealPlan(diet, preferences);
        setMealPlan(mockData);
        toast.error('No meal plan data received. Using demo instead.');
      }
    }
  };

  // Function to generate a mock meal plan with customizations based on user inputs
  const generateMockMealPlan = (dietType: string, userPreferences: string) => {
    const dietPrefix = dietType !== 'Balanced' ? `${dietType} ` : '';
    const prefSuffix = userPreferences ? ` with ${userPreferences} flavors` : '';
    
    // Customize meal names based on diet type and preferences
    let breakfastOptions = [
      `${dietPrefix}Overnight oats with berries and nuts`,
      `${dietPrefix}Whole grain toast with avocado${prefSuffix}`,
      `${dietPrefix}Greek yogurt parfait`,
      `${dietPrefix}Fruit and grain bowl${prefSuffix}`
    ];
    
    let lunchOptions = [
      `${dietPrefix}Quinoa salad with roasted vegetables${prefSuffix}`,
      `${dietPrefix}Grain bowl with seasonal vegetables${prefSuffix}`,
      `${dietPrefix}Hearty soup and whole grain bread`,
      `${dietPrefix}Mediterranean wrap with hummus${prefSuffix}`
    ];
    
    let dinnerOptions = [
      `${dietPrefix}Roasted vegetable${prefSuffix} pasta`,
      `${dietPrefix}Stir-fried tofu with broccoli and brown rice${prefSuffix}`,
      `${dietPrefix}Bean and vegetable${prefSuffix} curry with rice`,
      `${dietPrefix}Stuffed bell peppers with quinoa${prefSuffix}`
    ];
    
    let snackOptions = [
      `${dietPrefix}Fruit with nut butter`,
      `${dietPrefix}Vegetable sticks with hummus`,
      `${dietPrefix}Trail mix with dried fruits and nuts`,
      `${dietPrefix}Yogurt with honey${prefSuffix}`
    ];

    // For specific diets, specialize the options
    if (dietType.toLowerCase() === 'vegetarian') {
      dinnerOptions = [...dinnerOptions, 'Eggplant Parmesan', 'Mushroom Risotto'];
    } else if (dietType.toLowerCase() === 'vegan') {
      breakfastOptions = ['Tofu Scramble', 'Chia Pudding', 'Acai Bowl', 'Avocado Toast'];
      dinnerOptions = ['Vegan Curry', 'Chickpea Pasta', 'Vegetable Stew', 'Stuffed Bell Peppers'];
    } else if (dietType.toLowerCase() === 'keto') {
      breakfastOptions = ['Bacon and Eggs', 'Avocado and Salmon', 'Keto Smoothie', 'Cheese Omelette'];
      lunchOptions = ['Cobb Salad', 'Tuna Lettuce Wraps', 'Cauliflower Soup', 'Zucchini Boats'];
      dinnerOptions = ['Steak with Asparagus', 'Salmon with Broccoli', 'Stuffed Mushrooms', 'Chicken Alfredo with Zoodles'];
      snackOptions = ['Cheese Crisps', 'Deviled Eggs', 'Pork Rinds', 'Keto Fat Bombs'];
    }
    
    // If user has specified preferences, tailor some meals to that
    if (userPreferences) {
      // Add some meals that specifically mention the user's preferences
      if (userPreferences.toLowerCase().includes('indian')) {
        breakfastOptions.push('Masala Dosa with Coconut Chutney');
        lunchOptions.push('Chickpea Curry with Basmati Rice');
        dinnerOptions.push('Vegetable Biryani with Raita');
        snackOptions.push('Samosas with Mint Chutney');
      } else if (userPreferences.toLowerCase().includes('mexican')) {
        breakfastOptions.push('Breakfast Burrito with Salsa');
        lunchOptions.push('Black Bean and Corn Quesadillas');
        dinnerOptions.push('Vegetable Fajitas with Guacamole');
        snackOptions.push('Tortilla Chips with Fresh Salsa');
      } else if (userPreferences.toLowerCase().includes('mediterranean')) {
        breakfastOptions.push('Greek Yogurt with Honey and Figs');
        lunchOptions.push('Mediterranean Chickpea Salad');
        dinnerOptions.push('Falafel Pita with Tzatziki');
        snackOptions.push('Hummus with Olive Oil and Pita');
      }
    }

    // Days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Generate the meal plan
    let mealPlanText = `# ${dietType} Meal Plan for 7 Days${userPreferences ? ` (${userPreferences})` : ''}\n\n`;
    
    daysOfWeek.forEach(day => {
      mealPlanText += `## ${day}\n`;
      mealPlanText += `- **Breakfast**: ${breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]}\n`;
      mealPlanText += `- **Lunch**: ${lunchOptions[Math.floor(Math.random() * lunchOptions.length)]}\n`;
      mealPlanText += `- **Dinner**: ${dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]}\n`;
      mealPlanText += `- **Snack**: ${snackOptions[Math.floor(Math.random() * snackOptions.length)]}\n\n`;
    });
    
    return mealPlanText;
  };

  // Define types for the meal plan structure
  interface Meal {
    name: string;
    recipe_link?: string;
    ingredients?: string[];
    prep_time?: string;
    cook_time?: string;
  }

  interface DayPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  }

  interface MealPlanStructure {
    days: DayPlan[];
    grocery_list?: Record<string, string[]>;
  }
  
  // Helper function to convert structured meal plan to markdown format
  const convertToMarkdown = (mealPlan: MealPlanStructure, dietType: string): string => {
    if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) {
      return generateMockMealPlan(dietType, preferences);
    }
    
    let markdown = `# ${dietType} Meal Plan for 7 Days${preferences ? ` (${preferences})` : ''}\n\n`;
    
    // Days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Convert each day to markdown
    mealPlan.days.forEach((day: DayPlan, index: number) => {
      const dayName = daysOfWeek[index % daysOfWeek.length];
      markdown += `## ${dayName}\n`;
      
      if (day.breakfast) {
        markdown += `- **Breakfast**: ${day.breakfast.name}\n`;
      }
      
      if (day.lunch) {
        markdown += `- **Lunch**: ${day.lunch.name}\n`;
      }
      
      if (day.dinner) {
        markdown += `- **Dinner**: ${day.dinner.name}\n`;
      }
      
      if (day.snacks && day.snacks.length > 0) {
        day.snacks.forEach((snack: Meal) => {
          markdown += `- **Snack**: ${snack.name}\n`;
        });
      }
      
      markdown += '\n';
    });
    
    return markdown;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">📅 7-Day Meal Planner</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option>Balanced</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Low-Carb</option>
            <option>High-Protein</option>
            <option>Keto</option>
            <option>Heart-Healthy</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Style or Restrictions</label>
          <input
            type="text"
            placeholder="Example: Indian, Mediterranean, no dairy, gluten-free"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <button
          onClick={generateMealPlan}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </div>
      
      {apiStatus === 'error' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Using demo meal plan. The backend service is currently unavailable or slow to respond.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {mealPlan && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-xl mb-4">🍽️ Generated Meal Plan:</h3>
          <MealPlanCard mealPlan={mealPlan} />

          {/* Social Sharing Section */}
          <div className="mt-6 border-t pt-4">
            <h4 className="text-lg font-medium mb-2">Share this meal plan:</h4>
            <ShareButtons
              url={typeof window !== 'undefined' ? window.location.href : "https://fusion-meals.vercel.app/meal-plans"} 
              title={`📅 Check out this awesome ${diet} 7-Day Meal Plan from Fusion Meals!`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

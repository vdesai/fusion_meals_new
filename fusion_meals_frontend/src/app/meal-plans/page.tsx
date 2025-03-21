'use client';
import { useState } from 'react';
import axios from 'axios';
import MealPlanCard from '@/components/MealPlanCard';
import ShareButtons from '@/components/ShareButtons';
import toast from 'react-hot-toast';

export default function MealPlanPage() {
  const [diet, setDiet] = useState('Balanced');
  const [preferences, setPreferences] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      // Use the local Next.js API route instead of calling the backend directly
      const response = await axios.post('/api/generate-meal-plan', {
        days: 7,
        people: 4,
        diet_type: diet,
        preferences: [preferences],
      });
      
      // The response format is different than the backend directly
      if (response.data && response.data.days) {
        // For compatibility with MealPlanCard, convert structured data back to markdown
        const markdownMealPlan = convertToMarkdown(response.data, diet);
        setMealPlan(markdownMealPlan);
      } else {
        setMealPlan(response.data);
      }
      
      toast.success('Meal Plan generated successfully! 🎉');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // Use a mock meal plan when API is unavailable
      const mockMealPlan = generateMockMealPlan();
      setMealPlan(mockMealPlan);
      toast.success('Using demo meal plan. Service is unavailable 😊');
    } finally {
      setLoading(false);
    }
  };

  // Function to generate a mock meal plan
  const generateMockMealPlan = () => {
    return `# ${diet} Meal Plan for 7 Days

## Monday
- **Breakfast**: Overnight oats with berries and nuts
- **Lunch**: Quinoa salad with roasted vegetables 
- **Dinner**: Grilled salmon with steamed asparagus
- **Snack**: Apple slices with almond butter

## Tuesday
- **Breakfast**: Avocado toast with poached eggs
- **Lunch**: Mediterranean chickpea wrap
- **Dinner**: Stir-fried tofu with broccoli and brown rice
- **Snack**: Greek yogurt with honey

## Wednesday
- **Breakfast**: Spinach and mushroom omelet
- **Lunch**: Lentil soup with whole grain bread
- **Dinner**: Baked chicken with sweet potatoes and green beans
- **Snack**: Mixed nuts and dried fruits

## Thursday
- **Breakfast**: Smoothie bowl with banana, berries and granola
- **Lunch**: Tuna salad lettuce wraps
- **Dinner**: Vegetable curry with quinoa
- **Snack**: Carrot sticks with hummus

## Friday
- **Breakfast**: Whole grain toast with peanut butter and banana
- **Lunch**: Turkey and vegetable roll-ups
- **Dinner**: Baked cod with roasted Brussels sprouts
- **Snack**: Dark chocolate and almonds

## Saturday
- **Breakfast**: Chia seed pudding with mango
- **Lunch**: Grilled vegetable and mozzarella sandwich
- **Dinner**: Turkey meatballs with zucchini noodles
- **Snack**: Sliced bell peppers with guacamole

## Sunday
- **Breakfast**: Veggie breakfast burrito
- **Lunch**: Quinoa bowl with roasted vegetables and tahini dressing
- **Dinner**: Grilled shrimp skewers with mixed vegetables
- **Snack**: Banana with peanut butter`;
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
      return generateMockMealPlan();
    }
    
    let markdown = `# ${dietType} Meal Plan for 7 Days\n\n`;
    
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
      <select
        value={diet}
        onChange={(e) => setDiet(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option>Balanced</option>
        <option>Low-Carb</option>
        <option>High-Protein</option>
        <option>Vegan</option>
        <option>Keto</option>
        <option>Heart-Healthy</option>
      </select>
      <input
        type="text"
        placeholder="Preferences (e.g., no dairy, spicy)"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={generateMealPlan}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300"
      >
        {loading ? 'Generating...' : 'Generate Meal Plan'}
      </button>
      {mealPlan && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="font-semibold text-xl mb-4">🍽️ Generated Meal Plan:</h3>
          <MealPlanCard mealPlan={mealPlan} />

          {/* ✅ Social Sharing Section */}
          <ShareButtons
            url="http://localhost:3000/meal-plans"
            title="📅 Check out this awesome 7-Day Meal Plan from Fusion Meals!"
          />
        </div>
      )}
    </div>
  );
}

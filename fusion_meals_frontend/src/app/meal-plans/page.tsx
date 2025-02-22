'use client';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
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
      const response = await axios.post('http://127.0.0.1:8000/meal-plans/generate', {
        diet_type: diet,
        preferences,
      });
      setMealPlan(response.data.meal_plan);
      toast.success('Meal Plan generated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to generate meal plan. Please try again. 😞');
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="p-8">
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
      </main>
    </div>
  );
}

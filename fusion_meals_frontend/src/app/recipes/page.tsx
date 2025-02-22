'use client';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import EmailForm from '@/components/EmailForm';
import ShareButtons from '@/components/ShareButtons';

export default function RecipePage() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine1, setCuisine1] = useState('Indian');
  const [cuisine2, setCuisine2] = useState('Mexican');
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/recipes/generate', {
        ingredients,
        cuisine1,
        cuisine2,
        dietary_preference: dietaryPreference,
      });
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-4">Fusion Recipe Generator 🍽️</h2>
        <input
          type="text"
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex space-x-4 mb-4">
          <select
            value={cuisine1}
            onChange={(e) => setCuisine1(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Indian</option>
            <option>Mexican</option>
            <option>Italian</option>
            <option>Chinese</option>
          </select>
          <select
            value={cuisine2}
            onChange={(e) => setCuisine2(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Mexican</option>
            <option>Italian</option>
            <option>Chinese</option>
            <option>French</option>
          </select>
        </div>
        <select
          value={dietaryPreference}
          onChange={(e) => setDietaryPreference(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        >
          <option>None</option>
          <option>Diabetes-Friendly</option>
          <option>Low-Carb</option>
          <option>High-Protein</option>
          <option>Vegan</option>
          <option>Gluten-Free</option>
        </select>
        <button
          onClick={generateRecipe}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all duration-300"
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
        {recipe && (
          <div className="mt-6 bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold text-xl mb-4">🍴 Generated Recipe:</h3>
            {/* ✅ Updated Section with RecipeCard */}
            <RecipeCard recipe={recipe} />

            {/* ✅ Social Sharing Section */}
            <ShareButtons
              url="http://localhost:3000/recipes"
              title="🍽️ Check out this Fusion Recipe on Fusion Meals!"
            />

            {/* ✅ Email Sending Section */}
            <EmailForm content={recipe} />
          </div>
        )}
      </main>
    </div>
  );
}

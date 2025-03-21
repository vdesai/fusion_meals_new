'use client';

import React, { useState } from 'react';
import { PlusCircle, Loader2, Sparkles, Flame, Clock, ChevronsUp, AlertTriangle } from 'lucide-react';

interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  tags: string[];
  nutrition_info: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export default function GenerateRecipePage() {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    if (newIngredient.trim() !== '' && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          cuisine_type: cuisineType || undefined,
          meal_type: mealType || undefined,
          dietary_restrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      setGeneratedRecipe(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-yellow-500 mr-2" />
        AI-Powered Recipe Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Tell us what ingredients you have, and our AI chef will create a personalized recipe for you
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Ingredients
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add an ingredient"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
              {ingredients.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {ingredients.length === 0 && !error && (
                <p className="mt-1 text-sm text-gray-500">Add ingredients you have or want to use</p>
              )}
              {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" /> {error}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cuisine Type (Optional)
                </label>
                <select
                  id="cuisineType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                >
                  <option value="">Any cuisine</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="indian">Indian</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                  <option value="american">American</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="french">French</option>
                  <option value="thai">Thai</option>
                  <option value="greek">Greek</option>
                  <option value="spanish">Spanish</option>
                  <option value="middle-eastern">Middle Eastern</option>
                </select>
              </div>

              <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meal Type (Optional)
                </label>
                <select
                  id="mealType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="">Any meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                  <option value="soup">Soup</option>
                  <option value="salad">Salad</option>
                  <option value="side">Side Dish</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dietary Restrictions (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', 'paleo', 'pescatarian'].map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => {
                      if (dietaryRestrictions.includes(diet)) {
                        setDietaryRestrictions(dietaryRestrictions.filter(d => d !== diet));
                      } else {
                        setDietaryRestrictions([...dietaryRestrictions, diet]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      dietaryRestrictions.includes(diet)
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || ingredients.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating Your Recipe...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Recipe with AI
                </div>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {generatedRecipe ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{generatedRecipe.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{generatedRecipe.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {generatedRecipe.tags && generatedRecipe.tags.length > 0 && generatedRecipe.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Prep Time</div>
                  <div className="font-medium flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" /> {generatedRecipe.prep_time}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cook Time</div>
                  <div className="font-medium flex items-center justify-center">
                    <Flame className="h-3 w-3 mr-1" /> {generatedRecipe.cook_time}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Servings</div>
                  <div className="font-medium">{generatedRecipe.servings}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Difficulty</div>
                  <div className="font-medium capitalize flex items-center justify-center">
                    <ChevronsUp className="h-3 w-3 mr-1" /> {generatedRecipe.difficulty}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {generatedRecipe.ingredients && generatedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {generatedRecipe.instructions && generatedRecipe.instructions.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Nutrition Information (per serving)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                    <div className="font-medium">{generatedRecipe.nutrition_info.calories} kcal</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                    <div className="font-medium">{generatedRecipe.nutrition_info.protein}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
                    <div className="font-medium">{generatedRecipe.nutrition_info.carbs}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Fat</div>
                    <div className="font-medium">{generatedRecipe.nutrition_info.fat}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <Sparkles className="h-16 w-16 text-indigo-200 dark:text-indigo-800 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">AI Recipe Generator</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Our AI chef will create a personalized recipe based on the ingredients you provide, tailored to your preferences and dietary needs.
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Add ingredients you already have in your kitchen
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Specify cuisine type for cultural flavor profiles
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Select meal type to match your current needs
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">•</span>
                    Include dietary restrictions for personalized results
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          AI-Powered Recipe Features
        </h2>
        <p className="text-indigo-600 dark:text-indigo-400">
          Our advanced AI recipe generator uses state-of-the-art language models to create unique recipes tailored to your preferences.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-indigo-600 dark:text-indigo-400">
          <li>Generates creative recipes using ingredients you have on hand</li>
          <li>Adapts recipes to accommodate your dietary restrictions</li>
          <li>Adjusts flavor profiles based on cuisine preferences</li>
          <li>Provides accurate nutritional information and detailed instructions</li>
          <li>Offers substitution suggestions when you&apos;re missing ingredients</li>
        </ul>
      </div>
    </div>
  );
} 
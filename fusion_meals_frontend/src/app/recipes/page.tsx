'use client';

import { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

// Loading fallback component
function RecipePageLoading() {
  return <div className="container mx-auto px-4 py-8">Loading...</div>;
}

// Main component
function RecipePageContent() {
  const searchParams = useSearchParams();
  
  const [ingredients, setIngredients] = useState('');
  const [cuisine1, setCuisine1] = useState('');
  const [cuisine2, setCuisine2] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [isPremium, setIsPremium] = useState(false);
  const [servingSize, setServingSize] = useState(4);
  const [cookingSkill, setCookingSkill] = useState('Intermediate');
  const [recipe, setRecipe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form with query parameters if available
  useEffect(() => {
    const cuisine1Param = searchParams.get('cuisine1');
    const cuisine2Param = searchParams.get('cuisine2');
    
    if (cuisine1Param) setCuisine1(cuisine1Param);
    if (cuisine2Param) setCuisine2(cuisine2Param);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setRecipe(''); // Clear any previous recipe

      // Set a longer timeout for the recipe generation request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2-minute timeout

      console.log('Submitting recipe request'); // Debug log
      
      // Try loading from a relative path first
      try {
        const response = await fetch('/api/generate-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients,
            cuisine_type: cuisine1,
            meal_type: cuisine2,
            dietary_restrictions: dietaryPreference,
            serving_size: servingSize,
            cooking_skill: cookingSkill,
            is_premium: isPremium
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API response error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received API response'); // Debug log
        
        if (data) {
          // Format the response in a user-friendly way
          let formattedRecipe = '';
          
          if (data.title) {
            formattedRecipe += `🍴 **Recipe Name**: ${data.title}\n\n`;
          }
          
          if (data.description) {
            formattedRecipe += `${data.description}\n\n`;
          }
          
          if (data.ingredients && data.ingredients.length > 0) {
            formattedRecipe += `🛒 **Ingredients**:\n`;
            data.ingredients.forEach((ingredient: string) => {
              formattedRecipe += `- ${ingredient}\n`;
            });
            formattedRecipe += '\n';
          }
          
          if (data.instructions && data.instructions.length > 0) {
            formattedRecipe += `👩‍🍳 **Instructions**:\n`;
            data.instructions.forEach((instruction: string, index: number) => {
              formattedRecipe += `${index + 1}. ${instruction}\n`;
            });
            formattedRecipe += '\n';
          }
          
          if (data.nutrition_info) {
            formattedRecipe += `💪 **Nutrition Info**:\n`;
            formattedRecipe += `- Calories: ${data.nutrition_info.calories}\n`;
            formattedRecipe += `- Protein: ${data.nutrition_info.protein}\n`;
            formattedRecipe += `- Carbs: ${data.nutrition_info.carbs}\n`;
            formattedRecipe += `- Fat: ${data.nutrition_info.fat}\n`;
          }
          
          setRecipe(formattedRecipe);
          setImageUrl(data.image_url || 'https://placehold.co/600x400?text=Recipe+Image');
          toast.success('Recipe generated successfully!');
        } else {
          throw new Error('Empty response data');
        }
      } catch (apiError) {
        console.error('API route error:', apiError);
        
        // Use the mock data as fallback
        const mockRecipe = generateMockRecipe();
        setRecipe(mockRecipe);
        setImageUrl('https://placehold.co/600x400?text=Demo+Recipe');
        toast.error('Using demo recipe. API service is unavailable.');
      }
    } catch (error) {
      console.error('Top-level error:', error);
      
      // Final fallback
      const mockRecipe = generateMockRecipe();
      setRecipe(mockRecipe);
      setImageUrl('https://placehold.co/600x400?text=Demo+Recipe');
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error('Recipe generation took too long. Using demo recipe instead.');
      } else {
        toast.error('Something went wrong. Using demo recipe instead.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to generate a mock recipe when the backend is unavailable
  const generateMockRecipe = () => {
    return `
🍴 **Recipe Name**: ${cuisine1}-${cuisine2} Fusion Demo Dish

🛒 **Ingredients**:
- **Vegetables**: Onions, bell peppers, garlic
- **Proteins**: Chicken breast, tofu
- **Spices & Other**: Salt, pepper, olive oil, soy sauce

👩‍🍳 **Instructions**:
1. Prepare all ingredients: chop vegetables and slice protein into bite-sized pieces.
2. Heat olive oil in a pan over medium heat.
3. Sauté garlic and onions until fragrant.
4. Add protein and cook until golden brown.
5. Add vegetables and cook until tender.
6. Season with salt, pepper, and soy sauce to taste.
7. Serve hot with your choice of side.

⏰ **Cooking Time**: 30 minutes

🔥 **Calories per Serving**: 320

💪 **Macronutrients**:
- Protein: 22g
- Carbs: 15g
- Fats: 18g

🏅 **Health Score**: B
    `;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Generate Fusion Recipe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Ingredients
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Enter your available ingredients..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Cuisine
            </label>
            <input
              type="text"
              value={cuisine1}
              onChange={(e) => setCuisine1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Italian"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Cuisine
            </label>
            <input
              type="text"
              value={cuisine2}
              onChange={(e) => setCuisine2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Japanese"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Preference
          </label>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="None">None</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Low-Carb">Low-Carb</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serving Size
            </label>
            <input
              type="number"
              value={servingSize}
              onChange={(e) => setServingSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Skill Level
            </label>
            <select
              value={cookingSkill}
              onChange={(e) => setCookingSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="premium"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="premium" className="ml-2 block text-sm text-gray-700">
            Generate Premium Recipe (includes wine pairing, detailed nutrition, and cooking tips)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating Recipe...' : 'Generate Recipe'}
        </button>
      </form>

      {recipe && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Generated Recipe</h2>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Generated recipe"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: recipe.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Export the wrapped component
export default function RecipePage() {
  return (
    <Suspense fallback={<RecipePageLoading />}>
      <RecipePageContent />
    </Suspense>
  );
}

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FormattedRecipeProps {
  recipe: string;
}

interface MacroData {
  name: string;
  value: number;
  color: string;
}

const FormattedRecipe: React.FC<FormattedRecipeProps> = ({ recipe }) => {
  // Extract recipe sections
  const extractSection = (markdown: string, section: string) => {
    const regex = new RegExp(`\\*\\*${section}\\*\\*:([\\s\\S]*?)(?=\\*\\*|$)`);
    const match = markdown.match(regex);
    const content = match ? match[1].trim() : '';
    console.log(`Extracted ${section}:`, content); // Debug log
    return content;
  };

  // Parse ingredients
  const parseIngredients = (text: string) => {
    const lines = text.split('\n').map(line => line.trim());
    const ingredients: { category: string; items: string[] }[] = [];
    let currentCategory = '';
    let currentItems: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('- **')) {
        // This is a category
        if (currentCategory && currentItems.length > 0) {
          ingredients.push({ category: currentCategory, items: currentItems });
          currentItems = [];
        }
        currentCategory = line.replace('- **', '').replace('**:', '').trim();
      } else if (line.startsWith('-')) {
        // This is an ingredient
        currentItems.push(line);
      }
    });

    // Add the last category if exists
    if (currentCategory && currentItems.length > 0) {
      ingredients.push({ category: currentCategory, items: currentItems });
    }

    console.log('Parsed ingredients with categories:', ingredients);
    return ingredients;
  };

  // Parse macronutrients
  const parseMacronutrients = (text: string): MacroData[] => {
    const macros = {
      Protein: 0,
      Carbs: 0,
      Fats: 0
    };
    
    text.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-')) {
        const [macro, value] = trimmedLine
          .replace(/^\s*-\s*/, '') // Remove bullet point
          .split(':')
          .map(s => s.trim());
        if (macro in macros) {
          macros[macro as keyof typeof macros] = parseInt(value.replace('g', '')) || 0;
        }
      }
    });

    console.log('Parsed macros:', macros);

    return Object.entries(macros).map(([name, value]) => ({
      name,
      value,
      color: name === 'Protein' ? '#FF6B6B' : name === 'Carbs' ? '#4ECDC4' : '#45B7D1'
    }));
  };

  // Get health score badge color
  const getHealthScoreColor = (score: string) => {
    switch (score.toUpperCase()) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const recipeName = extractSection(recipe, 'Recipe Name');
  const ingredients = extractSection(recipe, 'Ingredients');
  const parsedIngredients = parseIngredients(ingredients);
  console.log('Raw ingredients text:', ingredients); // Debug log
  const instructions = extractSection(recipe, 'Instructions');
  const cookingTime = extractSection(recipe, 'Cooking Time');
  const calories = extractSection(recipe, 'Calories per Serving');
  const macrosText = extractSection(recipe, 'Macronutrients');
  console.log('Macronutrients text:', macrosText);
  const macros = parseMacronutrients(macrosText);
  console.log('Parsed macros:', macros);
  const healthScore = extractSection(recipe, 'Health Score').trim();

  // Add debug check for macros data
  if (macros.length === 0) {
    console.warn('No macronutrients data available for the pie chart');
  }

  return (
    <div className="space-y-6">
      {/* Recipe Name */}
      <h2 className="text-3xl font-bold text-gray-800">{recipeName}</h2>

      {/* Cooking Time and Calories */}
      <div className="flex space-x-4 text-gray-600">
        <div className="flex items-center">
          <span className="mr-2">⏰</span>
          <span>{cookingTime}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">🔥</span>
          <span>{calories}</span>
        </div>
      </div>

      {/* Health Score Badge */}
      <div className="inline-block">
        <span className={`px-3 py-1 rounded-full text-white font-semibold ${getHealthScoreColor(healthScore)}`}>
          Health Score: {healthScore}
        </span>
      </div>

      {/* Ingredients */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">🛒 Ingredients</h3>
        <div className="prose max-w-none">
          {parsedIngredients.length > 0 ? (
            parsedIngredients.map((category, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">{category.category}</h4>
                <ul className="list-disc pl-5">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700">{item.replace('-', '').trim()}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No ingredients listed</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">👩‍🍳 Instructions</h3>
        <div className="prose max-w-none">
          {instructions.split('\n').map((line, index) => (
            <p key={index} className="text-gray-700">{line}</p>
          ))}
        </div>
      </div>

      {/* Macronutrients Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">💪 Macronutrients</h3>
        <div className="h-64">
          {macros.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macros}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }: { name: string; value: number }) => `${name}: ${value}g`}
                >
                  {macros.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No macronutrient data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormattedRecipe; 
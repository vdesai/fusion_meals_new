'use client';

import React, { useEffect, useState } from 'react';
import { usePantry } from '@/context/PantryContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const RecipeSuggestions: React.FC = () => {
  const { recipeSuggestions, isLoading, error, fetchRecipeSuggestions } = usePantry();
  const router = useRouter();
  const [sortType, setSortType] = useState<'match' | 'missing'>('match');

  useEffect(() => {
    // Only fetch suggestions if they're not already loaded
    if (recipeSuggestions.length === 0) {
      fetchRecipeSuggestions();
    }
  }, [fetchRecipeSuggestions, recipeSuggestions.length]);

  // Sort recipes by match score or by number of missing ingredients
  const sortedRecipes = [...recipeSuggestions].sort((a, b) => {
    if (sortType === 'match') {
      return b.match_score - a.match_score;
    } else {
      return a.missing_ingredients.length - b.missing_ingredients.length;
    }
  });

  // Calculate percentage match
  const getMatchPercentage = (matchScore: number): number => {
    return Math.round(matchScore * 100);
  };

  // Generate color based on match percentage
  const getMatchColor = (matchScore: number): string => {
    const percentage = getMatchPercentage(matchScore);
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading recipe suggestions...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">
          {recipeSuggestions.length} Recipe Suggestions Based on Your Pantry
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            className="rounded-md border border-gray-300 p-1.5 text-sm focus:border-blue-500 focus:outline-none"
            value={sortType}
            onChange={(e) => setSortType(e.target.value as 'match' | 'missing')}
          >
            <option value="match">Best Match</option>
            <option value="missing">Fewest Missing Ingredients</option>
          </select>
        </div>
      </div>

      {recipeSuggestions.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No recipe suggestions available.</p>
          <p className="mt-2 text-sm text-gray-400">
            Add more items to your pantry to get recipe suggestions.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
            >
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">{recipe.name}</h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getMatchColor(
                      recipe.match_score
                    )}`}
                  >
                    {getMatchPercentage(recipe.match_score)}% Match
                  </span>
                </div>
                
                <p className="mb-4 text-sm text-gray-500">
                  You have {recipe.ingredients.length - recipe.missing_ingredients.length} of {recipe.ingredients.length} ingredients
                </p>
                
                {recipe.missing_ingredients.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-1 text-sm font-medium text-gray-700">Missing Ingredients:</h5>
                    <ul className="list-inside list-disc text-sm text-gray-600">
                      {recipe.missing_ingredients.map((ingredient, index) => (
                        <li key={index} className="truncate">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-auto flex items-center space-x-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                  >
                    View Recipe
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {/* Add missing ingredients to grocery list */}}
                  >
                    Add to Grocery
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions; 
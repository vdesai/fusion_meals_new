'use client';

import React, { useState, useEffect } from 'react';
import { Search, Globe, Compass, Book, MapPin, Utensils, Info, History } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  origin: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: string;
  cook_time: string;
  difficulty: string;
  tags: string[];
  image_url: string;
}

interface CuisineData {
  cuisine_name: string;
  region: string;
  description: string;
  key_ingredients: string[];
  key_spices: string[];
  popular_dishes: Recipe[];
  cultural_significance: string;
  history: string;
}

export default function GlobalCuisinePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineData, setCuisineData] = useState<CuisineData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recipe'>('overview');
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const regions = [
    { id: 'italian', name: 'Italian' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'mexican', name: 'Mexican' },
    { id: 'indian', name: 'Indian' },
    { id: 'thai', name: 'Thai' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'french', name: 'French' },
    { id: 'mediterranean', name: 'Mediterranean' },
  ];

  useEffect(() => {
    // Load a random cuisine on initial page load
    fetchRandomCuisine();
  }, []);

  const fetchRandomCuisine = async () => {
    setLoading(true);
    setLoadingError(null);
    try {
      const response = await fetch('/api/global-cuisine/explore');
      if (!response.ok) {
        throw new Error('Failed to fetch cuisine data');
      }
      const data = await response.json();
      
      // Check if data is in expected format before setting state
      if (data && (data.cuisine_name || (data.regions && Array.isArray(data.regions)))) {
        setCuisineData(data);
        setSelectedRegion('');
        setActiveRecipe(null);
        setActiveTab('overview');
      } else {
        throw new Error('Received unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching random cuisine:', error);
      setLoadingError('Failed to load cuisine data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCuisineByRegion = async (region: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/global-cuisine/explore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: region,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cuisine data');
      }
      const data = await response.json();
      setCuisineData(data);
      setSelectedRegion(region);
      setActiveRecipe(null);
      setActiveTab('overview');
    } catch (error) {
      console.error(`Error fetching ${region} cuisine:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/global-cuisine/explore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: searchQuery,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cuisine data');
      }

      const data = await response.json();
      setCuisineData(data);
      setSelectedRegion('');
      setActiveRecipe(null);
      setActiveTab('overview');
      setSearchQuery('');
    } catch (error) {
      console.error('Error searching cuisine:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewRecipeDetails = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setActiveTab('recipe');
    window.scrollTo(0, 0);
  };

  // Add a safe check for array mapping operations
  const renderKeyIngredients = () => {
    if (!cuisineData || !cuisineData.key_ingredients || !Array.isArray(cuisineData.key_ingredients)) {
      return <p>No ingredients information available</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {cuisineData.key_ingredients.map((ingredient, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {ingredient}
          </li>
        ))}
      </ul>
    );
  };
  
  const renderKeySpices = () => {
    if (!cuisineData || !cuisineData.key_spices || !Array.isArray(cuisineData.key_spices)) {
      return <p>No spices information available</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {cuisineData.key_spices.map((spice, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {spice}
          </li>
        ))}
      </ul>
    );
  };
  
  const renderPopularDishes = () => {
    if (!cuisineData || !cuisineData.popular_dishes || !Array.isArray(cuisineData.popular_dishes)) {
      return <p>No dish information available</p>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cuisineData.popular_dishes.map((dish) => (
          <div
            key={dish.id}
            className="border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => viewRecipeDetails(dish)}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">{dish.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {dish.origin}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {dish.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {dish.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Modify the overview tab content to use the safe rendering functions
  const renderOverviewTab = () => {
    if (!cuisineData) return null;
    
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{cuisineData.cuisine_name} Cuisine</h2>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{cuisineData.region}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{cuisineData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Utensils className="h-4 w-4 mr-1" />
              Key Ingredients
            </h3>
            {renderKeyIngredients()}
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Utensils className="h-4 w-4 mr-1" />
              Key Spices & Seasonings
            </h3>
            {renderKeySpices()}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Info className="h-5 w-5 mr-1" />
            Cultural Significance
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-gray-700 dark:text-gray-300">{cuisineData.cultural_significance}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <History className="h-5 w-5 mr-1" />
            Historical Background
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-gray-700 dark:text-gray-300">{cuisineData.history}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Book className="h-5 w-5 mr-1" />
            Popular Dishes
          </h3>
          {renderPopularDishes()}
        </div>
      </div>
    );
  };

  // In your component's return statement, use the safe renderOverviewTab function
  // Replace the current activeTab === 'overview' ? ... section with this
  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p>Loading cuisine information...</p>
          </div>
        </div>
      );
    }
    
    if (loadingError) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-red-500 mb-4">{loadingError}</p>
          <button 
            onClick={fetchRandomCuisine}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (!cuisineData) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Cuisine Selected</h3>
          <p className="text-gray-500">
            Select a region or search for a cuisine to start exploring!
          </p>
        </div>
      );
    }
    
    if (activeTab === 'overview') {
      return renderOverviewTab();
    } else if (activeTab === 'recipe' && activeRecipe) {
      // Recipe tab content here (unchanged)
      return (
        <div className="p-6">
          <button
            onClick={() => setActiveTab('overview')}
            className="mb-4 text-indigo-600 flex items-center hover:underline"
          >
            ← Back to {cuisineData.cuisine_name} Cuisine
          </button>
          {/* ... rest of the recipe detail view ... */}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <Globe className="h-8 w-8 mr-2 text-indigo-600" />
        Global Cuisine Explorer
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Discover authentic recipes and culinary traditions from around the world
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with search and regions */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cuisines..."
                  className="w-full p-2 pl-10 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mb-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Compass className="h-4 w-4 mr-1" />
                Explore by Region
              </h3>
              <div className="space-y-1">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => fetchCuisineByRegion(region.id)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedRegion === region.id
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={fetchRandomCuisine}
              className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              Discover Random Cuisine
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 
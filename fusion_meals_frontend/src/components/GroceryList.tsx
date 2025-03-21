import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { ShoppingCart, DollarSign, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroceryItem {
  id?: string;
  name: string;
  quantity: number | string;
  unit?: string;
  category: string;
}

interface GroceryListProps {
  recipeIngredients: string;
}

const GroceryList: React.FC<GroceryListProps> = ({ recipeIngredients }) => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [estimatedTotal, setEstimatedTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const parseIngredients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Check if there are recipe ingredients
    if (!recipeIngredients || recipeIngredients.trim() === '') {
      toast.error('No recipe ingredients found');
      setLoading(false);
      setError('No recipe ingredients available');
      return;
    }
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending ingredients to parse:', recipeIngredients);
        console.log('Retry attempt:', retryCount);
      }
      
      // Ensure all sections have proper markdown formatting
      let formattedIngredients = recipeIngredients;
      formattedIngredients = formattedIngredients.replace(/^([A-Za-z &]+)$/gm, '## $1');
      formattedIngredients = formattedIngredients.replace(/\n([A-Za-z &]+)\n/g, '\n## $1\n');
      
      const response = await axios.post('/api/grocery/parse-recipe', {
        recipe_ingredients: formattedIngredients
      });

      if (response.data && response.data.items) {
        setGroceryItems(response.data.items);
        setEstimatedTotal(response.data.estimated_total || 0);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error parsing ingredients:', error);
      setError('Failed to parse ingredients. Please try again.');
      
      // Implement retry logic
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        const timeout = setTimeout(() => {
          parseIngredients();
        }, 1000 * Math.pow(2, retryCount));
        
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        retryTimeoutRef.current = timeout;
      }
    } finally {
      setLoading(false);
    }
  }, [recipeIngredients, retryCount]);

  useEffect(() => {
    parseIngredients();
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [parseIngredients]);

  const groupedItems = useMemo(() => {
    const groups = groceryItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, GroceryItem[]>);

    return Object.entries(groups).map(([category, items]) => ({
      category,
      items
    }));
  }, [groceryItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="animate-spin h-6 w-6 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingCart className="mr-2" />
        Grocery List
      </h3>
      
      {groupedItems.map(({ category, items }) => (
        <div key={category} className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                {item.name} - {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      {estimatedTotal > 0 && (
        <div className="mt-4 flex items-center text-gray-700">
          <DollarSign className="h-5 w-5 mr-1" />
          <span>Estimated Total: ${estimatedTotal.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default GroceryList; 
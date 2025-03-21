'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Types
export type QuantityUnit = 
  'g' | 'kg' | 'ml' | 'l' | 'count' | 'tbsp' | 'tsp' | 'cup' | 
  'oz' | 'lb' | 'pinch' | 'bunch' | 'package' | 'can' | 'bottle' | 'box' | 'other';

export type PantryItemStatus = 'available' | 'low' | 'expired' | 'out_of_stock';

export interface PantryItem {
  id: string | null;
  name: string;
  category: string;
  quantity: number;
  unit: QuantityUnit;
  expiry_date?: string | null;
  purchase_date?: string | null;
  status: PantryItemStatus;
  threshold_quantity?: number | null;
  notes?: string | null;
  barcode?: string | null;
}

interface PantryInventory {
  user_id: string;
  items: PantryItem[];
  last_updated: string;
}

export interface MissingIngredientData {
  ingredient: PantryItem;
  required_quantity: number;
  required_unit: QuantityUnit;
  sufficient: boolean;
}

export interface RecipeIngredientCheckResponse {
  can_make_recipe: boolean;
  missing_ingredients: MissingIngredientData[];
  insufficient_ingredients: MissingIngredientData[];
  available_ingredients: PantryItem[];
}

export interface RecipeSuggestion {
  id: string;
  name: string;
  ingredients: string[];
  match_score: number;
  missing_ingredients: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: QuantityUnit;
  category?: string;
  checked: boolean;
  notes?: string;
}

// Context type
interface PantryContextType {
  inventory: PantryItem[];
  isLoading: boolean;
  error: string | null;
  expiredItems: PantryItem[];
  lowStockItems: PantryItem[];
  recipeSuggestions: RecipeSuggestion[];
  groceryList: GroceryItem[];
  fetchInventory: () => Promise<void>;
  addItem: (item: Omit<PantryItem, 'id' | 'status'>) => Promise<PantryItem | null>;
  updateItem: (item: Partial<PantryItem> & { id: string }) => Promise<PantryItem | null>;
  removeItem: (itemId: string) => Promise<boolean>;
  fetchExpiredItems: () => Promise<void>;
  fetchLowStockItems: () => Promise<void>;
  checkRecipeIngredients: (ingredients: { name: string; quantity: string; unit: string }[]) => Promise<RecipeIngredientCheckResponse | null>;
  fetchRecipeSuggestions: () => Promise<void>;
  updateFromGroceryList: (groceryItems: { name: string; quantity: string; unit: string; category?: string }[]) => Promise<PantryItem[]>;
  addToGroceryList: (item: PantryItem) => Promise<boolean>;
  removeFromGroceryList: (id: string) => Promise<boolean>;
}

// Default context values
const defaultPantryContext: PantryContextType = {
  inventory: [],
  isLoading: false,
  error: null,
  expiredItems: [],
  lowStockItems: [],
  recipeSuggestions: [],
  groceryList: [],
  fetchInventory: async () => {},
  addItem: async () => null,
  updateItem: async () => null,
  removeItem: async () => false,
  fetchExpiredItems: async () => {},
  fetchLowStockItems: async () => {},
  checkRecipeIngredients: async () => null,
  fetchRecipeSuggestions: async () => {},
  updateFromGroceryList: async () => [],
  addToGroceryList: async () => false,
  removeFromGroceryList: async () => false,
};

// Create context
const PantryContext = createContext<PantryContextType>(defaultPantryContext);

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Provider component
export const PantryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expiredItems, setExpiredItems] = useState<PantryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<PantryItem[]>([]);
  const [recipeSuggestions, setRecipeSuggestions] = useState<RecipeSuggestion[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  // Fetch the pantry inventory - wrapped in useCallback to prevent infinite loops
  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Attempting to fetch from: ${API_BASE_URL}/pantry/inventory`);
      console.log(`API_BASE_URL value: ${API_BASE_URL}`);
      
      // Add a timeout to the fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/pantry/inventory`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response ok: ${response.ok}`);
      
      // Check if the API call returns a 404 or error, in which case use mock data
      if (response.status === 404 || !response.ok) {
        console.warn(`API returned status ${response.status}: ${response.statusText}`);
        console.warn("Using mock pantry data since API endpoint returned an error");
        
        // Create mock data
        const mockPantryData: PantryItem[] = [
          {
            id: "1",
            name: "Olive Oil",
            category: "Pantry",
            quantity: 500,
            unit: "ml",
            purchase_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
            status: "available"
          },
          {
            id: "2",
            name: "Flour",
            category: "Baking",
            quantity: 200,
            unit: "g",
            purchase_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 8)).toISOString().split('T')[0],
            status: "low",
            threshold_quantity: 500
          },
          {
            id: "3",
            name: "Milk",
            category: "Dairy",
            quantity: 1,
            unit: "l",
            purchase_date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
            expiry_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
            status: "expired"
          },
          {
            id: "4",
            name: "Chicken Breast",
            category: "Proteins",
            quantity: 0,
            unit: "g",
            status: "out_of_stock"
          },
          {
            id: "5",
            name: "Rice",
            category: "Grains",
            quantity: 2,
            unit: "kg",
            purchase_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            status: "available"
          },
          {
            id: "6",
            name: "Tomatoes",
            category: "Vegetables",
            quantity: 4,
            unit: "count",
            purchase_date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
            expiry_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
            status: "available"
          }
        ];
        
        setInventory(mockPantryData);
        return; // Exit early after setting mock data
      }
      
      const data: PantryInventory = await response.json();
      console.log("Successfully fetched inventory data:", data);
      console.log("Items in inventory:", data.items ? data.items.length : 0);
      setInventory(data.items);
    } catch (err) {
      console.error("Error fetching pantry inventory:", err);
      
      // Provide more specific error messages for common fetch errors
      let errorMessage = "Unknown error";
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        errorMessage = "Network error: Could not connect to the server. Please check your internet connection and ensure the backend server is running.";
      } else if (err instanceof DOMException && err.name === "AbortError") {
        errorMessage = "Request timed out after 10 seconds. The server may be slow or unreachable.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error("Detailed error:", errorMessage);
      
      // Use mock data on error
      const mockPantryData: PantryItem[] = [
        {
          id: "1",
          name: "Olive Oil",
          category: "Pantry",
          quantity: 500,
          unit: "ml",
          purchase_date: new Date().toISOString().split('T')[0],
          expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
          status: "available"
        },
        {
          id: "2",
          name: "Flour",
          category: "Baking",
          quantity: 200,
          unit: "g",
          purchase_date: new Date().toISOString().split('T')[0],
          expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 8)).toISOString().split('T')[0],
          status: "low",
          threshold_quantity: 500
        },
        {
          id: "3",
          name: "Milk",
          category: "Dairy",
          quantity: 1,
          unit: "l",
          purchase_date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
          expiry_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          status: "expired"
        }
      ];
      
      setInventory(mockPantryData);
      setError("Connected to mock data: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new item to the pantry
  const addItem = useCallback(async (item: Omit<PantryItem, 'id' | 'status'>): Promise<PantryItem | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to pantry');
      }
      
      const newItem: PantryItem = await response.json();
      setInventory(prev => [...prev, newItem]);
      toast.success(`Added ${newItem.name} to pantry`);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to add item to pantry');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing pantry item
  const updateItem = useCallback(async (item: Partial<PantryItem> & { id: string }): Promise<PantryItem | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update pantry item');
      }
      
      const updatedItem: PantryItem = await response.json();
      setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
      toast.success(`Updated ${updatedItem.name}`);
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to update pantry item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove an item from the pantry
  const removeItem = useCallback(async (itemId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/items/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from pantry');
      }
      
      const success = await response.json();
      if (success) {
        setInventory(prev => prev.filter(i => i.id !== itemId));
        toast.success('Item removed from pantry');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to remove item from pantry');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch expired items
  const fetchExpiredItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/expired`);
      
      if (response.status === 404 || !response.ok) {
        // Use mock expired items
        console.warn("Using mock expired items data");
        const mockExpiredItems: PantryItem[] = inventory.filter(item => item.status === 'expired');
        
        // Add an extra item if we don't have any
        if (mockExpiredItems.length === 0) {
          mockExpiredItems.push({
            id: "expired-1",
            name: "Yogurt",
            category: "Dairy",
            quantity: 1,
            unit: "cup",
            purchase_date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
            expiry_date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
            status: "expired"
          });
        }
        
        setExpiredItems(mockExpiredItems);
        return;
      }
      
      const data: PantryItem[] = await response.json();
      setExpiredItems(data);
    } catch (err) {
      console.error("Error fetching expired items:", err);
      
      // Use mock expired items on error
      const mockExpiredItems: PantryItem[] = inventory.filter(item => item.status === 'expired');
      
      // Add an extra item if we don't have any
      if (mockExpiredItems.length === 0) {
        mockExpiredItems.push({
          id: "expired-1",
          name: "Yogurt",
          category: "Dairy",
          quantity: 1,
          unit: "cup",
          purchase_date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
          expiry_date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
          status: "expired"
        });
      }
      
      setExpiredItems(mockExpiredItems);
    } finally {
      setIsLoading(false);
    }
  }, [inventory]);

  // Fetch low stock items
  const fetchLowStockItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/low-stock`);
      
      if (response.status === 404 || !response.ok) {
        // Use mock low stock items
        console.warn("Using mock low stock items data");
        const mockLowStockItems: PantryItem[] = inventory.filter(item => item.status === 'low');
        
        // Add an extra item if we don't have any
        if (mockLowStockItems.length === 0) {
          mockLowStockItems.push({
            id: "low-1",
            name: "Flour",
            category: "Baking",
            quantity: 200,
            unit: "g",
            threshold_quantity: 500,
            status: "low"
          });
        }
        
        setLowStockItems(mockLowStockItems);
        return;
      }
      
      const data: PantryItem[] = await response.json();
      setLowStockItems(data);
    } catch (err) {
      console.error("Error fetching low stock items:", err);
      
      // Use mock low stock items on error
      const mockLowStockItems: PantryItem[] = inventory.filter(item => item.status === 'low');
      
      // Add an extra item if we don't have any
      if (mockLowStockItems.length === 0) {
        mockLowStockItems.push({
          id: "low-1",
          name: "Flour",
          category: "Baking",
          quantity: 200,
          unit: "g",
          threshold_quantity: 500,
          status: "low"
        });
      }
      
      setLowStockItems(mockLowStockItems);
    } finally {
      setIsLoading(false);
    }
  }, [inventory]);

  // Check recipe ingredients
  const checkRecipeIngredients = useCallback(async (ingredients: { name: string; quantity: string; unit: string }[]): Promise<RecipeIngredientCheckResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/check-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'current_user', // In a real app, this would be the authenticated user's ID
          recipe_ingredients: ingredients,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check recipe ingredients');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to check recipe ingredients');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch recipe suggestions
  const fetchRecipeSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pantry/recipe-suggestions`);
      
      if (response.status === 404 || !response.ok) {
        // Use mock recipe suggestions
        console.warn("Using mock recipe suggestions data");
        const mockRecipeSuggestions: RecipeSuggestion[] = [
          {
            id: "recipe-1",
            name: "Pasta with Tomato Sauce",
            ingredients: ["Pasta", "Tomatoes", "Olive Oil", "Garlic", "Salt"],
            match_score: 0.85,
            missing_ingredients: []
          },
          {
            id: "recipe-2",
            name: "Chicken Fried Rice",
            ingredients: ["Rice", "Chicken", "Eggs", "Vegetables", "Soy Sauce"],
            match_score: 0.7,
            missing_ingredients: ["Soy Sauce"]
          },
          {
            id: "recipe-3",
            name: "Chocolate Chip Cookies",
            ingredients: ["Flour", "Sugar", "Butter", "Chocolate Chips", "Eggs"],
            match_score: 0.5,
            missing_ingredients: ["Chocolate Chips", "Butter", "Sugar"]
          }
        ];
        
        setRecipeSuggestions(mockRecipeSuggestions);
        return;
      }
      
      const data: RecipeSuggestion[] = await response.json();
      setRecipeSuggestions(data);
    } catch (err) {
      console.error("Error fetching recipe suggestions:", err);
      
      // Use mock recipe suggestions on error
      const mockRecipeSuggestions: RecipeSuggestion[] = [
        {
          id: "recipe-1",
          name: "Pasta with Tomato Sauce",
          ingredients: ["Pasta", "Tomatoes", "Olive Oil", "Garlic", "Salt"],
          match_score: 0.85,
          missing_ingredients: []
        },
        {
          id: "recipe-2",
          name: "Chicken Fried Rice",
          ingredients: ["Rice", "Chicken", "Eggs", "Vegetables", "Soy Sauce"],
          match_score: 0.7,
          missing_ingredients: ["Soy Sauce"]
        },
        {
          id: "recipe-3",
          name: "Chocolate Chip Cookies",
          ingredients: ["Flour", "Sugar", "Butter", "Chocolate Chips", "Eggs"],
          match_score: 0.5,
          missing_ingredients: ["Chocolate Chips", "Butter", "Sugar"]
        }
      ];
      
      setRecipeSuggestions(mockRecipeSuggestions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update pantry from grocery list
  const updateFromGroceryList = useCallback(async (groceryItems: { name: string; quantity: string; unit: string; category?: string }[]): Promise<PantryItem[]> => {
    setIsLoading(true);
    setError(null);
    try {
      // Enhance grocery items with proper dates and status
      const enhancedItems = groceryItems.map(item => {
        // Set today as purchase date
        const purchaseDate = new Date().toISOString().split('T')[0];
        
        // Set expiry date based on category (can be refined further)
        let expiryDays = 30; // Default 30 days
        
        // Adjust expiry based on category
        if (item.category) {
          const category = item.category.toLowerCase();
          if (category.includes('dairy') || category.includes('milk')) {
            expiryDays = 14; // Dairy products expire faster
          } else if (category.includes('meat') || category.includes('seafood')) {
            expiryDays = 7; // Meat products expire even faster
          } else if (category.includes('produce') || category.includes('vegetable') || category.includes('fruit')) {
            expiryDays = 10; // Produce has medium shelf life
          } else if (category.includes('pantry') || category.includes('spice') || category.includes('grain')) {
            expiryDays = 180; // Pantry items last longer
          }
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        
        return {
          ...item,
          purchase_date: purchaseDate,
          expiry_date: expiryDate.toISOString().split('T')[0],
          status: "available" // Always mark as available when adding from grocery
        };
      });
      
      console.log('Enhanced grocery items with dates:', enhancedItems);
      
      const response = await fetch(`${API_BASE_URL}/pantry/update-from-grocery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedItems),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update pantry from grocery list');
      }
      
      const updatedItems: PantryItem[] = await response.json();
      // Update inventory with new items
      fetchInventory();
      toast.success('Pantry updated from grocery list');
      return updatedItems;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to update pantry from grocery list');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [fetchInventory]);

  // Add an item to the grocery list
  const addToGroceryList = useCallback(async (item: PantryItem): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, just add it locally
      const groceryItem: GroceryItem = {
        id: Date.now().toString(), // Generate a temporary ID
        name: item.name,
        quantity: item.threshold_quantity || 1,
        unit: item.unit,
        category: item.category,
        checked: false,
        notes: `Added from pantry - ${item.status} item`
      };
      
      setGroceryList(prev => [...prev, groceryItem]);
      toast.success(`${item.name} added to your grocery list`);
      return true;
    } catch (err) {
      console.error('Error adding item to grocery list:', err);
      toast.error('Failed to add item to grocery list');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove an item from the grocery list
  const removeFromGroceryList = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, just remove it locally
      setGroceryList(prev => prev.filter(item => item.id !== id));
      toast.success('Item removed from grocery list');
      return true;
    } catch (err) {
      console.error('Error removing item from grocery list:', err);
      toast.error('Failed to remove item from grocery list');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize data when the component mounts
  useEffect(() => {
    // Initial data fetch - but don't repeatedly fetch on every render
    const controller = new AbortController();
    
    // Only load initial data if we have an empty inventory
    if (inventory.length === 0) {
      fetchInventory();
    }
    
    return () => {
      controller.abort();
    };
  }, [fetchInventory, inventory.length]);

  // Context value
  const value: PantryContextType = {
    inventory,
    isLoading,
    error,
    expiredItems,
    lowStockItems,
    recipeSuggestions,
    groceryList,
    fetchInventory,
    addItem,
    updateItem,
    removeItem,
    fetchExpiredItems,
    fetchLowStockItems,
    checkRecipeIngredients,
    fetchRecipeSuggestions,
    updateFromGroceryList,
    addToGroceryList,
    removeFromGroceryList,
  };

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
};

// Custom hook for using the pantry context
export const usePantry = () => useContext(PantryContext);

export default PantryContext; 
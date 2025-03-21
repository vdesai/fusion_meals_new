'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePantry, GroceryItem, QuantityUnit } from '@/context/PantryContext';
import { toast } from 'react-hot-toast';

const GroceryListPage: React.FC = () => {
  const { groceryList, removeFromGroceryList, updateFromGroceryList } = usePantry();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState<QuantityUnit>('count');
  const [editableList, setEditableList] = useState<GroceryItem[]>(groceryList);

  // Units for the dropdown
  const UNITS: QuantityUnit[] = [
    'g', 'kg', 'ml', 'l', 'count', 'tbsp', 'tsp', 'cup', 
    'oz', 'lb', 'pinch', 'bunch', 'package', 'can', 'bottle', 'box', 'other'
  ];

  // Handle toggling the checked state of an item
  const handleToggleChecked = (id: string) => {
    setEditableList(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Handle removing an item from the list
  const handleRemoveItem = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await removeFromGroceryList(id);
      // Update the editable list as well to maintain consistency
      setEditableList(items => items.filter(item => item.id !== id));
    }
  };

  // Add a new item to the grocery list
  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity,
      unit: newItemUnit,
      checked: false,
      notes: ''
    };
    
    setEditableList([...editableList, newItem]);
    // Reset form
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnit('count');
  };

  // Update the pantry with checked items
  const handleUpdatePantry = async () => {
    const checkedItems = editableList.filter(item => item.checked);
    if (checkedItems.length === 0) {
      toast.error('No items checked for pantry update');
      return;
    }
    
    // Convert grocery items to the format expected by updateFromGroceryList
    const itemsToUpdate = checkedItems.map(item => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category || 'Other'
    }));
    
    try {
      await updateFromGroceryList(itemsToUpdate);
      
      // Remove checked items from the editable list
      setEditableList(items => items.filter(item => !item.checked));
      
      toast.success('Items added to pantry');
    } catch (error) {
      toast.error('Failed to update pantry');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grocery List</h1>
          <p className="text-gray-600">
            Manage your shopping list and add purchased items to your pantry
          </p>
        </div>
        <Button onClick={() => router.push('/pantry')}>Back to Pantry</Button>
      </div>
      
      {editableList.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-500">Your grocery list is empty.</p>
          <p className="mt-2 text-sm text-gray-400">
            Add items to your grocery list from the pantry or using the form below.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit List'}
            </Button>
            
            <Button 
              variant="default" 
              onClick={handleUpdatePantry}
              disabled={editableList.filter(item => item.checked).length === 0}
            >
              Add Checked Items to Pantry
            </Button>
          </div>
          
          {/* Grocery List */}
          <div className="rounded-lg border">
            <ul className="divide-y">
              {editableList.map((item) => (
                <li key={item.id} className="flex items-center p-4">
                  <input 
                    type="checkbox" 
                    id={`item-${item.id}`}
                    checked={item.checked}
                    onChange={() => handleToggleChecked(item.id)}
                    className="mr-4 h-4 w-4"
                  />
                  
                  <div className="flex-1">
                    <label 
                      htmlFor={`item-${item.id}`}
                      className={`block font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}
                    >
                      {item.name}
                    </label>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit} {item.category ? `• ${item.category}` : ''}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-gray-400">{item.notes}</p>
                    )}
                  </div>
                  
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Add New Item Form */}
      <div className="mt-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Add New Item</h2>
        
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              id="item-name"
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              id="item-quantity"
              type="number"
              min="1"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="item-unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="item-unit"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value as QuantityUnit)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sm:col-span-4">
            <Button 
              onClick={handleAddItem}
              className="mt-2 w-full sm:w-auto"
            >
              Add to Grocery List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryListPage; 
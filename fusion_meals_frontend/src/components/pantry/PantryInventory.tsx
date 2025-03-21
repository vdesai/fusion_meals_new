'use client';

import React, { useState, useEffect } from 'react';
import { usePantry } from '@/context/PantryContext';
import { Button } from '@/components/ui/button';
import PantryItemCard from './PantryItemCard';

// Categories for filtering
const CATEGORIES = [
  'All',
  'Grains',
  'Vegetables',
  'Fruits',
  'Proteins',
  'Dairy',
  'Spices',
  'Condiments',
  'Baking',
  'Canned',
  'Beverages',
  'Snacks',
  'Other'
];

const PantryInventory: React.FC = () => {
  const { inventory, isLoading, error, fetchInventory, removeItem } = usePantry();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'expiry' | 'quantity'>('name');
  const [viewType, setViewType] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    // Only fetch inventory if it's not already loaded
    if (inventory.length === 0) {
      fetchInventory();
    }
  }, [fetchInventory, inventory.length]);

  // Filter and sort the inventory items
  const filteredItems = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'expiry') {
        // Sort by expiry date, with null values at the end
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      } else {
        // Sort by quantity
        return b.quantity - a.quantity;
      }
    });

  const handleRemoveItem = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await removeItem(id);
        // Success will be handled by the PantryContext which updates the inventory state
      } catch (error) {
        console.error("Error removing item:", error);
        // Even if the API call fails, the PantryContext's removeItem function will handle the error
      }
    }
  };

  // Format the date for display (used in table view)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading inventory...</div>;
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search input */}
        <div className="flex flex-1 flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full rounded-lg border p-2 sm:w-auto sm:min-w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Category filter */}
          <select
            className="rounded-lg border p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort option */}
          <select
            className="rounded-lg border p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'expiry' | 'quantity')}
          >
            <option value="name">Sort by Name</option>
            <option value="expiry">Sort by Expiry</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex">
          <Button
            variant={viewType === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('cards')}
            className="rounded-r-none"
          >
            Cards
          </Button>
          <Button
            variant={viewType === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('table')}
            className="rounded-l-none"
          >
            Table
          </Button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No items found in your pantry.</p>
          <p className="mt-2 text-sm text-gray-400">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try changing your filters or search term.'
              : 'Add some items to get started.'}
          </p>
        </div>
      ) : viewType === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Name</th>
                <th className="p-3 text-left font-medium text-gray-500">Category</th>
                <th className="p-3 text-left font-medium text-gray-500">Quantity</th>
                <th className="p-3 text-left font-medium text-gray-500">Expiry Date</th>
                <th className="p-3 text-left font-medium text-gray-500">Status</th>
                <th className="p-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`${
                  item.status === 'expired' 
                    ? 'bg-red-50' 
                    : item.status === 'low' 
                      ? 'bg-yellow-50' 
                      : 'bg-white'
                }`}>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="p-3">{formatDate(item.expiry_date)}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'low' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : item.status === 'expired' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {typeof item.status === 'string' ? item.status.replace('_', ' ') : item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id as string)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PantryInventory; 
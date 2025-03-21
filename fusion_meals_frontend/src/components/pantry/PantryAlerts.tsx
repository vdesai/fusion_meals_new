'use client';

import React, { useEffect } from 'react';
import { usePantry } from '@/context/PantryContext';
import PantryItemCard from './PantryItemCard';

const PantryAlerts: React.FC = () => {
  const { 
    expiredItems, 
    lowStockItems, 
    isLoading, 
    error, 
    fetchExpiredItems, 
    fetchLowStockItems,
    removeItem,
    addToGroceryList
  } = usePantry();

  useEffect(() => {
    // Only fetch data if it's not already loaded
    if (expiredItems.length === 0 && lowStockItems.length === 0) {
      fetchExpiredItems();
      fetchLowStockItems();
    }
  }, [fetchExpiredItems, fetchLowStockItems, expiredItems.length, lowStockItems.length]);

  const handleRemoveItem = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      const success = await removeItem(id);
      // Only refresh if the removal was successful, and use a slight delay
      if (success) {
        setTimeout(() => {
          fetchExpiredItems();
          fetchLowStockItems();
        }, 300);
      }
    }
  };

  const handleAddToGrocery = async (id: string) => {
    // Find the item in either expired or low stock items
    const item = [...expiredItems, ...lowStockItems].find(item => item.id === id);
    if (item) {
      await addToGroceryList(item);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading alerts...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Expired Items Section */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">Expired Items</h3>
        
        {expiredItems.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-gray-500">No expired items found in your pantry.</p>
            <p className="mt-2 text-sm text-gray-400">
              All of your food appears to be fresh!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expiredItems.map((item) => (
              <PantryItemCard
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onAddToGrocery={handleAddToGrocery}
              />
            ))}
          </div>
        )}
      </div>

      {/* Low Stock Items Section */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">Low Stock Items</h3>
        
        {lowStockItems.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-gray-500">No low stock items in your pantry.</p>
            <p className="mt-2 text-sm text-gray-400">
              Your pantry is well-stocked!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lowStockItems.map((item) => (
              <PantryItemCard
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onAddToGrocery={handleAddToGrocery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PantryAlerts; 
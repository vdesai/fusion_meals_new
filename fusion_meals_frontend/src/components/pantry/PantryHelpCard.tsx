'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const PantryHelpCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-medium text-blue-800">Smart Pantry Help</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isOpen ? 'Hide Tips' : 'Show Tips'}
        </Button>
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-white p-4 shadow-sm space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Inventory Management</h4>
              <p className="text-sm text-gray-600">
                Add new items to your pantry from the &quot;Add Item&quot; button. Update or remove items as needed from the inventory tab.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800">Expiration Alerts</h4>
              <p className="text-sm text-gray-600">
                Monitor items nearing or past their expiration date in the &quot;Alerts&quot; tab. Add expiring items to your grocery list.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800">Recipe Suggestions</h4>
              <p className="text-sm text-gray-600">
                Get recipe ideas based on what you already have in your pantry to help reduce food waste.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800">Grocery List</h4>
              <p className="text-sm text-gray-600">
                Create shopping lists from low stock or expired items. Check off items as you shop and easily add them to your pantry.
              </p>
            </div>
            
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-blue-600 border-blue-200"
                onClick={() => setIsOpen(false)}
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantryHelpCard; 
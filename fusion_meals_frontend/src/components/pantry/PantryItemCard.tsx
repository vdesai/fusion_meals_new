'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PantryItem } from '@/context/PantryContext';

interface PantryItemCardProps {
  item: PantryItem;
  onRemove: (id: string) => void;
  onAddToGrocery?: (id: string) => void;
}

const PantryItemCard: React.FC<PantryItemCardProps> = ({ item, onRemove, onAddToGrocery }) => {
  // Format the date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color based on item status
  const getStatusColor = () => {
    switch (item.status) {
      case 'expired':
        return 'bg-red-50 border-red-200';
      case 'low':
        return 'bg-yellow-50 border-yellow-200';
      case 'out_of_stock':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // Format the status text
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className={`rounded-lg border ${getStatusColor()} p-4 shadow-sm`}>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">{item.name}</h4>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          item.status === 'available' 
            ? 'bg-green-100 text-green-800' 
            : item.status === 'low' 
              ? 'bg-yellow-100 text-yellow-800' 
              : item.status === 'expired' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
        }`}>
          {formatStatus(item.status)}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <p>Category: {item.category}</p>
        <p>Quantity: {item.quantity} {item.unit}</p>
        
        {item.expiry_date && (
          <p className={item.status === 'expired' ? 'text-red-600' : ''}>
            {item.status === 'expired' ? 'Expired on:' : 'Expires on:'} {formatDate(item.expiry_date)}
          </p>
        )}
        
        {item.purchase_date && (
          <p>Purchased: {formatDate(item.purchase_date)}</p>
        )}
        
        {item.threshold_quantity && (
          <p>Threshold: {item.threshold_quantity} {item.unit}</p>
        )}
        
        {item.notes && (
          <p>Notes: {item.notes}</p>
        )}
      </div>
      
      <div className="mt-3 flex space-x-2">
        {onAddToGrocery && item.status !== 'available' && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => item.id && onAddToGrocery(item.id)}
          >
            Add to Grocery
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className={`flex-1 ${
            item.status === 'expired' 
              ? 'border-red-300 text-red-700 hover:bg-red-100' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => item.id && onRemove(item.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default PantryItemCard; 
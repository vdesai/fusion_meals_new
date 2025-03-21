'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePantry, QuantityUnit } from '@/context/PantryContext';

// Categories
const CATEGORIES = [
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

// Units
const UNITS: QuantityUnit[] = [
  'g', 'kg', 'ml', 'l', 'count', 'tbsp', 'tsp', 'cup', 
  'oz', 'lb', 'pinch', 'bunch', 'package', 'can', 'bottle', 'box', 'other'
];

const AddPantryItemPage = () => {
  const router = useRouter();
  const { addItem, isLoading } = usePantry();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    quantity: 1,
    unit: 'count' as QuantityUnit,
    expiry_date: '',
    purchase_date: '',
    threshold_quantity: 0,
    notes: '',
    barcode: ''
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert number inputs to numbers
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (formData.threshold_quantity < 0) {
      newErrors.threshold_quantity = 'Threshold must be 0 or greater';
    }
    
    if (formData.expiry_date && formData.purchase_date) {
      const expiryDate = new Date(formData.expiry_date);
      const purchaseDate = new Date(formData.purchase_date);
      
      if (expiryDate < purchaseDate) {
        newErrors.expiry_date = 'Expiry date cannot be before purchase date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Add item to pantry
    const result = await addItem({
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      expiry_date: formData.expiry_date || null,
      purchase_date: formData.purchase_date || null,
      threshold_quantity: formData.threshold_quantity || null,
      notes: formData.notes || null,
      barcode: formData.barcode || null
    });
    
    // Navigate back to pantry if successful
    if (result) {
      router.push('/pantry');
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Pantry Item</h1>
          <p className="text-gray-500">
            Add a new item to your pantry inventory
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      
      <div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item name */}
          <div>
            <label htmlFor="name" className="mb-1 block font-medium">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Tomatoes"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Category & Quantity */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1 block font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="quantity" className="mb-1 block font-medium">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-2/3 rounded-l-md border p-2 focus:border-blue-500 focus:outline-none ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-1/3 rounded-r-md border border-l-0 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                >
                  {UNITS.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="purchase_date" className="mb-1 block font-medium">
                Purchase Date
              </label>
              <input
                type="date"
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="expiry_date" className="mb-1 block font-medium">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className={`w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none ${
                  errors.expiry_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-500">{errors.expiry_date}</p>
              )}
            </div>
          </div>
          
          {/* Threshold */}
          <div>
            <label htmlFor="threshold_quantity" className="mb-1 block font-medium">
              Low Stock Threshold
            </label>
            <input
              type="number"
              id="threshold_quantity"
              name="threshold_quantity"
              value={formData.threshold_quantity}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none ${
                errors.threshold_quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2 (alerts when quantity falls below this)"
            />
            {errors.threshold_quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.threshold_quantity}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              You&apos;ll be alerted when the quantity falls below this threshold (0 = no alerts)
            </p>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="mb-1 block font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Any additional information about this item"
            />
          </div>
          
          {/* Barcode */}
          <div>
            <label htmlFor="barcode" className="mb-1 block font-medium">
              Barcode
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 123456789012"
            />
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add to Pantry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPantryItemPage; 
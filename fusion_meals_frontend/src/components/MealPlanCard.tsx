'use client';
import React, { useState } from 'react';
import { Clipboard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import EmailForm from '@/components/EmailForm';
import downloadAsPDF from '@/utils/downloadAsPDF';
import GroceryList from './GroceryList';

interface MealPlanCardProps {
  mealPlan: string;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mealPlan);
    setCopied(true);
    toast.success('Meal Plan copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract ingredients section from the meal plan markdown
  const extractIngredients = () => {
    // Look for the Weekly Grocery List section and its content
    const groceryMatch = mealPlan.match(/# 🛒 Weekly Grocery List\s*([\s\S]*?)(?=\n#|$)/i);
    if (!groceryMatch) {
      return '';
    }
    
    // Get the full grocery content without additional processing
    const groceryContent = groceryMatch[1].trim();
    console.log("Extracted full grocery list:", groceryContent);
    
    return groceryContent;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">📅 Generated Meal Plan</h3>
      <pre className="whitespace-pre-wrap">{mealPlan}</pre>
      <div className="flex space-x-4 mt-4">
        <button onClick={handleCopy} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
          {copied ? <CheckCircle size={20} /> : <Clipboard size={20} />} {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={() => downloadAsPDF(mealPlan, 'Meal_Plan')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Meal Plan PDF
        </button>
      </div>

      {/* Add GroceryList component */}
      <GroceryList recipeIngredients={extractIngredients()} />
      
      <EmailForm content={mealPlan} />
    </div>
  );
};

export default MealPlanCard;

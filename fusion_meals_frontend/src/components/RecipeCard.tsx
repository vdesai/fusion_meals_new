'use client';
import React, { useState } from 'react';
import { Clipboard, CheckCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import downloadAsPDF from '@/utils/downloadAsPDF';


interface RecipeCardProps {
  recipe: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopied(true);
      toast.success('✅ Recipe copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const saveRecipe = () => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    savedRecipes.push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    setSaved(true);
    toast.success('✅ Recipe saved successfully!');
  };


  return (
    <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-lg">
      <h3 className="font-semibold text-xl mb-2 text-green-600 dark:text-green-400">🍽️ Generated Recipe:</h3>
      <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-300 leading-relaxed">{recipe}</pre>
      <div className="flex space-x-4 mt-4 justify-center">
        <button
          onClick={copyToClipboard}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-300"
        >
          {copied ? <CheckCircle size={20} /> : <Clipboard size={20} />} {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={saveRecipe}
          disabled={saved}
          className={`$${
            saved ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } text-white py-2 px-4 rounded-full shadow-md transition-all duration-300`}
        >
          <Save size={20} /> {saved ? 'Saved' : 'Save'}
        </button>
        <button
            onClick={() => downloadAsPDF(recipe, 'Fusion_Recipe')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
            Download Recipe PDF
        </button>

      </div>
    </div>
  );
};

export default RecipeCard;

// 🔗 To use RecipeCard:
// Import in `page.tsx` for recipes and replace current rendering with:
// <RecipeCard recipe={recipe} />

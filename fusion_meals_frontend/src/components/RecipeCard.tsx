'use client';
import React, { useState, useEffect } from 'react';
import { Clipboard, CheckCircle, Save, MessageSquare, Share2, ThumbsUp, MessageCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import GroceryList from './GroceryList';
import FormattedRecipe from './FormattedRecipe';
import RecipeExportModal from './RecipeExportModal';

interface RecipeCardProps {
  recipe: string;
  imageUrl?: string | null;
  nutritionalAnalysis?: Record<string, string>;
  cookingTips?: string[];
  winePairing?: string;
  storageInstructions?: string;
  isPremium?: boolean;
  recipeId?: string;
}

interface Review {
  rating: number;
  review?: string;
  timestamp: string;
  user_id: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  imageUrl,
  nutritionalAnalysis,
  cookingTips,
  winePairing,
  storageInstructions,
  isPremium = false,
  recipeId,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetchReviews();
      fetchLikes();
    }
  }, [recipeId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/recipe-ratings/${recipeId}/reviews`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.average_rating);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/recipe-ratings/${recipeId}/likes`);
      const data = await response.json();
      if (data.success) {
        setLikes(data.likes);
        setHasLiked(data.has_liked);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!recipeId || !rating) return;

    try {
      const response = await fetch('/api/recipe-ratings/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id: recipeId, rating, review }),
      });

      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.average_rating);
        setShowReviewModal(false);
        setRating(0);
        setReview('');
        toast.success('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

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
    savedRecipes.push({ recipe, imageUrl });
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    setSaved(true);
    toast.success('✅ Recipe saved successfully!');
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/recipe-ratings/${recipeId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'anonymous' }),
      });

      const data = await response.json();
      if (data.success) {
        setLikes(data.likes);
        setHasLiked(data.has_liked);
        toast.success(hasLiked ? 'Recipe unliked' : 'Recipe liked!');
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      toast.error('Failed to like recipe');
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/recipes/${recipeId}`;
      setShareUrl(url);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing recipe:', error);
      toast.error('Failed to share recipe');
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error copying share link:', error);
      toast.error('Failed to copy share link');
    }
  };

  // Extract ingredients section from the recipe markdown
  const extractIngredients = () => {
    const ingredientsMatch = recipe.match(/🛒 \*\*Ingredients\*\*:([\s\S]*?)(?=👩‍🍳|\n\n)/);
    if (!ingredientsMatch) return '';
    
    // Clean up the ingredients text
    const ingredients = ingredientsMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^\s*-\s*\*\*[^:]*\*\*:\s*/, ''))
      .join('\n');
    
    return ingredients;
  };

  // Add function to handle export modal
  const handleExportClick = () => {
    setShowExportModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Recipe Image */}
      {imageUrl && (
        <div className="mb-6">
          <img
            src={imageUrl}
            alt="Recipe"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Formatted Recipe */}
      <FormattedRecipe recipe={recipe} />

      {/* Premium Features */}
      {isPremium && (
        <div className="mt-8 space-y-6">
          {/* Nutritional Analysis */}
          {nutritionalAnalysis && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📊 Detailed Nutritional Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(nutritionalAnalysis).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Tips */}
          {cookingTips && cookingTips.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">💡 Cooking Tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                {cookingTips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Wine Pairing */}
          {winePairing && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🍷 Wine Pairing</h3>
              <p className="text-gray-700">{winePairing}</p>
            </div>
          )}

          {/* Storage Instructions */}
          {storageInstructions && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📦 Storage Instructions</h3>
              <p className="text-gray-700">{storageInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={copyToClipboard}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          {copied ? <CheckCircle size={18} className="mr-1" /> : <Clipboard size={18} className="mr-1" />} {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={saveRecipe}
          disabled={saved}
          className={`${
            saved ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } text-white py-2 px-3 rounded flex items-center transition-all duration-300`}
        >
          <Save size={18} className="mr-1" /> {saved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={handleExportClick}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors flex items-center"
        >
          <Printer size={18} className="mr-1" /> Print & Export
        </button>
        <button
          onClick={() => setShowGroceryList(!showGroceryList)}
          className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center"
        >
          {showGroceryList ? 'Hide Grocery List' : 'Show Grocery List'}
        </button>
      </div>

      {/* Grocery List */}
      {showGroceryList && <GroceryList recipeIngredients={extractIngredients()} />}

      {/* Social Features */}
      <div className="mt-6 flex items-center space-x-4 border-t pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            hasLiked ? 'text-red-500' : 'text-gray-500'
          } hover:text-red-500 transition-colors`}
        >
          <ThumbsUp size={20} />
          <span>{likes}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <Share2 size={20} />
        </button>
        <div className="flex items-center space-x-1 text-gray-500">
          <MessageCircle size={20} />
          <span>{reviews.length}</span>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Share Recipe</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={copyShareUrl}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copy
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Section */}
      <div className="p-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <MessageSquare className="w-5 h-5 mr-1" />
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
              </div>
              {review.review && (
                <p className="text-gray-700">{review.review}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Review (optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!rating}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <RecipeExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        recipe={recipe}
        imageUrl={imageUrl || undefined}
        title={recipe.match(/\*\*Recipe Name\*\*:([^*]*)/)?.[1]?.trim()}
      />
    </div>
  );
};

export default RecipeCard;

// 🔗 To use RecipeCard:
// Import in `page.tsx` for recipes and replace current rendering with:
// <RecipeCard recipe={recipe} />

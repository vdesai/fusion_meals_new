'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, CalendarCheck, Info, Droplet, Scale, Sparkle, ChefHat } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      <main className="p-8 max-w-7xl mx-auto">
        {/* Premium Feature Banner */}
        <div className="mb-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkle className="h-8 w-8 text-white mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white">New Premium Feature: AI Personal Chef</h2>
                <p className="text-white opacity-90">Get restaurant-quality meal plans, cooking guidance, and more!</p>
              </div>
            </div>
            <Link
              href="/ai-chef-premium"
              className="bg-white text-amber-600 hover:bg-amber-50 font-semibold py-2 px-6 rounded-full shadow transition-all duration-300 flex items-center"
            >
              <ChefHat className="mr-2 h-5 w-5" />
              Try AI Chef Premium
            </Link>
          </div>
        </div>
        
        {/* ⭐ Hero Section ⭐ */}
        <section className="bg-green-100 dark:bg-gray-800 rounded-lg p-12 shadow-lg text-center transition-all duration-300">
          <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-300 mb-4">
            🌟 Discover Fusion Flavors, Tailored for You!
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Generate unique fusion recipes and meal plans customized to your dietary preferences. Quick. Easy. Delicious.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              href="/generate-recipe"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              🍽️ Generate Recipes
            </Link>
            <Link
              href="/meal-plan"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              🥗 Plan My Meals
            </Link>
            <Link
              href="/ingredient-substitution"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              🧪 Find Substitutes
            </Link>
            <Link
              href="/recipe-scaling"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              📊 Scale Recipes
            </Link>
            <Link
              href="/about"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              💚 Learn More
            </Link>
          </div>
        </section>

        {/* 🌈 Feature Highlights 🌈 */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <UtensilsCrossed size={40} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">Global Cuisine Explorer</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover authentic dishes from around the world with detailed cultural context and cooking techniques.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <CalendarCheck size={40} className="text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">7-Day Meal Plans</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Personalized meal plans considering your dietary needs and preferences for an entire week.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <Droplet size={40} className="text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">Ingredient Substitution</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find perfect substitutes for ingredients based on dietary needs and cooking purposes.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <Scale size={40} className="text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">Recipe Scaling</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily adjust recipes for different serving sizes and convert between measurement units.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <Info size={40} className="text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">About Us</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn the story behind Fusion Meals and how it brings delicious diversity to your plate.
            </p>
          </div>
        </section>

        {/* 🚀 Final CTA 🚀 */}
        <section className="text-center mt-16 bg-green-500 dark:bg-green-600 rounded-lg py-10 px-8 shadow-lg transition-all duration-300">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Fusion Meal? 🍽️
          </h2>
          <p className="text-lg text-white mb-6">
            Dive into a world of flavors today. Explore endless recipe ideas and meal plans tailored just for you!
          </p>
          <Link
            href="/generate-recipe"
            className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
          >
            🚀 Start Generating Now
          </Link>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

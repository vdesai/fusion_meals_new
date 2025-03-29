'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, CalendarCheck, Info, Droplet, Scale } from 'lucide-react';
import CuisineCarousel from '@/components/CuisineCarousel';

// Simple Premium Feature Banner component (inline for now)
const PremiumFeatureBanner = () => (
  <div className="mb-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-lg p-6 shadow-lg">
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="h-8 w-8 text-white mr-3">✨</div>
        <div>
          <h2 className="text-xl font-bold text-white">New Premium Feature: AI Personal Chef</h2>
          <p className="text-white opacity-90">Get restaurant-quality meal plans, cooking guidance, and more!</p>
        </div>
      </div>
      <Link
        href="/ai-chef-premium"
        className="bg-white text-amber-600 hover:bg-amber-50 font-semibold py-2 px-6 rounded-full shadow transition-all duration-300 flex items-center"
      >
        <span className="mr-2">👨‍🍳</span>
        Try AI Chef Premium
      </Link>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div>
      <main className="p-8 max-w-7xl mx-auto">
        {/* Premium Feature Banner */}
        <PremiumFeatureBanner />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Discover Your Perfect Fusion Meal
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Blend culinary traditions, adapt recipes to your dietary needs, and create
              unique meals that tell your story. Let AI guide your cooking adventure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/generate-recipe"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-center"
              >
                Generate a Recipe
              </Link>
              <Link
                href="/meal-plan"
                className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-full border border-blue-600 transition duration-300 text-center"
              >
                Create a Meal Plan
              </Link>
            </div>
          </div>
        </section>

        {/* Cuisine Carousel Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <CuisineCarousel />
          </div>
        </section>

        {/* Feature Highlights 🌈 */}
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

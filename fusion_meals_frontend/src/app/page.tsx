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

        {/* Add Seasonal Recipe Explorer section before the about section */}
        <section className="bg-gradient-to-r from-lime-600 to-green-700 py-16 px-4 md:px-8 text-white rounded-lg my-16">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 bg-white text-lime-700 rounded-full text-sm font-semibold mb-4">
                  NEW FEATURE
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Seasonal Recipe Explorer</h2>
                <p className="text-lg mb-6">
                  Discover ingredients at their peak freshness and create delicious dishes that celebrate each season.
                  Cook with what&apos;s in season for maximum flavor and nutrition.
                </p>
                <Link 
                  href="/seasonal-explorer" 
                  className="inline-flex items-center bg-white text-lime-700 hover:bg-opacity-90 font-medium py-3 px-6 rounded-full transition-all"
                >
                  Explore Seasonal Ingredients 🍎
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <div className="bg-white p-2 rounded-lg shadow-lg transform rotate-3">
                    <img 
                      src="/images/seasons/spring-bg.jpg" 
                      alt="Spring Ingredients" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <p className="text-lime-700 font-medium text-center mt-2">Spring</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-lg transform -rotate-2">
                    <img 
                      src="/images/seasons/summer-bg.jpg" 
                      alt="Summer Ingredients" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <p className="text-lime-700 font-medium text-center mt-2">Summer</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-lg transform -rotate-3">
                    <img 
                      src="/images/seasons/fall-bg.jpg" 
                      alt="Fall Ingredients" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <p className="text-lime-700 font-medium text-center mt-2">Fall</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-lg transform rotate-2">
                    <img 
                      src="/images/seasons/winter-bg.jpg" 
                      alt="Winter Ingredients" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <p className="text-lime-700 font-medium text-center mt-2">Winter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Fusion Builder Feature */}
        <section className="py-12 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block mb-4 px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              NEW FEATURE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fusion Recipe Builder
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Blend culinary traditions to create unique fusion recipes. Combine techniques, 
              ingredients, and flavors from different cuisines around the world.
            </p>
            <Link
              href="/fusion-builder"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-center inline-flex items-center"
            >
              <span className="mr-2">🍲</span>
              Create Fusion Recipes
            </Link>
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

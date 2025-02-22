'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { UtensilsCrossed, CalendarCheck, Info } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        {/* ⭐ Hero Section ⭐ */}
        <section className="bg-green-100 dark:bg-gray-800 rounded-lg p-12 shadow-lg text-center transition-all duration-300">
          <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-300 mb-4">
            🌟 Discover Fusion Flavors, Tailored for You!
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Generate unique fusion recipes and meal plans customized to your dietary preferences. Quick. Easy. Delicious.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <Link
              href="/recipes"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              🍽️ Generate Recipes
            </Link>
            <Link
              href="/meal-plans"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow transition-all duration-300"
            >
              🥗 Plan My Meals
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <UtensilsCrossed size={40} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">Fusion Recipes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Combine flavors from multiple cuisines for exciting, delicious meals tailored to your taste.
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
            href="/recipes"
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

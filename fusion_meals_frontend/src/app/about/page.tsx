// 📁 src/app/about/page.tsx

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Star, Smile, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <main className="p-8 max-w-5xl mx-auto">
        <section className="bg-green-100 dark:bg-gray-800 rounded-lg p-8 shadow-lg transition-all duration-300">
          <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-300 mb-4 text-center">
            🌟 Our Story
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Fusion Meals began with a simple idea—bringing diverse flavors together for busy families. As a parent, I wanted my daughter to enjoy meals that were not just healthy but also exciting. With inspiration from cuisines worldwide, I envisioned a place where anyone could generate personalized recipes and meal plans in seconds. Whether you have dietary restrictions, picky eaters, or an adventurous palate, Fusion Meals has something special for you.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <Users size={40} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">For Families</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quick and healthy fusion recipes that kids will love and parents will trust.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <Star size={40} className="text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">Tailored for You</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Diet-friendly options including vegan, keto, heart-healthy, and more, made just for your lifestyle.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md text-center transition-all duration-300">
            <Smile size={40} className="text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold text-xl text-green-600 dark:text-green-300 mb-2">Easy & Fun</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simple steps, minimal prep time, and flavors that will put a smile on everyone&apos;s face.
            </p>
          </div>
        </section>

        <section className="text-center mt-12 bg-green-500 dark:bg-green-600 rounded-lg py-8 px-6 shadow-lg transition-all duration-300">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Fusion Meal? 🍽️
          </h2>
          <p className="text-lg text-white mb-6">
            Explore endless recipe ideas and meal plans tailored just for you and your loved ones.
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

export default AboutPage;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon, UtensilsCrossed, CalendarCheck, Info, Home } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "Fusion Recipes", href: "/recipes", icon: <UtensilsCrossed size={20} /> },
    { name: "Meal Planner", href: "/meal-plans", icon: <CalendarCheck size={20} /> },
    { name: "About", href: "/about", icon: <Info size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md p-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-green-600 dark:text-green-300 hover:opacity-80 transition-all duration-300">
          Fusion Meals 🍽️
        </Link>
        <div className="flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 text-md font-semibold transition-all duration-300 px-2 py-1 rounded-lg ${
                pathname === item.href
                  ? "text-green-600 border-b-2 border-green-500"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:border-b-2 hover:border-green-500"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import Link from "next/link";
import { Menu, X, Globe, Home, ChefHat, BookOpen, ClipboardList, Utensils, Settings, User, LogOut, Info, Scale, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  // Close desktop menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setIsDesktopMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-4 lg:px-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Fusion Meals</span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Fusion Meals</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-2">
          <Link
            href="/"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <Home className="mr-1 h-4 w-4" />
            Home
          </Link>
          <Link
            href="/pantry"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <ShoppingBag className="mr-1 h-4 w-4" />
            Pantry
          </Link>
          <Link
            href="/generate-recipe"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <BookOpen className="mr-1 h-4 w-4" />
            Generate Recipe
          </Link>
          <Link
            href="/meal-plan"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <ClipboardList className="mr-1 h-4 w-4" />
            Meal Plan
          </Link>
          <Link
            href="/global-cuisine"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <Globe className="mr-1 h-4 w-4" />
            Global Cuisine
          </Link>
          <Link
            href="/meal-prep"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <Utensils className="mr-1 h-4 w-4" />
            Meal Prep
          </Link>
          <Link
            href="/ai-chef-premium"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <ChefHat className="mr-1 h-4 w-4" />
            <span className="flex items-center">
              AI Chef
              <span className="ml-1 text-xs py-0.5 px-1.5 rounded-md bg-amber-100 text-amber-800">
                Premium
              </span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-1 relative" ref={desktopMenuRef}>
          <button 
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
            aria-expanded={isDesktopMenuOpen}
            aria-label="User menu"
          >
            <Menu className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
          </button>
          
          {/* Desktop menu dropdown */}
          {isDesktopMenuOpen && (
            <div className="absolute right-0 top-10 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                <Link
                  href="/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="mr-3 h-4 w-4" /> My Account
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="mr-3 h-4 w-4" /> Settings
                </Link>
                <Link
                  href="/ingredient-substitution"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Utensils className="mr-3 h-4 w-4" /> Ingredient Substitution
                </Link>
                <Link
                  href="/recipe-scaling"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Scale className="mr-3 h-4 w-4" /> Recipe Scaling
                </Link>
                <Link
                  href="/about"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Info className="mr-3 h-4 w-4" /> About Us
                </Link>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    // Add logout functionality here
                    console.log('Logging out...');
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-10 bg-black opacity-30" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Fusion Meals</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Fusion Meals</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link
                    href="/"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Home className="mr-1 h-4 w-4" />
                      Home
                    </div>
                  </Link>
                  <Link
                    href="/pantry"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <ShoppingBag className="mr-1 h-4 w-4" />
                      Pantry
                    </div>
                  </Link>
                  <Link
                    href="/generate-recipe"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      Generate Recipe
                    </div>
                  </Link>
                  <Link
                    href="/meal-plan"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <ClipboardList className="mr-1 h-4 w-4" />
                      Meal Plan
                    </div>
                  </Link>
                  <Link
                    href="/global-cuisine"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Globe className="mr-1 h-4 w-4" />
                      Global Cuisine
                    </div>
                  </Link>
                  <Link
                    href="/meal-prep"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Utensils className="mr-1 h-4 w-4" />
                      Meal Prep
                    </div>
                  </Link>
                  <Link
                    href="/ai-chef-premium"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-indigo-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <ChefHat className="mr-1 h-4 w-4" />
                      <span className="flex items-center">
                        AI Chef
                        <span className="ml-1 text-xs py-0.5 px-1.5 rounded-md bg-amber-100 text-amber-800">
                          Premium
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

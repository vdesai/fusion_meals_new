"use client";

import Link from "next/link";
import { Menu, X, Globe, Home, ChefHat, BookOpen, ClipboardList, Utensils, Info, Scale, User, School } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Define types for mock authentication
interface MockUser {
  fullName?: string;
  username?: string;
}

// Mock authentication instead of using Clerk
const useAuthMock = () => {
  return {
    isSignedIn: false,
    user: null as MockUser | null
  };
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, user } = useAuthMock();

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
            href="/lunchbox-planner"
            className="border-transparent text-indigo-500 hover:border-indigo-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            <School className="mr-1 h-4 w-4" />
            Lunchbox Planner
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
        
        {/* Desktop auth and user menu - HIDDEN ON MOBILE */}
        <div className="hidden lg:flex flex-1 items-center justify-end gap-x-4 relative" ref={desktopMenuRef}>
          {isSignedIn ? (
            <>
              <Link 
                href="/profile" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {user?.fullName || user?.username || "User"}
              </Link>
              <button 
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                aria-expanded={isDesktopMenuOpen}
                aria-label="User menu"
              >
                <Menu className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </Link>
              <button 
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                aria-expanded={isDesktopMenuOpen}
                aria-label="User menu"
              >
                <Menu className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              </button>
            </>
          )}
          
          {/* Desktop menu dropdown */}
          {isDesktopMenuOpen && (
            <div className="absolute right-0 top-10 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {isSignedIn && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="mr-3 h-4 w-4" /> My Profile
                    </Link>
                    <Link
                      href="/saved-recipes"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <BookOpen className="mr-3 h-4 w-4" /> Saved Recipes
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  </>
                )}
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
                  <Info className="mr-3 h-4 w-4" /> Our Story
                </Link>
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
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Home
                  </Link>
                  
                  <Link
                    href="/generate-recipe"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="mr-3 h-5 w-5" />
                    Generate Recipe
                  </Link>
                   
                  <Link
                    href="/meal-plan"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ClipboardList className="mr-3 h-5 w-5" />
                    Meal Plan
                  </Link>
                  <Link
                    href="/lunchbox-planner"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <School className="mr-3 h-5 w-5" />
                    Lunchbox Planner
                  </Link>
                  <Link
                    href="/global-cuisine"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Globe className="mr-3 h-5 w-5" />
                    Global Cuisine
                  </Link>
                  
                  <Link
                    href="/meal-prep"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Utensils className="mr-3 h-5 w-5" />
                    Meal Prep
                  </Link>
                  
                  <Link
                    href="/ai-chef-premium"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ChefHat className="mr-3 h-5 w-5" />
                    <span className="flex items-center">
                      AI Chef
                      <span className="ml-2 text-xs py-0.5 px-1.5 rounded-md bg-amber-100 text-amber-800">
                        Premium
                      </span>
                    </span>
                  </Link>
                </div>
                
                <div className="py-6">
                  <Link
                    href="/auth/signin"
                    className="flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Sign in
                  </Link>
                  
                  <Link
                    href="/auth/signup"
                    className="flex items-center px-6 py-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
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

'use client';

import React, { useState } from 'react';
import { Sparkles, PlusCircle, Calendar, Users, XCircle, School, Loader2, Printer, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Define interfaces for our data structures
interface LunchItem {
  name: string;
  description: string;
  nutritional_info: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  allergens: string[];
  prep_time: string;
}

interface ChildLunchPlan {
  child_name: string;
  age: number;
  daily_lunches: {
    [day: string]: {
      main: LunchItem;
      fruit: LunchItem;
      vegetable: LunchItem;
      snack: LunchItem;
      drink: LunchItem;
    }
  };
}

interface LunchboxPlan {
  children: ChildLunchPlan[];
  grocery_list: {
    [category: string]: string[];
  };
}

export default function LunchboxPlannerPage() {
  // State for form inputs
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<{ name: string; age: number; preferences: string[]; allergies: string[] }[]>([
    { name: '', age: 5, preferences: [], allergies: [] }
  ]);
  const [daysToGenerate, setDaysToGenerate] = useState(5);
  const [newPreference, setNewPreference] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [tempChildIndex, setTempChildIndex] = useState(0);
  
  // State for generated plan
  const [lunchboxPlan, setLunchboxPlan] = useState<LunchboxPlan | null>(null);
  
  // Handle adding a child
  const addChild = () => {
    setChildren([...children, { name: '', age: 5, preferences: [], allergies: [] }]);
  };
  
  // Handle removing a child
  const removeChild = (index: number) => {
    const newChildren = [...children];
    newChildren.splice(index, 1);
    setChildren(newChildren);
  };
  
  // Handle child name change
  const handleChildNameChange = (index: number, name: string) => {
    const newChildren = [...children];
    newChildren[index].name = name;
    setChildren(newChildren);
  };
  
  // Handle child age change
  const handleChildAgeChange = (index: number, age: number) => {
    const newChildren = [...children];
    newChildren[index].age = age;
    setChildren(newChildren);
  };
  
  // Add preference to a child
  const addPreference = () => {
    if (newPreference.trim() && !children[tempChildIndex].preferences.includes(newPreference.trim())) {
      const newChildren = [...children];
      newChildren[tempChildIndex].preferences.push(newPreference.trim());
      setChildren(newChildren);
      setNewPreference('');
    }
  };
  
  // Remove preference from a child
  const removePreference = (childIndex: number, preference: string) => {
    const newChildren = [...children];
    newChildren[childIndex].preferences = newChildren[childIndex].preferences.filter(p => p !== preference);
    setChildren(newChildren);
  };
  
  // Add allergy to a child
  const addAllergy = () => {
    if (newAllergy.trim() && !children[tempChildIndex].allergies.includes(newAllergy.trim())) {
      const newChildren = [...children];
      newChildren[tempChildIndex].allergies.push(newAllergy.trim());
      setChildren(newChildren);
      setNewAllergy('');
    }
  };
  
  // Remove allergy from a child
  const removeAllergy = (childIndex: number, allergy: string) => {
    const newChildren = [...children];
    newChildren[childIndex].allergies = newChildren[childIndex].allergies.filter(a => a !== allergy);
    setChildren(newChildren);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (children.some(child => !child.name.trim())) {
      toast.error('Please provide a name for each child.');
      return;
    }
    
    setLoading(true);
    
    try {
      // For MVP, generate mock data
      // In production, this would call the backend API
      const mockPlan = generateMockLunchboxPlan();
      setLunchboxPlan(mockPlan);
      toast.success('Lunchbox plan generated successfully!');
    } catch (error) {
      console.error('Error generating lunchbox plan:', error);
      toast.error('Failed to generate lunchbox plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate a mock lunchbox plan for testing
  const generateMockLunchboxPlan = (): LunchboxPlan => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const plan: LunchboxPlan = {
      children: [],
      grocery_list: {
        'Fruits': ['Apples', 'Bananas', 'Grapes', 'Strawberries', 'Blueberries'],
        'Vegetables': ['Carrots', 'Cucumber', 'Bell peppers', 'Cherry tomatoes', 'Celery'],
        'Proteins': ['Turkey', 'Chicken', 'Tuna', 'Eggs', 'Greek yogurt'],
        'Grains': ['Whole wheat bread', 'Tortillas', 'Pasta', 'Brown rice', 'Quinoa'],
        'Dairy': ['Cheese sticks', 'Milk', 'Yogurt'],
        'Snacks': ['Granola bars', 'Crackers', 'Popcorn', 'Trail mix'],
        'Other': ['Hummus', 'Peanut butter', 'Jelly', 'Mayonnaise']
      }
    };
    
    children.forEach(child => {
      const childPlan: ChildLunchPlan = {
        child_name: child.name,
        age: child.age,
        daily_lunches: {}
      };
      
      // Generate lunches for each day
      daysOfWeek.slice(0, daysToGenerate).forEach(day => {
        childPlan.daily_lunches[day] = {
          main: {
            name: ['Turkey & Cheese Sandwich', 'Tuna Wrap', 'Pasta Salad', 'Chicken Quesadilla', 'PB&J Sandwich'][Math.floor(Math.random() * 5)],
            description: 'Nutritious main dish made with whole grains and lean protein.',
            nutritional_info: {
              calories: 250 + Math.floor(Math.random() * 100),
              protein: '10-15g',
              carbs: '25-30g',
              fat: '8-12g'
            },
            allergens: [],
            prep_time: '5-10 mins'
          },
          fruit: {
            name: ['Apple Slices', 'Banana', 'Grapes', 'Orange Segments', 'Strawberries'][Math.floor(Math.random() * 5)],
            description: 'Fresh fruit for vitamins and natural sweetness.',
            nutritional_info: {
              calories: 60 + Math.floor(Math.random() * 40),
              protein: '0-1g',
              carbs: '15-20g',
              fat: '0g'
            },
            allergens: [],
            prep_time: '2 mins'
          },
          vegetable: {
            name: ['Carrot Sticks', 'Cucumber Slices', 'Bell Pepper Strips', 'Cherry Tomatoes', 'Celery with Peanut Butter'][Math.floor(Math.random() * 5)],
            description: 'Crunchy vegetables with dip.',
            nutritional_info: {
              calories: 30 + Math.floor(Math.random() * 20),
              protein: '1-2g',
              carbs: '5-8g',
              fat: '0-1g'
            },
            allergens: [],
            prep_time: '3 mins'
          },
          snack: {
            name: ['Granola Bar', 'Cheese Stick', 'Trail Mix', 'Yogurt', 'Crackers'][Math.floor(Math.random() * 5)],
            description: 'Satisfying snack for energy throughout the day.',
            nutritional_info: {
              calories: 100 + Math.floor(Math.random() * 50),
              protein: '2-5g',
              carbs: '10-15g',
              fat: '3-7g'
            },
            allergens: [],
            prep_time: '1 min'
          },
          drink: {
            name: ['Water', 'Milk', 'Fruit Smoothie', 'Juice Box', 'Yogurt Drink'][Math.floor(Math.random() * 5)],
            description: 'Hydration for the day.',
            nutritional_info: {
              calories: day.includes('Water') ? 0 : 80 + Math.floor(Math.random() * 40),
              protein: '0-8g',
              carbs: '0-15g',
              fat: '0-2g'
            },
            allergens: [],
            prep_time: '1 min'
          }
        };
      });
      
      plan.children.push(childPlan);
    });
    
    return plan;
  };
  
  // Handle printing
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && lunchboxPlan) {
      printWindow.document.write('<html><head><title>Weekly Lunchbox Plan</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; margin-bottom: 20px; }
        h2 { color: #4f46e5; margin-top: 30px; }
        h3 { margin-top: 20px; }
        .day { margin-bottom: 30px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .meal { margin-bottom: 10px; }
        .meal-name { font-weight: bold; }
        .grocery-section { margin-top: 40px; }
        .grocery-category { font-weight: bold; margin-top: 15px; }
        ul { padding-left: 20px; }
      `);
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      
      printWindow.document.write('<h1>Weekly Lunchbox Plan</h1>');
      
      // For each child
      lunchboxPlan.children.forEach(child => {
        printWindow.document.write(`<h2>${child.child_name}'s Lunchbox Plan (Age: ${child.age})</h2>`);
        
        // For each day
        Object.entries(child.daily_lunches).forEach(([day, lunch]) => {
          printWindow.document.write(`<div class="day"><h3>${day}</h3>`);
          
          printWindow.document.write('<div class="meal"><span class="meal-name">Main:</span> ' + lunch.main.name + '</div>');
          printWindow.document.write('<div class="meal"><span class="meal-name">Fruit:</span> ' + lunch.fruit.name + '</div>');
          printWindow.document.write('<div class="meal"><span class="meal-name">Vegetable:</span> ' + lunch.vegetable.name + '</div>');
          printWindow.document.write('<div class="meal"><span class="meal-name">Snack:</span> ' + lunch.snack.name + '</div>');
          printWindow.document.write('<div class="meal"><span class="meal-name">Drink:</span> ' + lunch.drink.name + '</div>');
          
          printWindow.document.write('</div>');
        });
      });
      
      // Grocery list
      printWindow.document.write('<div class="grocery-section"><h2>Grocery List</h2>');
      
      Object.entries(lunchboxPlan.grocery_list).forEach(([category, items]) => {
        printWindow.document.write(`<div class="grocery-category">${category}</div>`);
        printWindow.document.write('<ul>');
        items.forEach(item => {
          printWindow.document.write(`<li>${item}</li>`);
        });
        printWindow.document.write('</ul>');
      });
      
      printWindow.document.write('</div>');
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center">
        <School className="h-8 w-8 text-purple-500 mr-2" />
        Kids' Lunchbox Planner
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Plan nutritious school lunches for your children with our AI-powered lunchbox planner
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Children</h2>
                <button
                  type="button"
                  onClick={addChild}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Child
                </button>
              </div>
              
              {children.map((child, index) => (
                <div key={index} className="mb-5 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Child {index + 1}</h3>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChild(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => handleChildNameChange(index, e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Child's name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age</label>
                      <select
                        value={child.age}
                        onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value))}
                        className="w-full p-2 border rounded-md"
                      >
                        {[...Array(13)].map((_, i) => (
                          <option key={i} value={i + 3}>
                            {i + 3} years old
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Food Preferences</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {child.preferences.map((pref, prefIndex) => (
                        <div key={prefIndex} className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                          <span>{pref}</span>
                          <button
                            type="button"
                            onClick={() => removePreference(index, pref)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={tempChildIndex === index ? newPreference : ''}
                        onChange={(e) => {
                          setTempChildIndex(index);
                          setNewPreference(e.target.value);
                        }}
                        onFocus={() => setTempChildIndex(index)}
                        className="flex-grow p-2 border rounded-l-md"
                        placeholder="E.g., loves pasta, dislikes spicy"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTempChildIndex(index);
                          addPreference();
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Allergies/Restrictions</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {child.allergies.map((allergy, allergyIndex) => (
                        <div key={allergyIndex} className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                          <span>{allergy}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergy(index, allergy)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={tempChildIndex === index ? newAllergy : ''}
                        onChange={(e) => {
                          setTempChildIndex(index);
                          setNewAllergy(e.target.value);
                        }}
                        onFocus={() => setTempChildIndex(index)}
                        className="flex-grow p-2 border rounded-l-md"
                        placeholder="E.g., nuts, dairy, gluten"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTempChildIndex(index);
                          addAllergy();
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Days to Generate</label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={daysToGenerate}
                  onChange={(e) => setDaysToGenerate(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={5}>5 days (School week)</option>
                  <option value={7}>7 days (Full week)</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Generating Lunch Plans...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Lunchbox Plan
                </div>
              )}
            </button>
          </form>
        </div>
        
        {/* Results section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {lunchboxPlan ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Lunchbox Plan</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </button>
                </div>
              </div>
              
              {/* Tab navigation for children */}
              <div className="mb-6">
                <div className="flex border-b">
                  {lunchboxPlan.children.map((child, index) => (
                    <button
                      key={index}
                      className={`py-2 px-4 border-b-2 ${
                        index === 0 ? 'border-purple-500 text-purple-600' : 'border-transparent hover:text-purple-500'
                      }`}
                    >
                      {child.child_name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Display the first child's plan by default */}
              {lunchboxPlan.children.length > 0 && (
                <div>
                  {Object.entries(lunchboxPlan.children[0].daily_lunches).map(([day, lunch]) => (
                    <div key={day} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">{day}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-3 rounded-md">
                          <p className="font-medium">Main</p>
                          <p>{lunch.main.name}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="font-medium">Fruit</p>
                          <p>{lunch.fruit.name}</p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-md">
                          <p className="font-medium">Vegetable</p>
                          <p>{lunch.vegetable.name}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-md">
                          <p className="font-medium">Snack</p>
                          <p>{lunch.snack.name}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md col-span-2">
                          <p className="font-medium">Drink</p>
                          <p>{lunch.drink.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Grocery List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Grocery List</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {Object.entries(lunchboxPlan.grocery_list).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h4 className="font-medium text-purple-700 mb-2">{category}</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <School className="h-16 w-16 text-purple-200 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                Let's Plan Some Lunches!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Fill out the form to get a week's worth of balanced, kid-friendly lunch ideas tailored to your children's preferences.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md text-left">
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2">•</span>
                    Nutritionally balanced meals for growing children
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2">•</span>
                    Variety of options to prevent lunchbox boredom
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2">•</span>
                    Respects allergies and dietary restrictions
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2">•</span>
                    Complete grocery list organized by store sections
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Lunchbox Planner Features
        </h2>
        <p className="text-purple-600 dark:text-purple-400 mb-2">
          Our AI-powered lunchbox planner takes the stress out of daily lunch prep for busy parents.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-purple-600 dark:text-purple-400">
          <li>Age-appropriate nutrition for each child</li>
          <li>Balanced meals with appropriate portions</li>
          <li>Variety of options to prevent lunchbox boredom</li>
          <li>Accommodates multiple children with different preferences</li>
          <li>Weekly grocery list to streamline shopping</li>
          <li>Print-friendly formats for easy reference</li>
        </ul>
      </div>
    </div>
  );
} 
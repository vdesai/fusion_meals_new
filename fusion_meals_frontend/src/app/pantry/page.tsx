'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePantry } from '@/context/PantryContext';
import PantryInventory from '@/components/pantry/PantryInventory';
import PantryAlerts from '@/components/pantry/PantryAlerts';
import RecipeSuggestions from '@/components/pantry/RecipeSuggestions';
import PantryHelpCard from '@/components/pantry/PantryHelpCard';

const PantryPage = () => {
  const router = useRouter();
  const { error } = usePantry();
  
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Pantry</h1>
            <p className="mt-1 text-gray-600">
              Manage your pantry inventory, track expiration dates, and get recipe suggestions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:ml-auto">
            <Button 
              variant="outline"
              onClick={() => router.push('/pantry/grocery')}
            >
              Grocery List
            </Button>
            <Button 
              variant="default"
              onClick={() => router.push('/pantry/add')}
            >
              Add Item
            </Button>
          </div>
        </div>

        <PantryHelpCard />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p>Error: {error}</p>
          </div>
        )}

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="recipe-suggestions">Recipe Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-4">
            <PantryInventory />
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <PantryAlerts />
          </TabsContent>
          
          <TabsContent value="recipe-suggestions" className="space-y-4">
            <RecipeSuggestions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PantryPage; 
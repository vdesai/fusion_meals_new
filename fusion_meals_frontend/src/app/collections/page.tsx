'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  cuisine1: string;
  cuisine2: string;
  dietaryPreference: string;
  createdAt: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  recipes: Recipe[];
  createdAt: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`);
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollection),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const data = await response.json();
      setCollections([...collections, data]);
      setShowCreateModal(false);
      setNewCollection({ name: '', description: '' });
      toast.success('Collection created successfully!');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete collection');
      }

      setCollections(collections.filter(collection => collection.id !== id));
      toast.success('Collection deleted successfully!');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Collections</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Plus size={20} />
          New Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No collections yet. Create your first collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{collection.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="text-blue-500 hover:text-blue-700">
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{collection.description}</p>
              <div className="text-sm text-gray-500">
                {collection.recipes.length} recipes • Created {new Date(collection.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Collection</h2>
            <form onSubmit={handleCreateCollection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
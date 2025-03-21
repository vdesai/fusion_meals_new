import { NextResponse } from 'next/server';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  recipes: Recipe[];
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for collections (replace with database in production)
const collections = new Map<string, Map<string, Collection>>();

// Simple mock user ID for demo purposes
const MOCK_USER_ID = "user-123";

export async function GET() {
  try {
    const userCollections = collections.get(MOCK_USER_ID) || new Map();
    return NextResponse.json(Array.from(userCollections.values()));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error fetching collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, recipes } = body;

    if (!name || !recipes) {
      return NextResponse.json(
        { error: 'Name and recipes are required' },
        { status: 400 }
      );
    }

    const collection: Collection = {
      id: Date.now().toString(),
      name,
      description,
      recipes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userCollections = collections.get(MOCK_USER_ID) || new Map();
    userCollections.set(collection.id, collection);
    collections.set(MOCK_USER_ID, userCollections);

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error creating collection' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, recipes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    const userCollections = collections.get(MOCK_USER_ID);
    if (!userCollections) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const collection = userCollections.get(id);
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const updatedCollection: Collection = {
      ...collection,
      name: name || collection.name,
      description: description || collection.description,
      recipes: recipes || collection.recipes,
      updatedAt: new Date().toISOString(),
    };

    userCollections.set(id, updatedCollection);
    collections.set(MOCK_USER_ID, userCollections);

    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error updating collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    const userCollections = collections.get(MOCK_USER_ID);
    if (!userCollections) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    userCollections.delete(id);
    collections.set(MOCK_USER_ID, userCollections);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error deleting collection' },
      { status: 500 }
    );
  }
} 
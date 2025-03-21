import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const userCollections = collections.get(session.user.id) || new Map();
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

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

    const userCollections = collections.get(session.user.id) || new Map();
    userCollections.set(collection.id, collection);
    collections.set(session.user.id, userCollections);

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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, description, recipes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    const userCollections = collections.get(session.user.id);
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
    collections.set(session.user.id, userCollections);

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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    const userCollections = collections.get(session.user.id);
    if (!userCollections) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    userCollections.delete(id);
    collections.set(session.user.id, userCollections);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error deleting collection' },
      { status: 500 }
    );
  }
} 
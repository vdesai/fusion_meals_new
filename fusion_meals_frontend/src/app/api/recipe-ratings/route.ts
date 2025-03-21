import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipe_id, rating, review } = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe-ratings/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipe_id,
        rating,
        review,
        user_id: 'anonymous',
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipe_id = searchParams.get('recipe_id');

    if (!recipe_id) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe-ratings/${recipe_id}/reviews`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 
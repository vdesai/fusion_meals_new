import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { recipeId: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe-ratings/${params.recipeId}/reviews`
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
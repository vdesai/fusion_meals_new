import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { recipeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe-ratings/${params.recipeId}/likes?user_id=${userId}`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { recipeId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe-ratings/${params.recipeId}/like`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: session.user.id }),
      }
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error liking recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like recipe' },
      { status: 500 }
    );
  }
} 
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from ..database import get_db
from ..models.recipe_rating import RecipeRating, RecipeSimilarity

router = APIRouter()

class RatingRequest(BaseModel):
    recipe_id: str
    rating: int
    review: Optional[str] = None
    user_id: str

class RatingResponse(BaseModel):
    success: bool
    average_rating: float
    review_count: int
    reviews: List[dict]

@router.post("/rate", response_model=RatingResponse)
async def rate_recipe(
    request: RatingRequest,
    db: Session = Depends(get_db)
):
    try:
        # Check if user has already rated this recipe
        existing_rating = db.query(RecipeRating).filter(
            RecipeRating.recipe_id == request.recipe_id,
            RecipeRating.user_id == request.user_id
        ).first()

        if existing_rating:
            existing_rating.rating = request.rating
            existing_rating.review = request.review
            existing_rating.updated_at = datetime.utcnow()
        else:
            new_rating = RecipeRating(
                recipe_id=request.recipe_id,
                user_id=request.user_id,
                rating=request.rating,
                review=request.review
            )
            db.add(new_rating)

        db.commit()

        # Get updated statistics
        ratings = db.query(RecipeRating).filter(
            RecipeRating.recipe_id == request.recipe_id
        ).all()

        reviews = [
            {
                "rating": r.rating,
                "review": r.review,
                "timestamp": r.created_at.isoformat(),
                "user_id": r.user_id
            }
            for r in ratings
        ]

        average_rating = sum(r.rating for r in ratings) / len(ratings) if ratings else 0

        return {
            "success": True,
            "average_rating": round(average_rating, 1),
            "review_count": len(ratings),
            "reviews": reviews
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{recipe_id}/reviews", response_model=RatingResponse)
async def get_reviews(
    recipe_id: str,
    db: Session = Depends(get_db)
):
    try:
        ratings = db.query(RecipeRating).filter(
            RecipeRating.recipe_id == recipe_id
        ).all()

        reviews = [
            {
                "rating": r.rating,
                "review": r.review,
                "timestamp": r.created_at.isoformat(),
                "user_id": r.user_id
            }
            for r in ratings
        ]

        average_rating = sum(r.rating for r in ratings) / len(ratings) if ratings else 0

        return {
            "success": True,
            "average_rating": round(average_rating, 1),
            "review_count": len(ratings),
            "reviews": reviews
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{recipe_id}/similar")
async def get_similar_recipes(
    recipe_id: str,
    db: Session = Depends(get_db)
):
    try:
        similarities = db.query(RecipeSimilarity).filter(
            RecipeSimilarity.recipe_id == recipe_id
        ).order_by(RecipeSimilarity.similarity_score.desc()).limit(5).all()

        return {
            "success": True,
            "similar_recipes": [
                {
                    "recipe_id": s.similar_recipe_id,
                    "similarity_score": s.similarity_score
                }
                for s in similarities
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
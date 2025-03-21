from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class RecipeRating(Base):
    __tablename__ = "recipe_ratings"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(String, index=True)
    user_id = Column(String, index=True)
    rating = Column(Integer)
    review = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RecipeSimilarity(Base):
    __tablename__ = "recipe_similarities"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(String, index=True)
    similar_recipe_id = Column(String, index=True)
    similarity_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 
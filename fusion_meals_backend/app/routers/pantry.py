from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Dict, Optional
from datetime import date
from sqlalchemy.orm import Session

from app.models.pantry import (
    PantryItem, 
    PantryInventory, 
    AddPantryItemRequest,
    UpdatePantryItemRequest,
    RemovePantryItemRequest,
    RecipeIngredientCheckRequest,
    RecipeIngredientCheckResponse
)

from app.database.database import get_db
from app.services import db_pantry_service as pantry_service

# Create router
router = APIRouter(
    tags=["pantry"],
    responses={404: {"description": "Not found"}},
)

# Helper to simulate authentication for demo
async def get_current_user_id() -> str:
    # In a real app, this would extract the user ID from an auth token
    # For demo purposes, we'll use a hardcoded user ID
    return "sample_user_123"

# Get pantry inventory
@router.get("/inventory", response_model=PantryInventory)
async def get_inventory(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Get the current user's pantry inventory.
    
    Returns a list of all items in the user's pantry with their status and details.
    """
    return await pantry_service.get_pantry_inventory(db, user_id)

# Add item to pantry
@router.post("/items", response_model=PantryItem)
async def add_item(item: AddPantryItemRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Add a new item to the pantry.
    
    Creates a new item with the specified details and adds it to the pantry inventory.
    """
    return await pantry_service.add_pantry_item(db, user_id, item)

# Update item in pantry
@router.put("/items", response_model=PantryItem)
async def update_item(item: UpdatePantryItemRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Update an existing pantry item.
    
    Updates the specified item with new details.
    """
    updated_item = await pantry_service.update_pantry_item(db, user_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item

# Remove item from pantry
@router.delete("/items/{item_id}", response_model=bool)
async def remove_item(item_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Remove an item from the pantry.
    
    Deletes the specified item from the pantry inventory.
    """
    success = await pantry_service.remove_pantry_item(db, user_id, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return success

# Get expired items
@router.get("/expired", response_model=List[PantryItem])
async def get_expired(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Get all expired items in the pantry.
    
    Returns a list of items that have expired based on their expiry date.
    """
    return await pantry_service.get_expired_items(db, user_id)

# Get low stock items
@router.get("/low-stock", response_model=List[PantryItem])
async def get_low_stock(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Get all items that are low in stock.
    
    Returns a list of items that are below their threshold quantity.
    """
    return await pantry_service.get_low_stock_items(db, user_id)

# Check recipe ingredients
@router.post("/check-recipe", response_model=RecipeIngredientCheckResponse)
async def check_recipe_ingredients(
    request: RecipeIngredientCheckRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Check if all ingredients for a recipe are available in the pantry.
    
    Compares the recipe ingredients with the pantry inventory and returns 
    a list of missing or insufficient ingredients.
    """
    # This endpoint needs to be implemented in db_pantry_service.py
    # For now, it will return a 501 Not Implemented error
    raise HTTPException(status_code=501, detail="Not implemented yet")

# Get recipe suggestions
@router.get("/recipe-suggestions", response_model=List[Dict])
async def get_recipe_suggestions(
    limit: int = Query(5, description="Maximum number of suggestions to return"),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get recipe suggestions based on what's in the user's pantry.
    
    Returns recipes with a match score indicating how well they match the pantry contents.
    Higher scores mean more ingredients are available.
    """
    # This endpoint needs to be implemented in db_pantry_service.py
    # For now, it will return a 501 Not Implemented error
    raise HTTPException(status_code=501, detail="Not implemented yet")

# Update pantry from grocery list
@router.post("/update-from-grocery", response_model=List[PantryItem])
async def update_from_grocery(
    grocery_items: List[Dict],
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Update the pantry inventory after grocery shopping.
    
    Takes a list of purchased items and updates the pantry accordingly.
    Adds new items or updates quantities of existing items.
    """
    return await pantry_service.update_pantry_from_grocery_list(db, user_id, grocery_items) 
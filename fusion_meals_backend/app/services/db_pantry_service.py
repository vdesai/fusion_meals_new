from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional
import uuid

from app.database.models import PantryItem as DBPantryItem, User
from app.models.pantry import (
    PantryItem, 
    PantryInventory, 
    QuantityUnit,
    PantryItemStatus,
    AddPantryItemRequest,
    UpdatePantryItemRequest,
    MissingIngredientData,
    RecipeIngredientCheckResponse
)

# Helper function to convert DB model to Pydantic model
def db_to_pydantic_pantry_item(db_item: DBPantryItem) -> PantryItem:
    """Convert database model to Pydantic model"""
    return PantryItem(
        id=db_item.id,
        name=db_item.name,
        category=db_item.category,
        quantity=db_item.quantity,
        unit=QuantityUnit(db_item.unit),
        purchase_date=db_item.purchase_date,
        expiry_date=db_item.expiry_date,
        status=PantryItemStatus(db_item.status),
        threshold_quantity=db_item.threshold_quantity,
        notes=db_item.notes,
        barcode=db_item.barcode
    )

# Get or create user
async def get_or_create_user(db: Session, user_id: str) -> User:
    """Get an existing user or create a new one if not found"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Create a new user with the provided ID
        user = User(
            id=user_id,
            username=f"user_{user_id[:8]}",  # Create a simple username
            email=f"user_{user_id[:8]}@example.com"  # Placeholder email
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

# Pantry service functions
async def get_pantry_inventory(db: Session, user_id: str) -> PantryInventory:
    """Get the user's pantry inventory from database"""
    # Ensure the user exists
    await get_or_create_user(db, user_id)
    
    # Get all pantry items for the user
    db_items = db.query(DBPantryItem).filter(DBPantryItem.user_id == user_id).all()
    
    # Update status of items based on expiry dates
    for item in db_items:
        if item.expiry_date and item.expiry_date < date.today():
            item.status = PantryItemStatus.EXPIRED.value
        elif item.status != PantryItemStatus.OUT_OF_STOCK.value and item.threshold_quantity and item.quantity <= item.threshold_quantity:
            item.status = PantryItemStatus.LOW.value
    
    # Commit any status changes
    db.commit()
    
    # Convert to Pydantic models
    items = [db_to_pydantic_pantry_item(item) for item in db_items]
    
    return PantryInventory(
        user_id=user_id,
        items=items,
        last_updated=datetime.now()
    )

async def add_pantry_item(db: Session, user_id: str, item_data: AddPantryItemRequest) -> PantryItem:
    """Add a new item to the user's pantry in database"""
    # Ensure the user exists
    await get_or_create_user(db, user_id)
    
    # Determine status if not provided
    status = item_data.status
    if not status:
        if item_data.quantity <= 0:
            status = PantryItemStatus.OUT_OF_STOCK
        elif item_data.expiry_date and item_data.expiry_date < date.today():
            status = PantryItemStatus.EXPIRED
        elif item_data.threshold_quantity and item_data.quantity <= item_data.threshold_quantity:
            status = PantryItemStatus.LOW
        else:
            status = PantryItemStatus.AVAILABLE
    
    # Create a new pantry item
    db_item = DBPantryItem(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=item_data.name,
        category=item_data.category,
        quantity=item_data.quantity,
        unit=item_data.unit.value,
        purchase_date=item_data.purchase_date or date.today(),
        expiry_date=item_data.expiry_date,
        status=status.value if status else PantryItemStatus.AVAILABLE.value,
        threshold_quantity=item_data.threshold_quantity,
        notes=item_data.notes,
        barcode=item_data.barcode
    )
    
    # Add to database
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Return as Pydantic model
    return db_to_pydantic_pantry_item(db_item)

async def update_pantry_item(db: Session, user_id: str, update_data: UpdatePantryItemRequest) -> Optional[PantryItem]:
    """Update an existing pantry item in the database"""
    # Find the item to update
    db_item = db.query(DBPantryItem).filter(
        DBPantryItem.id == update_data.id,
        DBPantryItem.user_id == user_id
    ).first()
    
    if not db_item:
        return None
    
    # Update fields that are provided
    if update_data.name:
        db_item.name = update_data.name
    if update_data.category:
        db_item.category = update_data.category
    if update_data.quantity is not None:
        db_item.quantity = update_data.quantity
    if update_data.unit:
        db_item.unit = update_data.unit.value
    if update_data.expiry_date:
        db_item.expiry_date = update_data.expiry_date
    if update_data.purchase_date:
        db_item.purchase_date = update_data.purchase_date
    if update_data.status:
        db_item.status = update_data.status.value
    if update_data.threshold_quantity is not None:
        db_item.threshold_quantity = update_data.threshold_quantity
    if update_data.notes is not None:
        db_item.notes = update_data.notes
    if update_data.barcode is not None:
        db_item.barcode = update_data.barcode
    
    # Automatically update status if not explicitly provided
    if not update_data.status:
        if db_item.quantity <= 0:
            db_item.status = PantryItemStatus.OUT_OF_STOCK.value
        elif db_item.expiry_date and db_item.expiry_date < date.today():
            db_item.status = PantryItemStatus.EXPIRED.value
        elif db_item.threshold_quantity and db_item.quantity <= db_item.threshold_quantity:
            db_item.status = PantryItemStatus.LOW.value
        else:
            db_item.status = PantryItemStatus.AVAILABLE.value
    
    # Save to database
    db.commit()
    db.refresh(db_item)
    
    # Return as Pydantic model
    return db_to_pydantic_pantry_item(db_item)

async def remove_pantry_item(db: Session, user_id: str, item_id: str) -> bool:
    """Remove an item from the user's pantry in the database"""
    # Find the item to remove
    db_item = db.query(DBPantryItem).filter(
        DBPantryItem.id == item_id,
        DBPantryItem.user_id == user_id
    ).first()
    
    if not db_item:
        return False
    
    # Remove from database
    db.delete(db_item)
    db.commit()
    
    return True

async def get_expired_items(db: Session, user_id: str) -> List[PantryItem]:
    """Get all expired items in the user's pantry from the database"""
    db_items = db.query(DBPantryItem).filter(
        DBPantryItem.user_id == user_id,
        DBPantryItem.status == PantryItemStatus.EXPIRED.value
    ).all()
    
    return [db_to_pydantic_pantry_item(item) for item in db_items]

async def get_low_stock_items(db: Session, user_id: str) -> List[PantryItem]:
    """Get all items that are low in stock from the database"""
    db_items = db.query(DBPantryItem).filter(
        DBPantryItem.user_id == user_id,
        DBPantryItem.status == PantryItemStatus.LOW.value
    ).all()
    
    return [db_to_pydantic_pantry_item(item) for item in db_items]

async def update_pantry_from_grocery_list(db: Session, user_id: str, grocery_items: List[Dict]) -> List[PantryItem]:
    """Update pantry inventory after a grocery list purchase using the database"""
    updated_items = []
    
    for grocery_item in grocery_items:
        # Try to find the item in the pantry
        db_item = db.query(DBPantryItem).filter(
            DBPantryItem.user_id == user_id,
            DBPantryItem.name.ilike(grocery_item["name"])
        ).first()
        
        if db_item:
            # Update the existing item
            update_req = UpdatePantryItemRequest(
                id=db_item.id,
                quantity=db_item.quantity + float(grocery_item.get("quantity", 1)),
                purchase_date=grocery_item.get("purchase_date") if "purchase_date" in grocery_item else date.today(),
                expiry_date=grocery_item.get("expiry_date") if "expiry_date" in grocery_item else None,
                status=PantryItemStatus(grocery_item["status"]) if "status" in grocery_item and grocery_item["status"] in [e.value for e in PantryItemStatus] else PantryItemStatus.AVAILABLE
            )
            
            updated_item = await update_pantry_item(db, user_id, update_req)
            if updated_item:
                updated_items.append(updated_item)
        else:
            # Add as a new pantry item
            unit_value = grocery_item.get("unit", "count")
            unit = QuantityUnit(unit_value) if unit_value in [e.value for e in QuantityUnit] else QuantityUnit.COUNT
            
            status_value = grocery_item.get("status", "available")
            status = PantryItemStatus(status_value) if status_value in [e.value for e in PantryItemStatus] else None
            
            new_item_req = AddPantryItemRequest(
                name=grocery_item["name"],
                category=grocery_item.get("category", "Pantry"),
                quantity=float(grocery_item.get("quantity", 1)),
                unit=unit,
                purchase_date=grocery_item.get("purchase_date") if "purchase_date" in grocery_item else date.today(),
                expiry_date=grocery_item.get("expiry_date") if "expiry_date" in grocery_item else None,
                status=status
            )
            
            new_item = await add_pantry_item(db, user_id, new_item_req)
            updated_items.append(new_item)
    
    return updated_items 
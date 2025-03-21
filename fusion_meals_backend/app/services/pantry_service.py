from datetime import datetime, date, timedelta
from typing import List, Dict, Optional
import uuid
import random
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

# Mock database for development
MOCK_PANTRY_DB: Dict[str, PantryInventory] = {}

# Initialize with some sample data
def initialize_mock_data():
    # Sample user data
    sample_user_id = "sample_user_123"
    
    # Sample pantry items with varied statuses
    sample_items = [
        PantryItem(
            id=str(uuid.uuid4()),
            name="Salt",
            category="Spices & Seasonings",
            quantity=500,
            unit=QuantityUnit.GRAMS,
            purchase_date=date.today() - timedelta(days=30),
            expiry_date=date.today() + timedelta(days=365),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Olive Oil",
            category="Pantry",
            quantity=250,
            unit=QuantityUnit.MILLILITERS,
            purchase_date=date.today() - timedelta(days=45),
            expiry_date=date.today() + timedelta(days=180),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Flour",
            category="Pantry",
            quantity=100,
            unit=QuantityUnit.GRAMS,
            purchase_date=date.today() - timedelta(days=60),
            expiry_date=date.today() + timedelta(days=90),
            status=PantryItemStatus.LOW,
            threshold_quantity=200
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Milk",
            category="Dairy & Eggs",
            quantity=500,
            unit=QuantityUnit.MILLILITERS,
            purchase_date=date.today() - timedelta(days=5),
            expiry_date=date.today() + timedelta(days=3),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Eggs",
            category="Dairy & Eggs",
            quantity=6,
            unit=QuantityUnit.COUNT,
            purchase_date=date.today() - timedelta(days=7),
            expiry_date=date.today() + timedelta(days=14),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Chicken Breast",
            category="Meat & Seafood",
            quantity=0,
            unit=QuantityUnit.GRAMS,
            status=PantryItemStatus.OUT_OF_STOCK
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Tomatoes",
            category="Produce",
            quantity=4,
            unit=QuantityUnit.COUNT,
            purchase_date=date.today() - timedelta(days=3),
            expiry_date=date.today() + timedelta(days=4),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Garlic",
            category="Produce",
            quantity=1,
            unit=QuantityUnit.BUNCH,
            purchase_date=date.today() - timedelta(days=10),
            expiry_date=date.today() + timedelta(days=20),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Pasta",
            category="Pantry",
            quantity=400,
            unit=QuantityUnit.GRAMS,
            purchase_date=date.today() - timedelta(days=90),
            expiry_date=date.today() + timedelta(days=270),
            status=PantryItemStatus.AVAILABLE
        ),
        PantryItem(
            id=str(uuid.uuid4()),
            name="Yogurt",
            category="Dairy & Eggs",
            quantity=1,
            unit=QuantityUnit.CUP,
            purchase_date=date.today() - timedelta(days=8),
            expiry_date=date.today() - timedelta(days=1),
            status=PantryItemStatus.EXPIRED
        )
    ]
    
    # Create inventory for sample user
    MOCK_PANTRY_DB[sample_user_id] = PantryInventory(
        user_id=sample_user_id,
        items=sample_items,
        last_updated=datetime.now()
    )

# Initialize mock data
initialize_mock_data()

# Pantry service functions
async def get_pantry_inventory(user_id: str) -> PantryInventory:
    """Get the user's pantry inventory"""
    if user_id not in MOCK_PANTRY_DB:
        # Create an empty inventory for the user if they don't have one
        MOCK_PANTRY_DB[user_id] = PantryInventory(
            user_id=user_id,
            items=[],
            last_updated=datetime.now()
        )
    
    # Update status of items based on expiry dates
    inventory = MOCK_PANTRY_DB[user_id]
    for item in inventory.items:
        if item.expiry_date and item.expiry_date < date.today():
            item.status = PantryItemStatus.EXPIRED
        elif item.status != PantryItemStatus.OUT_OF_STOCK and item.threshold_quantity and item.quantity <= item.threshold_quantity:
            item.status = PantryItemStatus.LOW
    
    return inventory

async def add_pantry_item(user_id: str, item_data: AddPantryItemRequest) -> PantryItem:
    """Add a new item to the user's pantry"""
    inventory = await get_pantry_inventory(user_id)
    
    # Create a new pantry item
    new_item = PantryItem(
        id=str(uuid.uuid4()),
        name=item_data.name,
        category=item_data.category,
        quantity=item_data.quantity,
        unit=item_data.unit,
        expiry_date=item_data.expiry_date,
        purchase_date=item_data.purchase_date or date.today(),
        threshold_quantity=item_data.threshold_quantity,
        notes=item_data.notes,
        barcode=item_data.barcode
    )
    
    # Set status based on provided status or determine automatically
    if item_data.status:
        new_item.status = item_data.status
    else:
        # Set status based on threshold and quantity
        if new_item.threshold_quantity and new_item.quantity <= new_item.threshold_quantity:
            new_item.status = PantryItemStatus.LOW
        elif new_item.quantity <= 0:
            new_item.status = PantryItemStatus.OUT_OF_STOCK
        elif new_item.expiry_date and new_item.expiry_date < date.today():
            new_item.status = PantryItemStatus.EXPIRED
    
    # Add to inventory
    inventory.items.append(new_item)
    inventory.last_updated = datetime.now()
    
    return new_item

async def update_pantry_item(user_id: str, update_data: UpdatePantryItemRequest) -> Optional[PantryItem]:
    """Update an existing pantry item"""
    inventory = await get_pantry_inventory(user_id)
    
    # Find the item to update
    for i, item in enumerate(inventory.items):
        if item.id == update_data.id:
            # Update fields that are provided
            if update_data.name:
                item.name = update_data.name
            if update_data.category:
                item.category = update_data.category
            if update_data.quantity is not None:
                item.quantity = update_data.quantity
            if update_data.unit:
                item.unit = update_data.unit
            if update_data.expiry_date:
                item.expiry_date = update_data.expiry_date
            if update_data.purchase_date:
                item.purchase_date = update_data.purchase_date
            if update_data.status:
                item.status = update_data.status
            if update_data.threshold_quantity is not None:
                item.threshold_quantity = update_data.threshold_quantity
            if update_data.notes is not None:
                item.notes = update_data.notes
            if update_data.barcode is not None:
                item.barcode = update_data.barcode
                
            # Automatically update status
            if item.quantity <= 0:
                item.status = PantryItemStatus.OUT_OF_STOCK
            elif item.expiry_date and item.expiry_date < date.today():
                item.status = PantryItemStatus.EXPIRED
            elif item.threshold_quantity and item.quantity <= item.threshold_quantity:
                item.status = PantryItemStatus.LOW
            elif item.status not in [PantryItemStatus.EXPIRED]:
                item.status = PantryItemStatus.AVAILABLE
            
            inventory.last_updated = datetime.now()
            return item
    
    # Item not found
    return None

async def remove_pantry_item(user_id: str, item_id: str) -> bool:
    """Remove an item from the user's pantry"""
    inventory = await get_pantry_inventory(user_id)
    
    # Find the item to remove
    for i, item in enumerate(inventory.items):
        if item.id == item_id:
            inventory.items.pop(i)
            inventory.last_updated = datetime.now()
            return True
    
    # Item not found
    return False

async def get_expired_items(user_id: str) -> List[PantryItem]:
    """Get all expired items in the user's pantry"""
    inventory = await get_pantry_inventory(user_id)
    return [item for item in inventory.items if item.status == PantryItemStatus.EXPIRED]

async def get_low_stock_items(user_id: str) -> List[PantryItem]:
    """Get all items that are low in stock"""
    inventory = await get_pantry_inventory(user_id)
    return [item for item in inventory.items if item.status == PantryItemStatus.LOW]

async def check_recipe_ingredients(user_id: str, recipe_ingredients: List[Dict[str, str]]) -> RecipeIngredientCheckResponse:
    """Check if the user has all the ingredients needed for a recipe"""
    inventory = await get_pantry_inventory(user_id)
    
    # Prepare response
    response = RecipeIngredientCheckResponse(can_make_recipe=False)
    
    # Helper function to normalize ingredient names for comparison
    def normalize_name(name: str) -> str:
        return name.lower().strip()
    
    # Helper function to convert units if needed
    def convert_units(quantity: float, from_unit: QuantityUnit, to_unit: QuantityUnit) -> float:
        # For simplicity, we're only handling direct matches
        # In a real app, you'd have a more sophisticated unit conversion system
        if from_unit == to_unit:
            return quantity
        
        # TODO: Implement unit conversions as needed
        return quantity  # For now, just return the original quantity
    
    missing = []
    insufficient = []
    available = []
    
    for ingredient_data in recipe_ingredients:
        ingredient_name = normalize_name(ingredient_data["name"])
        try:
            required_quantity = float(ingredient_data.get("quantity", "1"))
        except ValueError:
            required_quantity = 1.0
            
        required_unit = ingredient_data.get("unit", "count")
        
        # Try to find the ingredient in the pantry
        found = False
        for pantry_item in inventory.items:
            if normalize_name(pantry_item.name) == ingredient_name and pantry_item.status != PantryItemStatus.EXPIRED:
                found = True
                
                # Check if there's enough
                # In real implementation, handle unit conversions
                converted_quantity = convert_units(
                    required_quantity, 
                    QuantityUnit(required_unit) if required_unit in [e.value for e in QuantityUnit] else QuantityUnit.OTHER,
                    pantry_item.unit
                )
                
                if pantry_item.quantity >= converted_quantity:
                    available.append(pantry_item)
                else:
                    insufficient.append(
                        MissingIngredientData(
                            ingredient=pantry_item,
                            required_quantity=required_quantity,
                            required_unit=QuantityUnit(required_unit) if required_unit in [e.value for e in QuantityUnit] else QuantityUnit.OTHER,
                            sufficient=False
                        )
                    )
                break
        
        if not found:
            # Create a placeholder item for the missing ingredient
            missing_item = PantryItem(
                id=None,
                name=ingredient_data["name"],
                category="Unknown",  # We don't know the category
                quantity=0,
                unit=QuantityUnit(required_unit) if required_unit in [e.value for e in QuantityUnit] else QuantityUnit.OTHER,
                status=PantryItemStatus.OUT_OF_STOCK
            )
            
            missing.append(
                MissingIngredientData(
                    ingredient=missing_item,
                    required_quantity=required_quantity,
                    required_unit=QuantityUnit(required_unit) if required_unit in [e.value for e in QuantityUnit] else QuantityUnit.OTHER,
                    sufficient=False
                )
            )
    
    # Update response
    response.missing_ingredients = missing
    response.insufficient_ingredients = insufficient
    response.available_ingredients = available
    response.can_make_recipe = len(missing) == 0 and len(insufficient) == 0
    
    return response

# Function to get recipe suggestions based on pantry
async def get_recipe_suggestions(user_id: str, limit: int = 5) -> List[Dict]:
    """Get recipe suggestions based on pantry contents"""
    # In a real implementation, this would query a recipe database and match against inventory
    
    # For demonstration, we'll use mock recipe data
    mock_recipes = [
        {
            "id": "recipe1",
            "name": "Pasta with Tomato Sauce",
            "ingredients": ["Pasta", "Tomatoes", "Garlic", "Olive Oil", "Salt"],
            "match_score": 0.95,  # How well it matches with pantry
            "missing_ingredients": []
        },
        {
            "id": "recipe2",
            "name": "Scrambled Eggs",
            "ingredients": ["Eggs", "Milk", "Salt"],
            "match_score": 0.9,
            "missing_ingredients": []
        },
        {
            "id": "recipe3",
            "name": "Chicken Stir Fry",
            "ingredients": ["Chicken Breast", "Garlic", "Olive Oil", "Salt"],
            "match_score": 0.6,
            "missing_ingredients": ["Chicken Breast"]
        },
        {
            "id": "recipe4",
            "name": "Yogurt with Honey",
            "ingredients": ["Yogurt", "Honey"],
            "match_score": 0.5,
            "missing_ingredients": ["Honey"]
        },
        {
            "id": "recipe5",
            "name": "Basic Pancakes",
            "ingredients": ["Flour", "Eggs", "Milk", "Salt"],
            "match_score": 0.85,
            "missing_ingredients": []
        }
    ]
    
    # In a real app, you'd filter recipes based on what's in the pantry
    inventory = await get_pantry_inventory(user_id)
    pantry_items = [item.name.lower() for item in inventory.items if item.status == PantryItemStatus.AVAILABLE]
    
    # Update recipe match scores and missing ingredients based on pantry
    for recipe in mock_recipes:
        missing = []
        available = 0
        for ingredient in recipe["ingredients"]:
            if ingredient.lower() in pantry_items:
                available += 1
            else:
                missing.append(ingredient)
        
        recipe["match_score"] = available / len(recipe["ingredients"])
        recipe["missing_ingredients"] = missing
    
    # Sort recipes by match score and return the top matches
    sorted_recipes = sorted(mock_recipes, key=lambda x: x["match_score"], reverse=True)
    return sorted_recipes[:limit]

# Auto-update pantry after grocery purchase
async def update_pantry_from_grocery_list(user_id: str, grocery_items: List[Dict]) -> List[PantryItem]:
    """Update pantry inventory after a grocery list purchase"""
    updated_items = []
    
    for grocery_item in grocery_items:
        # Try to find the item in the pantry
        inventory = await get_pantry_inventory(user_id)
        item_found = False
        
        for pantry_item in inventory.items:
            if pantry_item.name.lower() == grocery_item["name"].lower():
                # Update the existing item
                update_req = UpdatePantryItemRequest(
                    id=pantry_item.id,
                    quantity=pantry_item.quantity + float(grocery_item.get("quantity", 1)),
                    purchase_date=grocery_item.get("purchase_date", date.today()),
                    expiry_date=grocery_item.get("expiry_date", None),
                    status=PantryItemStatus(grocery_item.get("status", "available")) if grocery_item.get("status") in [e.value for e in PantryItemStatus] else PantryItemStatus.AVAILABLE
                )
                
                updated_item = await update_pantry_item(user_id, update_req)
                if updated_item:
                    updated_items.append(updated_item)
                item_found = True
                break
        
        if not item_found:
            # Add as a new pantry item
            new_item_req = AddPantryItemRequest(
                name=grocery_item["name"],
                category=grocery_item.get("category", "Pantry"),
                quantity=float(grocery_item.get("quantity", 1)),
                unit=QuantityUnit(grocery_item.get("unit", "count")) if grocery_item.get("unit") in [e.value for e in QuantityUnit] else QuantityUnit.COUNT,
                purchase_date=grocery_item.get("purchase_date", date.today()),
                expiry_date=grocery_item.get("expiry_date", None),
                status=grocery_item.get("status", None)  # Status will be determined automatically in add_pantry_item if not provided
            )
            
            new_item = await add_pantry_item(user_id, new_item_req)
            updated_items.append(new_item)
    
    return updated_items 
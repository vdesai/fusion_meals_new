from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime, date
from enum import Enum


class QuantityUnit(str, Enum):
    GRAMS = "g"
    KILOGRAMS = "kg"
    MILLILITERS = "ml"
    LITERS = "l"
    COUNT = "count"
    TABLESPOON = "tbsp"
    TEASPOON = "tsp"
    CUP = "cup"
    OUNCE = "oz"
    POUND = "lb"
    PINCH = "pinch"
    BUNCH = "bunch"
    PACKAGE = "package"
    CAN = "can"
    BOTTLE = "bottle"
    BOX = "box"
    OTHER = "other"


class PantryItemStatus(str, Enum):
    AVAILABLE = "available"
    LOW = "low"
    EXPIRED = "expired"
    OUT_OF_STOCK = "out_of_stock"


class PantryItem(BaseModel):
    id: Optional[str] = None  # Will be assigned by database
    name: str
    category: str
    quantity: float = 0
    unit: QuantityUnit
    expiry_date: Optional[date] = None
    purchase_date: Optional[date] = None
    status: PantryItemStatus = PantryItemStatus.AVAILABLE
    threshold_quantity: Optional[float] = None  # For low stock alerts
    notes: Optional[str] = None
    barcode: Optional[str] = None


class PantryInventory(BaseModel):
    user_id: str
    items: List[PantryItem] = []
    last_updated: datetime = Field(default_factory=datetime.now)


class AddPantryItemRequest(BaseModel):
    name: str
    category: str
    quantity: float
    unit: QuantityUnit
    expiry_date: Optional[date] = None
    purchase_date: Optional[date] = None
    threshold_quantity: Optional[float] = None
    notes: Optional[str] = None
    barcode: Optional[str] = None
    status: Optional[PantryItemStatus] = None


class UpdatePantryItemRequest(BaseModel):
    id: str
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[QuantityUnit] = None
    expiry_date: Optional[date] = None
    purchase_date: Optional[date] = None
    status: Optional[PantryItemStatus] = None
    threshold_quantity: Optional[float] = None
    notes: Optional[str] = None
    barcode: Optional[str] = None


class RemovePantryItemRequest(BaseModel):
    id: str


class MissingIngredientData(BaseModel):
    ingredient: PantryItem
    required_quantity: float
    required_unit: QuantityUnit
    sufficient: bool = False


class RecipeIngredientCheckRequest(BaseModel):
    user_id: str
    recipe_ingredients: List[Dict[str, str]]  # Format: [{"name": "salt", "quantity": "1", "unit": "tsp"}, ...]


class RecipeIngredientCheckResponse(BaseModel):
    can_make_recipe: bool
    missing_ingredients: List[MissingIngredientData] = []
    insufficient_ingredients: List[MissingIngredientData] = []
    available_ingredients: List[PantryItem] = [] 
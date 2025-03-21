from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from datetime import datetime, date

from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    """User model for authentication and user-specific data"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    pantry_items = relationship("PantryItem", back_populates="owner")
    
    def __repr__(self):
        return f"<User {self.username}>"

class PantryItem(Base):
    """Database model for pantry items"""
    __tablename__ = "pantry_items"
    
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, index=True)
    category = Column(String, index=True)
    quantity = Column(Float, default=0)
    unit = Column(String)  # Corresponds to QuantityUnit enum
    purchase_date = Column(Date, default=date.today)
    expiry_date = Column(Date, nullable=True)
    status = Column(String)  # Corresponds to PantryItemStatus enum
    threshold_quantity = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    barcode = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="pantry_items")
    
    def __repr__(self):
        return f"<PantryItem {self.name} ({self.quantity} {self.unit})>" 
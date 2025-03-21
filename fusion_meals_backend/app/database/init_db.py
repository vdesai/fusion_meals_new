from app.database.database import Base, engine
from app.database.models import User, PantryItem

def init_database():
    """Create all database tables if they don't exist"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

if __name__ == "__main__":
    init_database() 
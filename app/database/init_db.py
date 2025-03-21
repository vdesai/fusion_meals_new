from app.database.database import engine, Base
from app.database.models import User, PantryItem
import logging

def init_database():
    """
    Initialize the database by creating all tables defined in the models.
    This function should be called once when the application starts to ensure all required 
    tables exist in the database.
    """
    try:
        # Create all tables that don't exist yet
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        logging.error(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    # This allows running this file directly to initialize the database
    print("Initializing database...")
    init_database()
    print("Database initialization complete!") 
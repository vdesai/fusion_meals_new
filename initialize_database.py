#!/usr/bin/env python
"""
Database Initialization Script for Fusion Meals

This script initializes the PostgreSQL database for the Fusion Meals application.
It creates all necessary tables if they don't already exist.

Usage:
    python initialize_database.py

The script expects a DATABASE_URL environment variable or uses the default connection string.
"""

import sys
import os

# Add the current directory to the path so imports work correctly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # First try to import directly from the backend directory
    from fusion_meals_backend.app.database.init_db import init_database
except ImportError:
    try:
        # If that fails, try to import from the regular app path
        from app.database.init_db import init_database
    except ImportError:
        print("❌ Error: Could not import database initialization module.")
        print("Please run this script from the project root directory.")
        sys.exit(1)

if __name__ == "__main__":
    print("=== Fusion Meals Database Initialization ===")
    print(f"Using database URL: {os.getenv('DATABASE_URL', 'postgresql://vinitdesai@localhost:5432/fusion_meals')}")
    print("Initializing database...")
    
    try:
        # Initialize the database
        init_database()
        print("\n✅ Database initialization completed successfully!")
        print("\nYou can now start the application with:")
        print("    python -m uvicorn app.main:app --reload")
    except Exception as e:
        print(f"\n❌ Error initializing database: {str(e)}")
        sys.exit(1) 
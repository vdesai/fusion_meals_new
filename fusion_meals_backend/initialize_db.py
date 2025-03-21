#!/usr/bin/env python
"""
Database Initialization Script for Fusion Meals Backend

This script initializes the PostgreSQL database for the Fusion Meals application.
It creates all necessary tables if they don't already exist.

Usage:
    cd fusion_meals_backend
    python initialize_db.py

The script expects a DATABASE_URL environment variable or uses the default connection string.
"""

import os
import sys
from app.database.init_db import init_database

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
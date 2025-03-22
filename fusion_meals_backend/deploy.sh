#!/bin/bash

# This script is used by Render to start the application
# It explicitly sets up the proper CORS handling

echo "Starting Fusion Meals Backend..."
echo "Current directory: $(pwd)"

# Install dependencies if needed
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the application with Uvicorn
echo "Starting server on port $PORT"
exec uvicorn main:app --host 0.0.0.0 --port $PORT 
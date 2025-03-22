#!/bin/bash

# This script is used by Render to start the application
# It explicitly sets up the proper CORS handling

echo "Starting Fusion Meals Backend..."
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"

# Install dependencies if needed
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Set environment variables for CORS
export ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,https://fusion-meals.vercel.app,https://fusion-meals-new.vercel.app,https://fusion-meals-v2.vercel.app,https://*.vercel.app"

# Print key environment variables (without sensitive information)
echo "PORT: $PORT"
echo "ALLOWED_ORIGINS: $ALLOWED_ORIGINS"
echo "Environment variables set"

# Start the application with Uvicorn
echo "Starting server on port $PORT"
exec uvicorn main:app --host 0.0.0.0 --port $PORT 
#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Fusion Meals Quick Production Deployment ===${NC}"
echo
echo -e "This script will deploy your Fusion Meals application to Heroku for production testing."
echo

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}Heroku CLI not found!${NC}"
    echo "Please install Heroku CLI first by running:"
    echo "npm install -g heroku"
    exit 1
fi

# Check if logged in to Heroku
echo -e "${YELLOW}Checking Heroku login status...${NC}"
heroku whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Logging in to Heroku...${NC}"
    heroku login
else
    echo -e "${GREEN}Already logged in to Heroku${NC}"
fi

# Deploy backend
echo
echo -e "${YELLOW}=== Deploying Backend to Heroku ===${NC}"
cd fusion_meals_backend

# Create Procfile if it doesn't exist
if [ ! -f "Procfile" ]; then
    echo -e "${YELLOW}Creating Procfile...${NC}"
    echo "web: node server.js" > Procfile
    echo -e "${GREEN}Created Procfile${NC}"
fi

# Create Heroku app for the backend
echo -e "${YELLOW}Creating Heroku app for backend...${NC}"
BACKEND_APP_NAME="fusion-meals-api-$(date +%s)"
heroku create $BACKEND_APP_NAME
BACKEND_URL=$(heroku info -s | grep web_url | cut -d= -f2)
echo -e "${GREEN}Backend will be available at: ${BACKEND_URL}${NC}"

# Deploy backend to Heroku
echo -e "${YELLOW}Deploying backend code...${NC}"
git init
git add .
git commit -m "Initial backend deployment"
git push heroku master

echo -e "${GREEN}Backend deployed successfully!${NC}"

# Return to root directory
cd ..

# Deploy frontend
echo
echo -e "${YELLOW}=== Deploying Frontend to Heroku ===${NC}"
cd fusion_meals_frontend

# Create Procfile for frontend if it doesn't exist
if [ ! -f "Procfile" ]; then
    echo -e "${YELLOW}Creating Procfile for frontend...${NC}"
    echo "web: npm run start" > Procfile
    echo -e "${GREEN}Created Procfile${NC}"
fi

# Update .env.local with backend URL
echo -e "${YELLOW}Updating environment variables...${NC}"
echo "NEXT_PUBLIC_API_URL=${BACKEND_URL}" > .env
echo "NEXT_PUBLIC_USE_MOCK_DATA=false" >> .env
echo -e "${GREEN}Updated environment variables${NC}"

# Create Heroku app for the frontend
echo -e "${YELLOW}Creating Heroku app for frontend...${NC}"
FRONTEND_APP_NAME="fusion-meals-web-$(date +%s)"
heroku create $FRONTEND_APP_NAME
FRONTEND_URL=$(heroku info -s | grep web_url | cut -d= -f2)

# Set environment variable for the frontend app
heroku config:set NEXT_PUBLIC_API_URL="${BACKEND_URL}" -a $FRONTEND_APP_NAME
heroku config:set NEXT_PUBLIC_USE_MOCK_DATA="false" -a $FRONTEND_APP_NAME

# Deploy frontend to Heroku
echo -e "${YELLOW}Deploying frontend code...${NC}"
git init
git add .
git commit -m "Initial frontend deployment"
git push heroku master

echo -e "${GREEN}Frontend deployed successfully!${NC}"

# Return to root directory
cd ..

# Display success message
echo
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "Backend API URL: ${BACKEND_URL}"
echo -e "Frontend URL: ${FRONTEND_URL}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Access your frontend at: ${FRONTEND_URL}"
echo "2. Test API endpoints at: ${BACKEND_URL}api/restaurant-dishes/search?query=chicken"
echo "3. Check logs with: heroku logs --tail -a $BACKEND_APP_NAME"
echo
echo -e "${YELLOW}Note:${NC} The first request might be slow due to Heroku's cold start." 
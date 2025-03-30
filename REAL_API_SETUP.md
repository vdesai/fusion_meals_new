# Setting Up Your Real Backend API

This guide helps you set up and run a real backend API for your Fusion Meals application instead of using mock data.

## Setup Instructions

1. **Install Dependencies**

   Run the following command to install all dependencies for both the frontend and backend:
   ```
   npm run install:all
   ```
   
   This will install dependencies for the main project, frontend, and backend.

2. **Start the Backend Server**

   To start only the backend server:
   ```
   cd fusion_meals_backend
   npm run dev
   ```
   
   The server will start on port 8000 by default.

3. **Configure Frontend to Use Real Backend**

   Update the `.env.local` file in the `fusion_meals_frontend` directory:
   ```
   NEXT_PUBLIC_API_URL=https://fusion-meals-new.onrender.com
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

   > **Note**: For production deployments, you should set these environment variables in your hosting platform's dashboard (e.g., Vercel) rather than committing them to the repository.

4. **Start the Frontend**

   To start only the frontend:
   ```
   cd fusion_meals_frontend
   npm run dev
   ```

5. **Run Both Frontend and Backend**

   Alternatively, you can run both the frontend and backend with a single command:
   ```
   npm start
   ```

## Customizing the Backend

You can customize the backend by:

1. Adding more dish data to `fusion_meals_backend/data/restaurant-dishes.json`
2. Implementing additional endpoints in `fusion_meals_backend/server.js`
3. Connecting to a database instead of using the JSON file storage

## Troubleshooting

- If you see "No dishes found" in the search results, check that:
  - The backend server is running
  - The frontend is configured to use the correct API URL
  - There is data in the `restaurant-dishes.json` file
  - Check your browser console for any errors

- If there are connection errors, ensure:
  - Backend server is running on port 8000
  - No firewall is blocking the connection
  - CORS is properly configured (should be fine by default)

## Production Backend

The production backend is hosted at [https://fusion-meals-new.onrender.com](https://fusion-meals-new.onrender.com) with the following endpoints:

- `/recipes`
- `/meal-plans`
- `/grocery`
- `/email`
- `/ingredient-substitution`
- `/recipe-scaling`
- `/recipe-analysis`
- `/recipe-sharing`
- `/ai-chef`
- `/global-cuisine`
- `/meal-prep`

To verify the backend is running, you can visit the root URL which should return a status message 
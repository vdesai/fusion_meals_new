# Fusion Meals Backend API

This is the backend API server for the Fusion Meals application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /api/restaurant-dishes/search?query=<search-term>` - Search for restaurant dishes
- `GET /api/restaurant-dishes/:id` - Get a specific dish by ID
- `GET /api/restaurant-dishes/popular` - Get popular dishes
- `GET /api/user/saved-transformations` - Get saved transformations
- `POST /api/user/saved-transformations` - Save a transformation
- `POST /api/restaurant-dishes` - Add a new dish

## Data Storage

The application uses a JSON file (`data/restaurant-dishes.json`) to store dish data. In a production environment, this would be replaced with a proper database. 
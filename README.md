# Fusion Meals

Fusion Meals is a comprehensive recipe and meal planning application that combines AI-powered culinary creativity with practical meal planning tools. The app helps users discover unique fusion recipes, plan their meals, and optimize their cooking process.

## Features

- **AI-Powered Recipe Generation**: Create unique fusion recipes based on your preferences and dietary requirements
- **Meal Planning**: Generate personalized weekly meal plans
- **Ingredient Substitution**: Find suitable replacements for ingredients you don't have
- **Recipe Scaling**: Adjust recipe portions to your needs
- **Recipe Analysis**: Get nutritional information and cooking insights
- **Recipe Sharing**: Share your favorite recipes with friends and family
- **Global Cuisine Explorer**: Discover dishes and techniques from around the world
- **Smart Meal Prep Assistant**: Optimize your cooking time and batch cooking
- **Smart Pantry Management**: Track ingredients and get alerts for expiring items
- **Grocery Lists**: Generate shopping lists based on your recipes and meal plans

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL
- OpenAI API integration
- Amazon Product API (for grocery suggestions)

### Frontend
- Next.js
- React
- TypeScript
- Material UI
- Tailwind CSS

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL database

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd fusion_meals_backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy the example environment file and update it with your credentials:
   ```
   cp .env.example .env
   ```

5. Initialize the database:
   ```
   python initialize_db.py
   ```

6. Start the backend server:
   ```
   python -m uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd fusion_meals_frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the example environment file and update it with your credentials:
   ```
   cp .env.example .env.local
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser to access the application.

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API that powers our recipe generation
- All contributors and users of Fusion Meals 
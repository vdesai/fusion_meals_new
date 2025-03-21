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

## Contributing

We welcome contributions to Fusion Meals! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

Please make sure to update tests as appropriate and ensure your code follows our coding standards.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API that powers our recipe generation
- All contributors and users of Fusion Meals

## Deployment

### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one.
2. Push your repository to GitHub.
3. Log in to Vercel and click "Import Project".
4. Select your GitHub repository.
5. Configure the project:
   - Set the Framework Preset to "Next.js"
   - Configure your Environment Variables:
     - `NEXTAUTH_SECRET`: A secure random string
     - `NEXTAUTH_URL`: Your deployment URL (can use `${VERCEL_URL}`)
     - `BACKEND_URL`: Your deployed backend URL
     - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: If using Google auth
6. Click "Deploy" and wait for the deployment to complete.

### Backend Deployment (Render/Railway)

1. Create an account on [Render](https://render.com) or [Railway](https://railway.app).
2. Set up a new Web Service pointing to your backend repository.
3. Configure the build command: `pip install -r requirements.txt`
4. Configure the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Note: For Render specifically, make sure to use the app module path (`app.main:app`) or it won't find your application.
5. Set up Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET_KEY`: A secure random string
   - `FRONTEND_URL`: Your Vercel deployment URL
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., `https://your-app.vercel.app,https://your-domain.com`)
   - Include any other API keys or secrets needed

### Database Deployment

1. Create a PostgreSQL database on [Render](https://render.com), [Railway](https://railway.app), or [Neon](https://neon.tech).
2. Obtain the connection string.
3. Set the `DATABASE_URL` environment variable in your backend deployment.
4. Run migrations on your deployed backend.

## Troubleshooting Deployment

### Common Vercel Issues
- If you encounter NextAuth errors, ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are properly set.
- For API connection issues, verify your `BACKEND_URL` and confirm CORS settings on the backend.

### Common Backend Issues
- Ensure CORS is properly configured to allow requests from your Vercel domain.
- Verify database connection by checking logs.
- If you get a `Could not import module "main"` error on Render:
  - Make sure your start command is `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (not `uvicorn main:app`)
  - This specifies the correct path to your main application file in the app directory
  - Alternatively, use the provided `main.py` file in the root directory that imports from app.main
- If you get a `ModuleNotFoundError: No module named 'xyz'` error:
  - Check if the missing package is in your requirements.txt file
  - Add any missing dependencies to requirements.txt
  - Force a rebuild in your Render dashboard or by pushing a new commit 
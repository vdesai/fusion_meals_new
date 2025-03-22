from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import fusion_recipe, meal_plan, email, grocery, ingredient_substitution, recipe_scaling, recipe_analysis, recipe_sharing, ai_chef, global_cuisine, meal_prep, pantry
import os

app = FastAPI()

# Add a root endpoint for health checks and debugging
@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Fusion Meals API is running",
        "available_endpoints": [
            "/recipes",
            "/meal-plans",
            "/grocery",
            "/email",
            "/ingredient-substitution",
            "/recipe-scaling",
            "/recipe-analysis",
            "/recipe-sharing",
            "/ai-chef",
            "/global-cuisine",
            "/meal-prep"
        ]
    }

app.include_router(email.router, prefix="/email", tags=["Email"])  # ✅ Include router

# Get allowed origins from environment or use defaults
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://127.0.0.1:3000,https://fusion-meals.vercel.app,https://fusion-meals-new.vercel.app,https://*.vercel.app,https://fusion-meals-new.vercel.app"
).split(",")

# CORS Middleware enhanced configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now - you can restrict later
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly list OPTIONS
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Add OPTIONS handler for all routes
@app.options("/{rest_of_path:path}")
async def options_route(rest_of_path: str):
    """
    Handle OPTIONS requests to support CORS preflight requests
    """
    return {}  # Return empty JSON with 200 status code

# ✅ Router inclusion
app.include_router(fusion_recipe.router, prefix="/recipes", tags=["Fusion Recipe"])
app.include_router(meal_plan.router, prefix="/meal-plans", tags=["Meal Plan"])
app.include_router(grocery.router, prefix="/grocery", tags=["Grocery"])  # ✅ Include grocery router
app.include_router(ingredient_substitution.router, prefix="/ingredient-substitution", tags=["Ingredient Substitution"])  # Add ingredient substitution router
app.include_router(recipe_scaling.router, prefix="/recipe-scaling", tags=["Recipe Scaling"])  # Add recipe scaling router
app.include_router(recipe_analysis.router, prefix="/recipe-analysis", tags=["Recipe Analysis"])  # Add recipe analysis router
app.include_router(recipe_sharing.router, prefix="/recipe-sharing", tags=["Recipe Sharing"])  # Add recipe sharing router
app.include_router(ai_chef.router, prefix="/ai-chef", tags=["AI Personal Chef"])  # Add premium AI Chef router
app.include_router(global_cuisine.router, prefix="/global-cuisine", tags=["Global Cuisine Explorer"])  # Add Global Cuisine Explorer router
app.include_router(meal_prep.router, prefix="/meal-prep", tags=["Smart Meal Prep Assistant"])  # Add Smart Meal Prep Assistant router
app.include_router(pantry.router, prefix="/pantry", tags=["Smart Pantry Management"])  # Add Smart Pantry Management router

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import fusion_recipe, meal_plan, email, grocery, ingredient_substitution, recipe_scaling, recipe_analysis, recipe_sharing, ai_chef, global_cuisine, meal_prep, pantry
from app.database.init_db import init_database

# Create FastAPI app
app = FastAPI()

# Initialize the database
init_database()

app.include_router(email.router, prefix="/email", tags=["Email"])  # ✅ Include router

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
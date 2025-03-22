from fastapi import FastAPI, Request, Response
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

# Get allowed origins from environment or use defaults
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://127.0.0.1:3000,https://fusion-meals.vercel.app,https://fusion-meals-new.vercel.app,https://*.vercel.app,https://fusion-meals-v2.vercel.app"
).split(",")

# Add middleware to handle CORS requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now (can restrict later)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Global middleware to manually handle CORS preflight OPTIONS requests
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    # If it's an OPTIONS request, return a preflight response immediately
    if request.method == "OPTIONS":
        response = Response(
            status_code=200,
            content="",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "3600",
            },
        )
        return response
    
    # For all other requests, proceed to normal processing
    response = await call_next(request)
    return response

# Add OPTIONS handler for all routes
@app.options("/{rest_of_path:path}")
async def options_route(rest_of_path: str):
    """
    Handle OPTIONS requests to support CORS preflight requests
    """
    return {}  # Return empty JSON with 200 status code

# Include all routers after CORS middleware
app.include_router(email.router, prefix="/email", tags=["Email"])
app.include_router(fusion_recipe.router, prefix="/recipes", tags=["Fusion Recipe"])
app.include_router(meal_plan.router, prefix="/meal-plans", tags=["Meal Plan"])
app.include_router(grocery.router, prefix="/grocery", tags=["Grocery"])
app.include_router(ingredient_substitution.router, prefix="/ingredient-substitution", tags=["Ingredient Substitution"])
app.include_router(recipe_scaling.router, prefix="/recipe-scaling", tags=["Recipe Scaling"])
app.include_router(recipe_analysis.router, prefix="/recipe-analysis", tags=["Recipe Analysis"])
app.include_router(recipe_sharing.router, prefix="/recipe-sharing", tags=["Recipe Sharing"])
app.include_router(ai_chef.router, prefix="/ai-chef", tags=["AI Personal Chef"])
app.include_router(global_cuisine.router, prefix="/global-cuisine", tags=["Global Cuisine Explorer"])
app.include_router(meal_prep.router, prefix="/meal-prep", tags=["Smart Meal Prep Assistant"])
app.include_router(pantry.router, prefix="/pantry", tags=["Smart Pantry Management"])

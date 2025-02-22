from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import fusion_recipe, meal_plan

from app.routers import email  # ✅ Import email router


app = FastAPI()

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

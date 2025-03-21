from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
import random

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

router = APIRouter()

class MealPrepRequest(BaseModel):
    available_time: int  # Minutes available for meal prep
    cooking_days: List[str]  # Days of the week when the user can cook (e.g., ["Saturday", "Sunday"])
    servings: int = 1
    dietary_restrictions: Optional[List[str]] = None
    preferences: Optional[List[str]] = None
    skill_level: Optional[str] = "intermediate"  # beginner, intermediate, advanced
    equipment: Optional[List[str]] = None  # e.g., ["slow cooker", "pressure cooker", "blender"]

class TimeOptimizedRecipeRequest(BaseModel):
    max_active_time: int  # Maximum active cooking time in minutes
    meal_type: Optional[str] = None  # breakfast, lunch, dinner, snack
    servings: int = 1
    dietary_restrictions: Optional[List[str]] = None
    preferences: Optional[List[str]] = None

class LeftoverTransformRequest(BaseModel):
    leftover_ingredients: List[str]  # List of leftover ingredients
    original_dish: Optional[str] = None  # What the leftovers were originally
    dietary_restrictions: Optional[List[str]] = None
    preferences: Optional[List[str]] = None
    meal_type: Optional[str] = None  # breakfast, lunch, dinner, snack

@router.post("/batch-cooking-plan")
async def create_batch_cooking_plan(request: MealPrepRequest):
    """
    Generate a batch cooking plan optimized for busy professionals.
    The plan includes recipes that can be prepared in the available time
    and provides a schedule for cooking and eating throughout the week.
    """
    try:
        # Build system prompt
        system_prompt = """You are a meal preparation expert for busy professionals.
        Create a detailed batch cooking plan that maximizes efficiency and minimizes daily cooking time.
        Focus on recipes that store well, can be made in large batches, and can be quickly reheated.
        Consider the user's available time, cooking days, dietary restrictions, and preferences.
        Provide instructions for how to efficiently batch cook multiple meals in one session.
        Include a schedule showing which days to cook and which days to eat the prepared meals."""

        # Build user prompt
        restrictions_text = ", ".join(request.dietary_restrictions) if request.dietary_restrictions else "none"
        preferences_text = ", ".join(request.preferences) if request.preferences else "no specific preferences"
        equipment_text = ", ".join(request.equipment) if request.equipment else "basic kitchen equipment"
        
        user_prompt = f"""
        Create a detailed batch cooking plan for a busy professional with the following parameters:
        - Available time for meal prep: {request.available_time} minutes
        - Days available for cooking: {", ".join(request.cooking_days)}
        - Number of servings: {request.servings}
        - Dietary restrictions: {restrictions_text}
        - Food preferences: {preferences_text}
        - Cooking skill level: {request.skill_level}
        - Available equipment: {equipment_text}
        
        Please provide:
        1. A shopping list organized by section (produce, proteins, pantry items, etc.)
        2. A detailed cooking plan with steps optimized for efficiency
        3. Storage instructions for each prepared component
        4. A weekly meal schedule showing what to eat each day
        5. Quick assembly instructions for each meal
        
        Return the response as JSON with the following structure:
        {
          "shopping_list": {
            "produce": ["item1", "item2"],
            "proteins": ["item1", "item2"],
            "pantry": ["item1", "item2"],
            "dairy": ["item1", "item2"],
            "other": ["item1", "item2"]
          },
          "cooking_plan": {
            "prep_steps": [
              {"step": 1, "description": "...", "time": "X minutes"},
              {"step": 2, "description": "...", "time": "X minutes"}
            ],
            "total_active_time": "X minutes",
            "total_passive_time": "X minutes"
          },
          "recipes": [
            {
              "name": "Recipe Name",
              "ingredients": ["ingredient1", "ingredient2"],
              "storage_instructions": "...",
              "reheating_instructions": "...",
              "nutrition_info": {"calories": X, "protein": "Xg", "carbs": "Xg", "fat": "Xg"},
              "meal_category": "breakfast/lunch/dinner"
            }
          ],
          "weekly_schedule": {
            "Monday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
            "Tuesday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
            // etc for each day of the week
          },
          "tips": ["tip1", "tip2", "tip3"]
        }
        """

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        # Parse and return the response
        plan_data = json.loads(response.choices[0].message.content)
        return plan_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating batch cooking plan: {str(e)}")

@router.post("/time-optimized-recipes")
async def get_time_optimized_recipes(request: TimeOptimizedRecipeRequest):
    """
    Return recipes that can be prepared within the specified active cooking time.
    These recipes are optimized for busy professionals with limited time.
    """
    try:
        # Build system prompt
        system_prompt = """You are a culinary expert specialized in quick, efficient cooking.
        Provide recipes that can be prepared within the specified active cooking time.
        Focus on efficiency, minimal steps, and techniques that maximize flavor with minimal effort.
        Consider the user's dietary restrictions and preferences.
        Active cooking time means time when the cook must be actively involved, not waiting time."""

        # Build user prompt
        restrictions_text = ", ".join(request.dietary_restrictions) if request.dietary_restrictions else "none"
        preferences_text = ", ".join(request.preferences) if request.preferences else "no specific preferences"
        meal_type_text = f"for {request.meal_type}" if request.meal_type else "for any meal"
        
        user_prompt = f"""
        Provide 3 recipe options that require no more than {request.max_active_time} minutes of active cooking time {meal_type_text}.
        - Number of servings: {request.servings}
        - Dietary restrictions: {restrictions_text}
        - Food preferences: {preferences_text}
        
        For each recipe, please include:
        1. Name and brief description
        2. Ingredients list with quantities
        3. Step-by-step instructions with time estimates for each step
        4. Total active cooking time (time when cook must be present and working)
        5. Total passive time (e.g., baking time when cook can do other things)
        6. Nutritional information
        7. Tips for making the recipe even more efficient
        
        Return the response as JSON with the following structure:
        {{
          "recipes": [
            {{
              "name": "Recipe Name",
              "description": "Brief description",
              "ingredients": ["1 cup of X", "2 tablespoons of Y"],
              "instructions": [
                {{
                  "step": 1,
                  "description": "...",
                  "time": "X minutes",
                  "is_active": true/false
                }}
              ],
              "active_time": "X minutes",
              "passive_time": "X minutes",
              "total_time": "X minutes",
              "nutrition_info": {{"calories": X, "protein": "Xg", "carbs": "Xg", "fat": "Xg"}},
              "efficiency_tips": ["tip1", "tip2"]
            }}
          ]
        }}
        """

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        # Parse and return the response
        recipes_data = json.loads(response.choices[0].message.content)
        return recipes_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting time-optimized recipes: {str(e)}")

@router.post("/transform-leftovers")
async def transform_leftovers(request: LeftoverTransformRequest):
    """
    Generate creative recipe ideas to transform leftover ingredients or dishes
    into new, exciting meals. Helps reduce food waste and save time.
    """
    try:
        # Build system prompt
        system_prompt = """You are a creative chef specializing in transforming leftovers into new, exciting dishes.
        Generate recipes that use the specified leftover ingredients to create completely different meals.
        Focus on minimal additional ingredients, quick preparation, and maximum flavor transformation.
        Consider the user's dietary restrictions and preferences."""

        # Build user prompt
        restrictions_text = ", ".join(request.dietary_restrictions) if request.dietary_restrictions else "none"
        preferences_text = ", ".join(request.preferences) if request.preferences else "no specific preferences"
        original_dish_text = f"The original dish was: {request.original_dish}. " if request.original_dish else ""
        meal_type_text = f"for {request.meal_type}" if request.meal_type else "for any meal"
        
        user_prompt = f"""
        Create 2-3 creative recipe ideas to transform these leftover ingredients {meal_type_text}:
        - Leftover ingredients: {", ".join(request.leftover_ingredients)}
        - {original_dish_text}
        - Dietary restrictions: {restrictions_text}
        - Food preferences: {preferences_text}

        For each recipe transformation, please include:
        1. Name and brief description
        2. Additional ingredients needed (aim to minimize these)
        3. Step-by-step instructions
        4. Total preparation time
        5. Tips for customization
        
        Return the response as JSON with the following structure:
        {{
          "transformations": [
            {{
              "name": "New Dish Name",
              "description": "Brief description",
              "leftover_ingredients_used": ["ingredient1", "ingredient2"],
              "additional_ingredients": ["ingredient1", "ingredient2"],
              "instructions": [
                {{
                  "step": 1,
                  "description": "..."
                }}
              ],
              "prep_time": "X minutes",
              "cooking_time": "X minutes",
              "customization_tips": ["tip1", "tip2"]
            }}
          ],
          "general_tips": ["tip for using leftovers effectively", "storage recommendation"]
        }}
        """

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        # Parse and return the response
        transformation_data = json.loads(response.choices[0].message.content)
        return transformation_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error transforming leftovers: {str(e)}") 
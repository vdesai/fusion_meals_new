from fastapi import APIRouter, HTTPException, Depends, Cookie
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
import time
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

router = APIRouter()

# Mock premium user database
# In a real application, this would be stored in a database
PREMIUM_USERS = {
    "demo_user": {
        "subscription_level": "premium",
        "expiry_date": (datetime.now() + timedelta(days=30)).isoformat(),
        "preferences": {
            "cuisine_preferences": ["Italian", "Japanese", "Mexican"],
            "dietary_restrictions": ["Low Carb"],
            "cooking_skill": "intermediate",
            "household_size": 2,
            "favorite_ingredients": ["chicken", "avocado", "salmon"],
            "disliked_ingredients": ["cilantro", "blue cheese"]
        }
    }
}

class UserPreferences(BaseModel):
    cuisine_preferences: List[str]
    dietary_restrictions: List[str]
    cooking_skill: str
    household_size: int
    favorite_ingredients: List[str] = []
    disliked_ingredients: List[str] = []

class PremiumUserUpdate(BaseModel):
    subscription_level: str
    preferences: Optional[UserPreferences] = None

class AIChefRequest(BaseModel):
    request_type: str  # "meal_plan", "cooking_guidance", "ingredient_sourcing", "recipe_curation", "student_meals"
    recipe_text: Optional[str] = None
    occasion: Optional[str] = None
    timeframe: Optional[str] = None
    budget_level: Optional[str] = None
    specific_ingredient: Optional[str] = None
    cuisine_type: Optional[str] = None
    cooking_method: Optional[str] = None
    detailed_instructions: bool = True
    video_instructions: bool = False
    # New fields for student meals
    kitchen_equipment: Optional[str] = None
    cooking_skill: Optional[str] = None
    prep_time_limit: Optional[str] = None
    dietary_preference: Optional[str] = None

class AIChefResponse(BaseModel):
    premium_content: Dict[str, Any]
    user_subscription: Dict[str, Any]
    request_remaining: int
    suggestions: List[str]

def get_user_subscription(session_id: Optional[str] = Cookie(None)):
    """
    Get user subscription details from the session ID
    In a real app, this would query a database
    """
    if not session_id:
        return None
        
    # For demo purposes, we're just returning the mock premium user
    user_id = "demo_user"
    
    if user_id in PREMIUM_USERS:
        return {
            "user_id": user_id,
            "subscription": PREMIUM_USERS[user_id]
        }
    return None

@router.post("/premium/ai-chef", response_model=AIChefResponse)
async def ai_personal_chef(req: AIChefRequest, user_data: Optional[Dict] = Depends(get_user_subscription)):
    """
    AI Personal Chef - Premium feature that provides personalized meal planning,
    detailed cooking guidance, ingredient sourcing, and curated recipes.
    
    This is a premium feature that requires a subscription.
    """
    # Check if user has premium access
    if not user_data or user_data.get("subscription", {}).get("subscription_level") != "premium":
        raise HTTPException(status_code=403, detail={
            "message": "This is a premium feature. Please upgrade your subscription to access AI Personal Chef.",
            "upgrade_url": "/subscription/upgrade"
        })
    
    # Get user preferences
    user_preferences = user_data["subscription"].get("preferences", {})
    
    # Prepare prompt based on request type
    if req.request_type == "meal_plan":
        prompt = generate_meal_plan_prompt(req, user_preferences)
    elif req.request_type == "cooking_guidance":
        prompt = generate_cooking_guidance_prompt(req, user_preferences)
    elif req.request_type == "ingredient_sourcing":
        prompt = generate_ingredient_sourcing_prompt(req, user_preferences)
    elif req.request_type == "recipe_curation":
        prompt = generate_recipe_curation_prompt(req, user_preferences)
    elif req.request_type == "student_meals":
        prompt = generate_student_meals_prompt(req, user_preferences)
    else:
        raise HTTPException(status_code=400, detail="Invalid request type")
    
    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an AI Personal Chef assistant that creates premium culinary content for paying subscribers. Provide detailed, personalized responses in JSON format."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse response
        response_content = json.loads(response.choices[0].message.content)
        
        # Add metadata about the subscription
        result = {
            "premium_content": response_content,
            "user_subscription": {
                "level": user_data["subscription"]["subscription_level"],
                "expiry_date": user_data["subscription"]["expiry_date"],
            },
            "request_remaining": 25,  # In a real app, this would be tracked
            "suggestions": get_personalized_suggestions(req.request_type, user_preferences)
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI Chef response: {str(e)}")

@router.post("/subscription/update")
async def update_premium_status(update: PremiumUserUpdate, user_data: Optional[Dict] = Depends(get_user_subscription)):
    """
    Update a user's premium subscription status
    In a real app, this would connect to a payment processor
    """
    if not user_data:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    user_id = user_data["user_id"]
    
    # Update subscription level
    if user_id in PREMIUM_USERS:
        PREMIUM_USERS[user_id]["subscription_level"] = update.subscription_level
        if update.preferences:
            PREMIUM_USERS[user_id]["preferences"] = update.preferences.dict()
    else:
        PREMIUM_USERS[user_id] = {
            "subscription_level": update.subscription_level,
            "expiry_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "preferences": update.preferences.dict() if update.preferences else {}
        }
    
    return {"success": True, "user_id": user_id, "subscription": PREMIUM_USERS[user_id]}

@router.get("/subscription/status")
async def get_subscription_status(user_data: Optional[Dict] = Depends(get_user_subscription)):
    """
    Get a user's subscription status
    """
    if not user_data:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    return {
        "user_id": user_data["user_id"],
        "subscription": user_data["subscription"]
    }

def generate_meal_plan_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """Generate prompt for meal planning"""
    cuisine_prefs = ", ".join(user_preferences.get("cuisine_preferences", []))
    dietary = ", ".join(user_preferences.get("dietary_restrictions", []))
    household = user_preferences.get("household_size", 1)
    favorites = ", ".join(user_preferences.get("favorite_ingredients", []))
    dislikes = ", ".join(user_preferences.get("disliked_ingredients", []))
    
    timeframe = req.timeframe or "week"
    budget = req.budget_level or "moderate"
    
    prompt = f"""
    Create a premium personalized meal plan for a {timeframe} with a {budget} budget.
    
    User preferences:
    - Cuisine preferences: {cuisine_prefs}
    - Dietary restrictions: {dietary}
    - Household size: {household}
    - Favorite ingredients: {favorites}
    - Disliked ingredients: {dislikes}
    
    {f"Special occasion: {req.occasion}" if req.occasion else ""}
    
    Provide a detailed meal plan with:
    1. Daily meals (breakfast, lunch, dinner, snacks)
    2. Grocery list organized by store section
    3. Prep instructions for batch cooking
    4. Estimated costs and time requirements
    5. Wine or beverage pairings for each dinner
    6. Nutritional information
    
    Return as a JSON object with the following structure:
    {{
      "meal_plan": {{
        "days": [
          {{
            "day": "Monday",
            "breakfast": {{ "name": "", "description": "", "time_to_prepare": "", "calories": "" }},
            "lunch": {{ "name": "", "description": "", "time_to_prepare": "", "calories": "" }},
            "dinner": {{ "name": "", "description": "", "time_to_prepare": "", "calories": "", "wine_pairing": "" }},
            "snacks": [{{ "name": "", "description": "", "calories": "" }}]
          }}
          // repeat for each day
        ]
      }},
      "grocery_list": {{
        "produce": [""],
        "protein": [""],
        "dairy": [""],
        "grains": [""],
        "other": [""]
      }},
      "meal_prep_guide": {{"day": "", "instructions": [""], "storage_tips": [""]}},
      "estimated_total_cost": "",
      "nutrition_summary": {{ "average_daily_calories": "", "protein_ratio": "", "carb_ratio": "", "fat_ratio": "" }}
    }}
    """
    return prompt

def generate_cooking_guidance_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """Generate prompt for cooking guidance"""
    skill_level = user_preferences.get("cooking_skill", "intermediate")
    
    prompt = f"""
    Provide premium cooking guidance for the following recipe:
    
    {req.recipe_text}
    
    User's cooking skill: {skill_level}
    
    Create a comprehensive cooking guide with:
    1. Step-by-step instructions with professional chef techniques
    2. Timing guide for perfect execution
    3. Common mistakes to avoid
    4. Equipment recommendations
    5. Plating and presentation tips
    6. Advanced variations to elevate the dish
    {f"7. Visual guides for {req.cooking_method} method" if req.cooking_method else ""}
    
    {'Include video timestamps and specific techniques to look for in cooking videos' if req.video_instructions else ''}
    
    Return as a JSON object with the following structure:
    {{
      "recipe_overview": {{ "name": "", "difficulty": "", "estimated_time": "" }},
      "professional_techniques": [{{ "name": "", "description": "", "pro_tip": "" }}],
      "step_by_step_guide": [{{ "step": 1, "instruction": "", "timing": "", "chef_notes": "" }}],
      "common_pitfalls": [{{ "issue": "", "solution": "" }}],
      "equipment_recommendations": [{{ "item": "", "purpose": "", "alternative": "" }}],
      "plating_guide": {{ "description": "", "garnish_suggestions": [""], "presentation_tips": [""] }},
      "advanced_variations": [{{ "name": "", "modification": "", "additional_ingredients": [""] }}]
    }}
    """
    return prompt

def generate_ingredient_sourcing_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """Generate prompt for ingredient sourcing guidance"""
    prompt = f"""
    Provide premium ingredient sourcing guidance for {req.specific_ingredient or "a high-quality meal"}.
    
    {f"For recipe: {req.recipe_text}" if req.recipe_text else ""}
    
    Create detailed sourcing information with:
    1. Where to find the best quality ingredients
    2. How to select for freshness and quality
    3. Premium vs everyday options with price comparisons
    4. Seasonal availability
    5. Specialty sources (online, local farms, markets)
    6. Storage recommendations to maximize shelf life
    7. Sustainable and ethical sourcing considerations
    
    Return as a JSON object with the following structure:
    {{
      "ingredient_guide": [
        {{
          "ingredient": "",
          "quality_indicators": [""],
          "sourcing_locations": [{{ "name": "", "type": "", "price_range": "", "quality": "" }}],
          "selection_tips": [""],
          "seasonality": {{ "peak_season": "", "availability": "", "seasonal_notes": "" }},
          "storage_method": {{ "duration": "", "instructions": "" }},
          "sustainable_options": [{{ "description": "", "certification": "", "benefits": "" }}]
        }}
      ],
      "estimated_total_cost": {{ "premium": "", "mid_range": "", "budget": "" }},
      "specialty_recommendations": [{{ "store": "", "location": "", "specialty": "", "notes": "" }}]
    }}
    """
    return prompt

def generate_recipe_curation_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """Generate prompt for recipe curation"""
    cuisine_prefs = ", ".join(user_preferences.get("cuisine_preferences", []))
    dietary = ", ".join(user_preferences.get("dietary_restrictions", []))
    favorites = ", ".join(user_preferences.get("favorite_ingredients", []))
    dislikes = ", ".join(user_preferences.get("disliked_ingredients", []))
    
    cuisine = req.cuisine_type or cuisine_prefs or "any"
    
    prompt = f"""
    Curate a collection of premium restaurant-quality recipes for a home cook.
    
    Preferences:
    - Cuisine: {cuisine}
    - Dietary restrictions: {dietary}
    - Favorite ingredients: {favorites}
    - Disliked ingredients: {dislikes}
    {f"- Occasion: {req.occasion}" if req.occasion else ""}
    
    For each recipe, provide:
    1. Restaurant-quality recipe with chef's notes
    2. History and cultural significance
    3. Wine or beverage pairing suggestions
    4. Make-ahead components
    5. Difficulty rating and special techniques
    6. Wow-factor presentation ideas
    
    Return as a JSON object with the following structure:
    {{
      "curated_recipes": [
        {{
          "name": "",
          "chef_inspiration": "",
          "history": "",
          "difficulty": "",
          "preparation_time": "",
          "cooking_time": "",
          "ingredients": [{{ "name": "", "amount": "", "special_notes": "" }}],
          "instructions": [{{ "step": 1, "description": "", "technique": "", "chef_tip": "" }}],
          "wine_pairing": {{ "recommendation": "", "flavor_notes": "", "alternative": "" }},
          "presentation": {{ "plating_description": "", "garnishes": [""], "visual_elements": [""] }},
          "make_ahead": [{{ "component": "", "instructions": "", "storage": "" }}]
        }}
      ],
      "menu_suggestions": [{{ "theme": "", "recipes": [""], "occasion": "" }}],
      "technique_spotlight": {{ "name": "", "description": "", "chef_examples": [""] }}
    }}
    """
    return prompt

def generate_student_meals_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """Generate prompt for student meals"""
    budget = req.budget_level or "budget"
    prep_time = req.prep_time_limit or "15_minutes"
    equipment = req.kitchen_equipment or "minimal"
    skill = req.cooking_skill or user_preferences.get("cooking_skill", "beginner")
    dietary = req.dietary_preference or ", ".join(user_preferences.get("dietary_restrictions", []))
    favorites = ", ".join(user_preferences.get("favorite_ingredients", []))
    dislikes = ", ".join(user_preferences.get("disliked_ingredients", []))
    
    # Convert prep time to human-readable format
    prep_time_display = {
        "15_minutes": "15 minutes or less",
        "30_minutes": "30 minutes or less",
        "45_minutes": "45 minutes or less"
    }.get(prep_time, "quick")
    
    # Convert equipment to description
    equipment_display = {
        "minimal": "minimal equipment (microwave, toaster)",
        "basic": "basic equipment (stovetop, no oven)",
        "standard": "standard equipment (stovetop, oven)"
    }.get(equipment, "limited kitchen equipment")
    
    prompt = f"""
    Create a collection of nutritious, economical and quick student-friendly meals.
    
    Student requirements:
    - Budget level: {budget} 
    - Prep time limit: {prep_time_display}
    - Available equipment: {equipment_display}
    - Cooking skill: {skill}
    {f"- Dietary preference: {dietary}" if dietary else ""}
    - Favorite ingredients: {favorites}
    - Disliked ingredients: {dislikes}
    
    Create a comprehensive student meal plan with:
    1. 5-7 quick, nutritious recipes optimized for students
    2. Budget-friendly shopping list with estimated costs
    3. Study week meal plan with brain-boosting foods
    4. Study snack recommendations
    5. Batch cooking instructions for busy academic weeks
    6. Nutritional benefits for brain health and energy
    
    Focus on meals that:
    - Require minimal cleanup
    - Can be made with affordable ingredients
    - Store well for leftovers
    - Provide sustained energy for studying
    - Include brain-healthy nutrients for focus
    
    Return as a JSON object with the following structure:
    {{
      "student_meals": {{
        "recipes": [
          {{
            "name": "",
            "prep_time": "",
            "cost": "",
            "description": "",
            "ingredients": [""],
            "instructions": [""],
            "nutrition": "",
            "brain_boost": "",
            "storage": ""
          }}
        ],
        "shopping_list": {{
          "pantry_staples": [""],
          "weekly_fresh": [""],
          "budget_proteins": [""]
        }},
        "estimated_cost": "",
        "study_week_plan": [
          {{
            "day": "",
            "morning": {{ "name": "", "description": "", "brain_boost": "" }},
            "afternoon": {{ "name": "", "description": "", "energy_level": "" }},
            "evening": {{ "name": "", "description": "", "sleep_quality": "" }}
          }}
        ],
        "study_snacks": [
          {{
            "name": "",
            "description": "",
            "best_for": ""
          }}
        ],
        "meal_prep_guide": {{ "instructions": [""], "storage_tips": [""] }}
      }}
    }}
    """
    return prompt

def get_personalized_suggestions(request_type: str, user_preferences: Dict) -> List[str]:
    """Generate personalized suggestions based on request type and user preferences"""
    suggestions = []
    
    if request_type == "meal_plan":
        suggestions = [
            "Try our AI Chef's seasonal ingredient spotlight",
            "Explore restaurant-quality recipes using your favorite ingredients",
            "Get cooking guidance with video instructions for complex techniques"
        ]
    elif request_type == "cooking_guidance":
        suggestions = [
            "Ask for plating techniques used in fine dining restaurants",
            "Try our ingredient sourcing guide for specialty items",
            "Get a customized wine pairing for your next dinner party"
        ]
    elif request_type == "ingredient_sourcing":
        suggestions = [
            "Discover local farmers markets and specialty stores near you",
            "Learn how to build a restaurant-quality pantry",
            "Try our subscription ingredient box curated by top chefs"
        ]
    elif request_type == "recipe_curation":
        suggestions = [
            "Get a full dinner party menu with timing guide",
            "Try recipes featuring seasonal ingredients",
            "Ask for recipes inspired by your favorite restaurants"
        ]
    elif request_type == "student_meals":
        suggestions = [
            "Get tips for cooking in a dormitory kitchen",
            "Learn to meal prep for a busy exam week",
            "Try our budget-friendly grocery shopping guide",
            "Explore brain-boosting foods for better focus"
        ]
    
    return suggestions 
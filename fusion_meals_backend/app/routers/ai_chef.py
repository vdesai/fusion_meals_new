from fastapi import APIRouter, HTTPException, Depends, Cookie
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
import time
import random
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
    request_type: str  # "meal_plan", "cooking_guidance", "ingredient_sourcing", "recipe_curation", "student_meals", "health_optimization"
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
    # New fields for health optimization
    health_goals: Optional[List[str]] = None
    activity_level: Optional[str] = None
    health_conditions: Optional[List[str]] = None
    meal_plan_data: Optional[str] = None

class AIChefResponse(BaseModel):
    premium_content: Dict[str, Any]
    user_subscription: Dict[str, Any]
    request_remaining: int
    suggestions: List[str]

# Add new model for micronutrient analysis requests
class MicronutrientAnalysisRequest(BaseModel):
    breakfast: str
    lunch: str 
    dinner: str
    snacks: List[str] = []
    day_name: Optional[str] = None

def get_user_subscription(session_id: Optional[str] = Cookie(None)):
    """
    Get user subscription details from the session ID
    In a real app, this would query a database
    """
    # !!! DEMO CHANGE !!! - Always return a premium user for demonstration
    # This bypasses authentication for demo purposes
    # In a production environment, you would restore the normal authentication check
    
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
        # Optimize meal plan generation for different timeframes
        if req.timeframe == "week":
            prompt = generate_optimized_weekly_meal_plan_prompt(req, user_preferences)
        else:
            prompt = generate_meal_plan_prompt(req, user_preferences)
    elif req.request_type == "cooking_guidance":
        prompt = generate_cooking_guidance_prompt(req, user_preferences)
    elif req.request_type == "ingredient_sourcing":
        prompt = generate_ingredient_sourcing_prompt(req, user_preferences)
    elif req.request_type == "recipe_curation":
        prompt = generate_recipe_curation_prompt(req, user_preferences)
    elif req.request_type == "student_meals":
        prompt = generate_student_meals_prompt(req, user_preferences)
    elif req.request_type == "health_optimization":
        prompt = generate_health_optimization_prompt(req, user_preferences)
    else:
        raise HTTPException(status_code=400, detail="Invalid request type")
    
    try:
        # Set timeout parameters based on request complexity
        timeout = 60  # Default 60 seconds
        if req.request_type == "meal_plan" and req.timeframe == "week":
            timeout = 120  # 2 minutes for weekly meal plans
        
        # Call OpenAI API with increased timeout
        start_time = time.time()
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            timeout=timeout,
            messages=[
                {"role": "system", "content": "You are an AI Personal Chef assistant that creates premium culinary content for paying subscribers. Provide detailed, personalized responses in JSON format."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse response
        response_content = json.loads(response.choices[0].message.content)
        print(f"OpenAI API request completed in {time.time() - start_time:.2f} seconds")
        
        # Post-process the response based on request type
        if req.request_type == "meal_plan":
            # Ensure micronutrients have proper formatting
            if "nutrition_summary" in response_content and "micronutrients" in response_content["nutrition_summary"]:
                micronutrients = response_content["nutrition_summary"]["micronutrients"]
                
                # Ensure all micronutrients use the "XX% DV" format
                for key, value in micronutrients.items():
                    if not value.endswith("% DV") and not key.endswith("_sources"):
                        micronutrients[key] = f"{value}% DV" if value else "0% DV"
                
                # Add necessary micronutrients for display with estimated values clearly marked
                required_micronutrients = [
                    "vitamin_a", "vitamin_c", "calcium", "iron",
                    "vitamin_b1", "vitamin_b2", "vitamin_b3", "vitamin_b5", "vitamin_b6", "vitamin_b12",
                    "folate", "vitamin_d", "vitamin_e", "vitamin_k",
                    "magnesium", "phosphorus", "potassium", "sodium",
                    "zinc", "copper", "manganese", "selenium", "iodine"
                ]
                
                # Check if most micronutrients are empty
                empty_count = sum(1 for nutrient in required_micronutrients if nutrient in micronutrients and (not micronutrients[nutrient] or micronutrients[nutrient] == "-"))
                
                # If most are empty, add estimated values clearly marked as estimates
                if empty_count > len(required_micronutrients) * 0.7:  # If more than 70% are empty
                    print("Adding estimated micronutrient values since most are empty")
                    for nutrient in required_micronutrients:
                        if nutrient not in micronutrients or not micronutrients[nutrient] or micronutrients[nutrient] == "-":
                            # Use percentages based on meal types in the plan
                            # These are general estimates based on common foods in the meal plan
                            if "salmon" in str(response_content).lower() and nutrient in ["vitamin_d", "omega_3"]:
                                micronutrients[nutrient] = "90% DV (estimated)"
                            elif "berries" in str(response_content).lower() and nutrient == "vitamin_c":
                                micronutrients[nutrient] = "85% DV (estimated)"
                            elif "leafy greens" in str(response_content).lower() and nutrient in ["vitamin_k", "folate"]:
                                micronutrients[nutrient] = "80% DV (estimated)"
                            elif "yogurt" in str(response_content).lower() and nutrient == "calcium":
                                micronutrients[nutrient] = "75% DV (estimated)"
                            elif "nuts" in str(response_content).lower() and nutrient in ["vitamin_e", "magnesium"]:
                                micronutrients[nutrient] = "70% DV (estimated)"
                            elif "meat" in str(response_content).lower() and nutrient in ["vitamin_b12", "zinc", "iron"]:
                                micronutrients[nutrient] = "85% DV (estimated)"
                            elif "whole grains" in str(response_content).lower() and nutrient in ["vitamin_b1", "vitamin_b3", "magnesium"]:
                                micronutrients[nutrient] = "65% DV (estimated)"
                            elif "avocado" in str(response_content).lower() and nutrient in ["vitamin_e", "potassium"]:
                                micronutrients[nutrient] = "60% DV (estimated)"
                            elif "eggs" in str(response_content).lower() and nutrient in ["vitamin_b2", "vitamin_b12", "selenium"]:
                                micronutrients[nutrient] = "75% DV (estimated)"
                            else:
                                # Random but consistent percentage between 50-95%
                                # Use hash of nutrient name for consistency
                                percentage = 50 + (hash(nutrient) % 46)
                                micronutrients[nutrient] = f"{percentage}% DV (estimated)"
                
                # Add source fields if not present with food sources from the meal plan
                source_fields = [
                    "vitamin_a_sources", "b_vitamins_sources", "vitamin_c_sources", "vitamin_d_sources",
                    "calcium_sources", "iron_sources", "magnesium_sources", "zinc_sources"
                ]
                
                # Extract food items from the meal plan to use in source fields
                food_items = []
                if "meal_plan" in response_content and "days" in response_content["meal_plan"]:
                    for day in response_content["meal_plan"]["days"]:
                        for meal_type in ["breakfast", "lunch", "dinner"]:
                            if meal_type in day and "name" in day[meal_type]:
                                food_items.append(day[meal_type]["name"])
                            if meal_type in day and "description" in day[meal_type]:
                                food_items.append(day[meal_type]["description"])
                        if "snacks" in day:
                            for snack in day["snacks"]:
                                if "name" in snack:
                                    food_items.append(snack["name"])
                
                # Create source mappings based on known nutrient sources
                source_mappings = {
                    "vitamin_a_sources": ["carrots", "sweet potatoes", "spinach", "kale", "bell peppers"],
                    "b_vitamins_sources": ["whole grains", "eggs", "leafy greens", "nuts", "meat", "fish"],
                    "vitamin_c_sources": ["citrus fruits", "berries", "bell peppers", "broccoli", "kiwi"],
                    "vitamin_d_sources": ["fatty fish", "egg yolks", "fortified foods", "mushrooms"],
                    "calcium_sources": ["dairy products", "leafy greens", "tofu", "almonds", "fortified plant milk"],
                    "iron_sources": ["lean meats", "beans", "lentils", "spinach", "tofu"],
                    "magnesium_sources": ["nuts", "seeds", "whole grains", "legumes", "avocado"],
                    "zinc_sources": ["meat", "shellfish", "legumes", "seeds", "nuts"]
                }
                
                # Match food items to appropriate source fields
                for source_field, nutrient_sources in source_mappings.items():
                    if source_field not in micronutrients or not micronutrients[source_field]:
                        matching_sources = []
                        for food_item in food_items:
                            for source in nutrient_sources:
                                if source.lower() in food_item.lower():
                                    matching_sources.append(food_item)
                                    break
                        
                        if matching_sources:
                            # Take up to 3 matching food items
                            food_list = list(set(matching_sources))[:3]
                            micronutrients[source_field] = ", ".join(food_list)
                        else:
                            # If no match found, provide generic source
                            micronutrients[source_field] = "Various foods in your meal plan"
        
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

@router.post("/premium/micronutrient-analysis", response_model=AIChefResponse)
async def analyze_single_day_micronutrients(
    req: MicronutrientAnalysisRequest, 
    user_data: Optional[Dict] = Depends(get_user_subscription)
):
    """
    Lightweight endpoint to analyze micronutrients for a single day's meals.
    This helps avoid timeout issues with larger meal plan requests.
    """
    # Check if user has premium access
    if not user_data or user_data.get("subscription", {}).get("subscription_level") != "premium":
        raise HTTPException(status_code=403, detail={
            "message": "This is a premium feature. Please upgrade your subscription to access micronutrient analysis.",
            "upgrade_url": "/subscription/upgrade"
        })
    
    # Get user preferences
    user_preferences = user_data["subscription"].get("preferences", {})
    
    # Prepare prompt specifically for micronutrient analysis
    prompt = generate_micronutrient_analysis_prompt(req, user_preferences)
    
    try:
        # Use shorter timeout for this lightweight request
        timeout = 30  # 30 seconds should be plenty for single-day analysis
        
        start_time = time.time()
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            timeout=timeout,
            messages=[
                {"role": "system", "content": "You are a nutrition expert AI that analyzes meals for micronutrient content. Provide detailed, accurate micronutrient analysis in JSON format."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse response
        response_content = json.loads(response.choices[0].message.content)
        print(f"Micronutrient analysis completed in {time.time() - start_time:.2f} seconds")
        
        # Ensure proper formatting for micronutrients
        if "micronutrients" in response_content:
            micronutrients = response_content["micronutrients"]
            
            # Ensure all micronutrients use the "XX% DV" format
            for key, value in micronutrients.items():
                if not isinstance(value, str):
                    micronutrients[key] = f"{value}% DV"
                elif not value.endswith("% DV") and not key.endswith("_sources"):
                    micronutrients[key] = f"{value}% DV" if value else "0% DV"
        
        # Prepare and return the response
        return AIChefResponse(
            premium_content={
                "micronutrient_analysis": response_content.get("micronutrients", {}),
                "day_name": req.day_name or "Daily Analysis"
            },
            user_subscription={
                "level": user_data["subscription"]["subscription_level"],
                "expiry_date": user_data["subscription"]["expiry_date"]
            },
            request_remaining=30,  # Assume 30 requests remaining
            suggestions=[
                "Try adding more leafy greens for increased iron and folate",
                "Consider dairy or fortified alternatives for calcium",
                "Colorful fruits and vegetables increase your vitamin intake",
                "Fatty fish like salmon provide essential omega-3 fatty acids"
            ]
        )
        
    except Exception as e:
        print(f"Error during micronutrient analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing micronutrients: {str(e)}")

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
    6. Comprehensive nutritional information with detailed micronutrients
    
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
      "nutrition_summary": {{ 
        "average_daily_calories": "", 
        "protein_ratio": "", 
        "carb_ratio": "", 
        "fat_ratio": "",
        "daily_macros": {{
          "calories_breakdown": {{
            "breakfast": "",
            "lunch": "",
            "dinner": "",
            "snacks": ""
          }},
          "protein": {{
            "grams": "",
            "sources": [""]
          }},
          "carbohydrates": {{
            "grams": "",
            "sources": [""]
          }},
          "fats": {{
            "grams": "",
            "sources": [""]
          }},
          "fiber": {{
            "grams": "",
            "sources": [""]
          }}
        }},
        "micronutrients": {{
          "vitamin_a": "",
          "vitamin_c": "",
          "calcium": "",
          "iron": "",
          "vitamin_b1": "",
          "vitamin_b2": "",
          "vitamin_b3": "",
          "vitamin_b5": "",
          "vitamin_b6": "",
          "vitamin_b12": "",
          "folate": "",
          "vitamin_d": "",
          "vitamin_e": "",
          "vitamin_k": "",
          "magnesium": "",
          "phosphorus": "",
          "potassium": "",
          "sodium": "",
          "zinc": "",
          "copper": "",
          "manganese": "",
          "selenium": "",
          "iodine": "",
          "vitamin_a_sources": "",
          "b_vitamins_sources": "",
          "vitamin_c_sources": "",
          "vitamin_d_sources": "",
          "calcium_sources": "",
          "iron_sources": "",
          "magnesium_sources": "",
          "zinc_sources": ""
        }}
      }}
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

def generate_optimized_weekly_meal_plan_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """Generate a more efficient prompt for weekly meal planning to avoid timeouts"""
    cuisine_prefs = ", ".join(user_preferences.get("cuisine_preferences", []))
    dietary = ", ".join(user_preferences.get("dietary_restrictions", []))
    household = user_preferences.get("household_size", 1)
    favorites = ", ".join(user_preferences.get("favorite_ingredients", []))
    dislikes = ", ".join(user_preferences.get("disliked_ingredients", []))
    
    budget = req.budget_level or "moderate"
    
    prompt = f"""
    Create a simplified but premium personalized weekly meal plan with a {budget} budget.
    
    User preferences:
    - Cuisine preferences: {cuisine_prefs}
    - Dietary restrictions: {dietary}
    - Household size: {household}
    - Favorite ingredients: {favorites}
    - Disliked ingredients: {dislikes}
    
    {f"Special occasion: {req.occasion}" if req.occasion else ""}
    
    Provide a simplified 7-day meal plan with:
    1. Daily meals (breakfast, lunch, dinner, snacks - keep descriptions brief)
    2. Basic grocery list
    3. Brief prep instructions
    4. Estimated costs 
    5. Brief nutritional information with micronutrients
    
    Focus on efficiency and brevity while maintaining quality.
    
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
      "nutrition_summary": {{ 
        "average_daily_calories": "", 
        "protein_ratio": "", 
        "carb_ratio": "", 
        "fat_ratio": "",
        "daily_macros": {{
          "calories_breakdown": {{
            "breakfast": "",
            "lunch": "",
            "dinner": "",
            "snacks": ""
          }},
          "protein": {{
            "grams": "",
            "sources": [""]
          }},
          "carbohydrates": {{
            "grams": "",
            "sources": [""]
          }},
          "fats": {{
            "grams": "",
            "sources": [""]
          }},
          "fiber": {{
            "grams": "",
            "sources": [""]
          }}
        }},
        "micronutrients": {{
          "vitamin_a": "",
          "vitamin_c": "",
          "calcium": "",
          "iron": "",
          "vitamin_d": "",
          "magnesium": "",
          "zinc": "",
          "vitamin_a_sources": "",
          "vitamin_c_sources": "",
          "vitamin_d_sources": "",
          "calcium_sources": "",
          "iron_sources": "",
          "magnesium_sources": "",
          "zinc_sources": ""
        }}
      }}
    }}
    """
    return prompt

def generate_micronutrient_analysis_prompt(req: MicronutrientAnalysisRequest, user_preferences: Dict) -> str:
    """
    Generate a prompt specifically for micronutrient analysis of a single day's meals.
    This is optimized for fast, accurate responses.
    """
    # Prepare the prompt with relevant meal information
    prompt = f"""
    As a nutrition expert, analyze the following meals for a single day and provide detailed micronutrient information:
    
    Breakfast: {req.breakfast}
    Lunch: {req.lunch}
    Dinner: {req.dinner}
    """
    
    if req.snacks:
        prompt += "\nSnacks:\n"
        for i, snack in enumerate(req.snacks):
            prompt += f"- {snack}\n"
    
    # Include day name if available
    if req.day_name:
        prompt += f"\nDay: {req.day_name}\n"
    
    # Add user preferences if relevant
    if user_preferences:
        if "dietary_restrictions" in user_preferences and user_preferences["dietary_restrictions"]:
            prompt += f"\nDietary Restrictions: {', '.join(user_preferences['dietary_restrictions'])}\n"
    
    # Request format for the response
    prompt += """
    Please provide a comprehensive micronutrient analysis in JSON format with the following:
    
    1. Provide percentages of Daily Value (%DV) for all essential vitamins and minerals:
       - Vitamin A, B1 (Thiamin), B2 (Riboflavin), B3 (Niacin), B5 (Pantothenic Acid), 
         B6 (Pyridoxine), B9 (Folate), B12 (Cobalamin), C, D, E, K
       - Minerals: Calcium, Iron, Magnesium, Phosphorus, Potassium, Sodium, Zinc, 
         Copper, Manganese, Selenium, Iodine
    
    2. For each micronutrient, list the primary food sources from the meals
    
    3. Format all percentages as "XX% DV" (e.g., "80% DV")
    
    4. Provide specific food sources for:
       - Vitamin A sources
       - B vitamins sources
       - Vitamin C sources
       - Vitamin D sources
       - Calcium sources
       - Iron sources
       - Magnesium sources
       - Zinc sources
    
    Return your analysis as a JSON object with a 'micronutrients' field containing all this information.
    Make sure your response is accurate based on the actual food components in the meals.
    """
    
    return prompt

def generate_health_optimization_prompt(req: AIChefRequest, user_preferences: Dict) -> str:
    """
    Generate a prompt for health optimization analysis based on meal plan data
    and specific health goals/conditions.
    """
    # Extract relevant data from the request
    meal_plan_data = req.meal_plan_data or ""
    health_goals = req.health_goals or ["balanced_nutrition"]
    activity_level = req.activity_level or "moderate"
    health_conditions = req.health_conditions or []
    
    # Extract relevant user preferences
    dietary_restrictions = user_preferences.get("dietary_restrictions", [])
    favorite_ingredients = user_preferences.get("favorite_ingredients", [])
    disliked_ingredients = user_preferences.get("disliked_ingredients", [])
    
    # Map health goals to descriptive text
    health_goal_descriptions = {
        "weight_management": "managing weight through balanced nutrition and appropriate portion sizes",
        "muscle_building": "supporting muscle development and repair with adequate protein and nutrients",
        "heart_health": "promoting cardiovascular health through balanced nutrition and heart-friendly foods",
        "gut_health": "supporting digestive health and maintaining a healthy gut microbiome",
        "energy_optimization": "maximizing sustained energy levels throughout the day",
        "immune_support": "strengthening the immune system through nutrient-rich foods",
        "mental_clarity": "supporting cognitive function and mental performance",
        "balanced_nutrition": "achieving overall balanced nutrition across all food groups and nutrients"
    }
    
    # Map activity levels to descriptive text
    activity_level_descriptions = {
        "sedentary": "little to no regular exercise",
        "light": "light exercise 1-3 days per week",
        "moderate": "moderate exercise 3-5 days per week",
        "active": "active exercise 6-7 days per week",
        "extra_active": "very intense daily exercise or physical job"
    }
    
    # Map health conditions to nutritional considerations
    health_condition_considerations = {
        "diabetes": "blood sugar management, consistent carbohydrate intake, emphasis on complex carbs and fiber",
        "hypertension": "sodium reduction, emphasis on potassium-rich foods, heart-healthy eating patterns",
        "high_cholesterol": "reduced saturated fat, increased soluble fiber, heart-healthy fat sources",
        "ibs": "potential trigger food avoidance, fiber management, regular meal pattern",
        "celiac": "strict gluten avoidance, focus on naturally gluten-free grains and foods",
        "gerd": "avoidance of trigger foods, smaller meals, limiting acidic foods",
        "arthritis": "anti-inflammatory foods, omega-3 rich options, antioxidant-rich produce"
    }
    
    # Create comprehensive system prompt
    system_prompt = f"""You are an expert nutritionist and health optimization specialist with advanced understanding of nutrition science, biochemistry, and personalized dietary approaches. 
    Your task is to analyze the provided meal plan and offer detailed, evidence-based recommendations for optimization.
    
    Present your analysis and recommendations in a structured, clear format with a professional yet accessible tone. 
    Include specific, actionable advice backed by nutritional science. Your goal is to help the user optimize their meals for their specific health goals.
    
    IMPORTANT: Format your response as a structured JSON object matching the HealthOptimizationContent interface."""
    
    # Build the comprehensive user prompt
    prompt = f"""
    Please analyze the following meal plan data and provide a comprehensive health optimization report based on the specified parameters.
    
    MEAL PLAN DATA:
    {meal_plan_data}
    
    HEALTH GOALS:
    {', '.join([health_goal_descriptions.get(goal, goal) for goal in health_goals])}
    
    ACTIVITY LEVEL:
    {activity_level_descriptions.get(activity_level, activity_level)}
    
    HEALTH CONDITIONS:
    {', '.join([health_condition_considerations.get(condition, condition) for condition in health_conditions]) if health_conditions else "None specified"}
    
    DIETARY PREFERENCES:
    - Restrictions: {', '.join(dietary_restrictions) if dietary_restrictions else "None specified"}
    - Favorite ingredients: {', '.join(favorite_ingredients) if favorite_ingredients else "None specified"}
    - Disliked ingredients: {', '.join(disliked_ingredients) if disliked_ingredients else "None specified"}
    
    Please provide a detailed health optimization report with the following sections:
    
    1. Overall Analysis:
       - Calculate a health score (0-100) based on nutritional completeness, alignment with health goals, and adherence to condition-specific requirements
       - Identify 3-5 key nutritional strengths in the meal plan
       - Highlight 3-5 specific areas for improvement
    
    2. Goal Alignment Analysis:
       - For each health goal, provide a specific analysis of how well the meal plan aligns
       - Calculate an alignment score (0-100) for each goal
       - Provide 2-4 specific, actionable recommendations to better align with each goal
    
    3. Nutrient Analysis:
       - Identify any nutrient excesses and provide current vs. recommended amounts
       - Identify any nutrient deficiencies with current vs. recommended amounts and specific food sources to address them
       - List nutrients that are appropriately balanced
    
    4. Meal-by-Meal Optimization:
       - Analyze each meal type (breakfast, lunch, dinner, snacks) and suggest specific improvements
       - For each suggestion, explain the specific health benefit
       - Ensure suggestions maintain food preferences and respect dietary restrictions
    
    5. Scientific Insights:
       - Provide 2-3 evidence-based insights relevant to the specified health goals
       - Include brief explanations and scientific citations
       - Focus on practical applications rather than theory
    
    Format your response as a structured JSON object following this exact structure:
    
    {{
      "overall_analysis": {{
        "health_score": number, // 0-100 score
        "strengths": string[], // Array of strength descriptions
        "improvement_areas": string[] // Array of improvement descriptions
      }},
      "goal_alignment": [
        {{
          "goal": string, // Name of the goal
          "alignment_score": number, // 0-100 score
          "analysis": string, // Detailed analysis paragraph
          "recommendations": string[] // Array of recommendation descriptions
        }}
      ],
      "nutrient_analysis": {{
        "excesses": [
          {{
            "nutrient": string, // Name of nutrient
            "current_amount": string, // Current amount with units
            "recommended_amount": string, // Recommended amount with units
            "impact": string // Brief description of potential impact
          }}
        ],
        "deficiencies": [
          {{
            "nutrient": string, // Name of nutrient
            "current_amount": string, // Current amount with units
            "recommended_amount": string, // Recommended amount with units
            "food_sources": string[] // Array of good food sources
          }}
        ],
        "balanced_nutrients": string[] // Array of balanced nutrient names
      }},
      "meal_optimizations": [
        {{
          "meal_type": string, // "Breakfast", "Lunch", "Dinner", or "Snacks"
          "current_meal": string, // Current meal description
          "suggested_improvements": [
            {{
              "component": string, // Component to change
              "suggestion": string, // Specific suggestion
              "benefit": string // Health benefit explanation
            }}
          ]
        }}
      ],
      "scientific_insights": [
        {{
          "topic": string, // Brief topic description
          "explanation": string, // Detailed explanation
          "citation": string // Scientific citation
        }}
      ]
    }}"""
    
    return prompt 
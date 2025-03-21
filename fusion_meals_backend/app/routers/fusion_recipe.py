from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Optional, List
from datetime import datetime
import random

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")
print(f"API Key starts with: {api_key[:10]}..." if api_key else "No API key")

try:
    client = OpenAI(api_key=api_key)
    # Test the API key with a simple completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Say hello"}],
        max_tokens=5
    )
    print("OpenAI API test succeeded")
except Exception as e:
    print(f"OpenAI API initialization error: {str(e)}")
    raise ValueError(f"❌ Error initializing OpenAI client: {str(e)}")

router = APIRouter()

@router.get("/")
async def get_recipes_info():
    """Returns information about the recipes API."""
    return {
        "status": "ok",
        "message": "Welcome to the Fusion Meals Recipe API",
        "endpoints": {
            "POST /generate": "Generate a fusion recipe",
            "GET /recipe-of-the-day": "Get a random recipe of the day"
        }
    }

class RecipeRequest(BaseModel):
    ingredients: str
    cuisine1: str
    cuisine2: str
    dietary_preference: str = "None"
    is_premium: bool = False
    serving_size: Optional[int] = 4
    cooking_skill: Optional[str] = "Intermediate"

class RecipeResponse(BaseModel):
    recipe: str
    image_url: str | None = None
    nutritional_analysis: Optional[dict] = None
    cooking_tips: Optional[List[str]] = None
    wine_pairing: Optional[str] = None
    storage_instructions: Optional[str] = None

class RecipeOfTheDayResponse(BaseModel):
    recipe: str
    image_url: str | None = None
    title: str
    description: str
    cuisines: List[str]

# Dietary preference descriptions
diet_instructions = {
    "Diabetes-Friendly": "Avoid sugar, white rice, potatoes, and refined flour. Suggest healthy alternatives.",
    "Low-Carb": "Limit high-carb ingredients like potatoes and rice. Suggest protein-rich alternatives.",
    "High-Protein": "Ensure the recipe includes high-protein ingredients like lentils, tofu, and beans.",
    "Vegan": "Exclude all animal products, including dairy and eggs. Use plant-based alternatives.",
    "Gluten-Free": "Avoid wheat, barley, and rye. Suggest gluten-free grains like quinoa or rice.",
    "Keto": "Ensure very low carbs, moderate protein, and high healthy fats like avocados and nuts.",
    "Heart-Healthy": "Use heart-friendly ingredients like olive oil, nuts, leafy greens, and avoid processed foods.",
    "None": "No dietary restrictions."
}

# List of popular cuisine combinations for Recipe of the Day
popular_cuisine_combos = [
    ("Italian", "Japanese"),
    ("Mexican", "Thai"),
    ("Indian", "Mediterranean"),
    ("Chinese", "French"),
    ("Korean", "American"),
    ("Lebanese", "Brazilian"),
    ("Vietnamese", "Spanish"),
    ("Greek", "Japanese"),
    ("Moroccan", "Chinese"),
    ("Ethiopian", "Italian")
]

@router.post("/generate", response_model=RecipeResponse)
async def generate_fusion_recipe(req: RecipeRequest):
    try:
        diet_instruction = diet_instructions.get(req.dietary_preference, "No dietary restrictions.")
        
        # Base prompt for all recipes
        base_prompt = f"""
        You are an AI chef specializing in fusion cuisine.

        User has requested a fusion dish combining **{req.cuisine1} and {req.cuisine2}** cuisine.
        Available ingredients: {req.ingredients}.
        Serving size: {req.serving_size} people
        Cooking skill level: {req.cooking_skill}

        **Dietary Preference:** {diet_instruction}

        Generate the recipe in the following **markdown-formatted style**:

        🍴 **Recipe Name**: [Recipe Name Here]

        🛒 **Ingredients**:
        - **Vegetables**: [List each vegetable as a bullet point]
        - **Proteins**: [List each protein item]
        - **Spices & Other**: [List spices and other ingredients]

        👩‍🍳 **Instructions**:
        1. [Step 1 instructions]
        2. [Step 2 instructions]
        3. [Step 3 instructions]

        ⏰ **Cooking Time**: [Time in hours and minutes]

        🔥 **Calories per Serving**: [Calories per serving]

        💪 **Macronutrients**:
        - Protein: [Xg]
        - Carbs: [Xg]
        - Fats: [Xg]

        🏅 **Health Score**: [Health Score A/B/C]
        """

        # Add premium features if requested
        if req.is_premium:
            base_prompt += """
            🍷 **Wine Pairing**: [Suggest appropriate wine pairing]
            
            📊 **Detailed Nutritional Analysis**:
            - Calories: [X] kcal
            - Protein: [X]g ([X]% of daily value)
            - Carbs: [X]g ([X]% of daily value)
            - Fats: [X]g ([X]% of daily value)
            - Fiber: [X]g
            - Sugar: [X]g
            - Sodium: [X]mg
            
            💡 **Cooking Tips**:
            1. [Tip 1]
            2. [Tip 2]
            3. [Tip 3]
            
            📦 **Storage Instructions**:
            [How to store leftovers and for how long]
            """

        # Generate recipe text
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": base_prompt}],
            temperature=0.7
        )

        recipe_text = response.choices[0].message.content.strip()

        if not recipe_text or "recipe not found" in recipe_text.lower():
            return {"recipe": "⚠️ AI couldn't generate a recipe. Try modifying the ingredients!", "image_url": None}

        # Extract recipe name for image generation
        recipe_name = recipe_text.split("**Recipe Name**:")[1].split("\n")[0].strip() if "**Recipe Name**:" in recipe_text else "Fusion Cuisine Dish"
        
        # Generate image using DALL-E
        image_prompt = f"Professional food photography of {recipe_name}, {req.cuisine1} and {req.cuisine2} fusion cuisine, high quality, appetizing, well-lit, restaurant quality, 4k, detailed"
        
        try:
            image_response = client.images.generate(
                model="dall-e-3",
                prompt=image_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_url = image_response.data[0].url
        except Exception as e:
            print(f"Image generation error: {str(e)}")
            image_url = None

        # Parse premium features if available
        nutritional_analysis = None
        cooking_tips = None
        wine_pairing = None
        storage_instructions = None

        if req.is_premium:
            # Extract nutritional analysis
            if "**Detailed Nutritional Analysis**:" in recipe_text:
                nutrition_section = recipe_text.split("**Detailed Nutritional Analysis**:")[1].split("**")[0].strip()
                nutritional_analysis = {}
                for line in nutrition_section.split('\n'):
                    if line.strip().startswith('-'):
                        key, value = line.replace('-', '').strip().split(':', 1)
                        nutritional_analysis[key.strip()] = value.strip()

            # Extract cooking tips
            if "**Cooking Tips**:" in recipe_text:
                tips_section = recipe_text.split("**Cooking Tips**:")[1].split("**")[0].strip()
                cooking_tips = [tip.strip().replace('-', '').strip() for tip in tips_section.split('\n') if tip.strip().startswith('-')]

            # Extract wine pairing
            if "**Wine Pairing**:" in recipe_text:
                wine_section = recipe_text.split("**Wine Pairing**:")[1].split("**")[0].strip()
                wine_pairing = wine_section

            # Extract storage instructions
            if "**Storage Instructions**:" in recipe_text:
                storage_section = recipe_text.split("**Storage Instructions**:")[1].split("**")[0].strip()
                storage_instructions = storage_section

        return {
            "recipe": recipe_text,
            "image_url": image_url,
            "nutritional_analysis": nutritional_analysis,
            "cooking_tips": cooking_tips,
            "wine_pairing": wine_pairing,
            "storage_instructions": storage_instructions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")

@router.get("/recipe-of-the-day", response_model=RecipeOfTheDayResponse)
async def get_recipe_of_the_day():
    """
    Generates a special 'Recipe of the Day' with a random cuisine fusion combination.
    This endpoint doesn't require specific ingredients, as it's meant to inspire users.
    """
    try:
        # Select a random cuisine combination
        cuisine1, cuisine2 = random.choice(popular_cuisine_combos)
        
        # Create a prompt for recipe of the day
        prompt = f"""
        Create a special 'Recipe of the Day' combining {cuisine1} and {cuisine2} cuisines.
        This should be an approachable recipe that most people can cook with common ingredients.
        
        Generate the recipe in the following format:
        
        TITLE: [Catchy recipe name]
        
        DESCRIPTION: [A brief, enticing description of the dish in 2-3 sentences]
        
        INGREDIENTS:
        - [List main ingredients]
        
        INSTRUCTIONS:
        1. [Step 1]
        2. [Step 2]
        3. [Step 3]
        
        COOKING TIME: [Total time]
        DIFFICULTY: [Easy/Medium/Hard]
        SERVES: [Number of people]
        """
        
        # Generate recipe - using gpt-3.5-turbo instead of gpt-4 for more compatibility
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8
            )
            
            recipe_text = response.choices[0].message.content.strip()
            print(f"Recipe generation succeeded for {cuisine1}-{cuisine2}")
        except Exception as recipe_error:
            print(f"Recipe generation error: {recipe_error}")
            # Provide a fallback recipe in case of error
            recipe_text = f"""
            TITLE: Simple {cuisine1}-{cuisine2} Fusion Dish
            
            DESCRIPTION: A delicious fusion dish combining elements from {cuisine1} and {cuisine2} cuisines. Perfect for a quick, flavorful meal.
            
            INGREDIENTS:
            - Basic ingredients from both cuisines
            - Common vegetables
            - Protein of choice
            - Herbs and spices
            
            INSTRUCTIONS:
            1. Prepare all ingredients.
            2. Cook according to basic techniques from both cuisines.
            3. Combine and serve hot.
            
            COOKING TIME: 30 minutes
            DIFFICULTY: Medium
            SERVES: 4
            """
        
        # Extract title for the image generation
        title = recipe_text.split("TITLE:")[1].split("\n")[0].strip() if "TITLE:" in recipe_text else f"{cuisine1}-{cuisine2} Fusion Dish"
        
        # Extract description
        description = recipe_text.split("DESCRIPTION:")[1].split("\n\n")[0].strip() if "DESCRIPTION:" in recipe_text else "A delicious fusion recipe combining the best of two culinary worlds."
        
        # Generate an image for the recipe - using a simpler approach
        try:
            image_prompt = f"Food photography of {title}, {cuisine1} and {cuisine2} fusion cuisine"
            
            image_response = client.images.generate(
                model="dall-e-2",  # Using dall-e-2 instead of dall-e-3 for more compatibility
                prompt=image_prompt,
                n=1,
                size="512x512"  # Smaller size
            )
            image_url = image_response.data[0].url
            print(f"Image generation succeeded for {title}")
        except Exception as image_error:
            print(f"Image generation error: {str(image_error)}")
            image_url = None
            
        return {
            "recipe": recipe_text,
            "image_url": image_url,
            "title": title,
            "description": description,
            "cuisines": [cuisine1, cuisine2]
        }
        
    except Exception as e:
        print(f"Recipe of the day generation error: {str(e)}")
        # Return a fallback recipe in case of any error
        cuisine1, cuisine2 = "Italian", "Japanese"
        return {
            "recipe": "Simple fusion dish combining pasta and sushi elements.",
            "image_url": None,
            "title": "Italian-Japanese Fusion",
            "description": "A simple yet delicious combination of Italian and Japanese flavors.",
            "cuisines": [cuisine1, cuisine2]
        }

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

router = APIRouter()

class RecipeAnalysisRequest(BaseModel):
    recipe_text: str
    analysis_focus: Optional[str] = None  # "flavor", "health", "technique", "all"
    dietary_preferences: Optional[List[str]] = None  # ["vegetarian", "gluten-free", etc.]
    skill_level: Optional[str] = None  # "beginner", "intermediate", "advanced"

class RecipeAnalysisResponse(BaseModel):
    original_recipe: str
    flavor_profile: Dict[str, Any]
    health_analysis: Dict[str, Any]
    improvement_suggestions: List[Dict[str, str]]
    technique_tips: Optional[List[str]] = None
    ingredient_insights: Optional[Dict[str, Any]] = None
    

@router.post("/analyze", response_model=RecipeAnalysisResponse)
async def analyze_recipe(req: RecipeAnalysisRequest):
    """
    Analyze a recipe and provide insights, improvement suggestions, and personalized tips.
    """
    try:
        recipe_text = req.recipe_text.strip()
        analysis_focus = req.analysis_focus or "all"
        dietary_preferences = req.dietary_preferences or []
        skill_level = req.skill_level or "intermediate"
        
        # Check if the recipe is in JSON format
        is_json_recipe = False
        try:
            recipe_json = json.loads(recipe_text)
            is_json_recipe = isinstance(recipe_json, dict)
            if is_json_recipe:
                # Format the JSON recipe for better analysis
                formatted_recipe = json.dumps(recipe_json, indent=2)
            else:
                formatted_recipe = recipe_text
        except:
            formatted_recipe = recipe_text
        
        # Create prompt for recipe analysis
        prompt = f"""
        As a world-class culinary expert and food scientist, analyze this recipe and provide detailed insights:

        RECIPE:
        {formatted_recipe}

        ANALYSIS FOCUS: {analysis_focus}
        DIETARY PREFERENCES: {', '.join(dietary_preferences) if dietary_preferences else 'None specified'}
        SKILL LEVEL: {skill_level}

        Provide a comprehensive analysis including:

        1. FLAVOR PROFILE ANALYSIS:
           - Identify the dominant flavor components (sweet, salty, sour, bitter, umami)
           - Analyze the balance of flavors
           - Identify any missing flavor dimensions
           - Note any unusual or exceptional flavor combinations

        2. HEALTH ANALYSIS:
           - Approximate nutritional profile (protein, carbs, fats, calories per serving)
           - Identify potential allergens
           - Evaluate health benefits and concerns
           - Suggest healthier substitutions if appropriate

        3. IMPROVEMENT SUGGESTIONS:
           - At least 3 specific ways to enhance or elevate the recipe
           - Ingredient substitutions or additions to consider
           - Techniques to improve results
           - Variations to try for different preferences

        4. TECHNIQUE TIPS:
           - Common mistakes to avoid
           - Professional tips for better results
           - Explanations of why certain techniques are used

        5. INGREDIENT INSIGHTS:
           - Identify key ingredients and their purpose
           - Suggest alternative ingredients
           - Note any special ingredients and their unique properties

        Format your analysis as a detailed JSON with the following structure:
        {{
          "flavor_profile": {{
            "dominant_flavors": ["sweet", "umami"],
            "balance": "The recipe leans heavily toward sweetness with insufficient acidity to balance",
            "missing_elements": "Could benefit from a touch of acidity",
            "flavor_combinations": "The combination of X and Y creates an interesting contrast"
          }},
          "health_analysis": {{
            "estimated_nutrition": {{
              "calories_per_serving": "Approximately 450-500",
              "protein": "Moderate",
              "carbs": "High",
              "fats": "Low"
            }},
            "allergens": ["nuts", "dairy"],
            "health_benefits": ["High in fiber", "Good source of vitamin C"],
            "health_concerns": ["High in added sugars", "Sodium content is high"]
          }},
          "improvement_suggestions": [
            {{
              "suggestion": "Add 1 tablespoon of lemon juice",
              "benefit": "Brings brightness and balances the sweetness",
              "implementation": "Add during final mixing"
            }},
            {{
              "suggestion": "Toast the spices before adding",
              "benefit": "Enhances aroma and deepens flavor",
              "implementation": "Dry toast in a pan for 30 seconds before adding"
            }},
            {{
              "suggestion": "Reduce sugar by 25%",
              "benefit": "Creates better flavor balance and healthier profile",
              "implementation": "Simply use 3/4 of the called-for amount"
            }}
          ],
          "technique_tips": [
            "Don't overmix the batter - stop when just combined to maintain tenderness",
            "Allow meat to rest for at least 5 minutes before slicing for juicier results",
            "Caramelizing the onions fully takes about 30-40 minutes, not the 5-10 often stated"
          ],
          "ingredient_insights": {{
            "key_ingredients": ["butter - adds richness and helps with browning", "cinnamon - provides warmth and complexity"],
            "alternative_ingredients": ["coconut oil can replace butter for dairy-free version", "maple syrup can substitute for honey"],
            "special_ingredients": ["sumac - provides lemony flavor without acidity", "nutritional yeast - adds umami notes"]
          }}
        }}

        Be specific, insightful, and practical. Base your analysis on culinary science and professional experience.
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,  # Lower temperature for more consistent analysis
            response_format={"type": "json_object"}
        )
        
        # Extract and process the response
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
        
        # Create the response
        return RecipeAnalysisResponse(
            original_recipe=recipe_text,
            flavor_profile=data.get("flavor_profile", {}),
            health_analysis=data.get("health_analysis", {}),
            improvement_suggestions=data.get("improvement_suggestions", []),
            technique_tips=data.get("technique_tips", []),
            ingredient_insights=data.get("ingredient_insights", {})
        )
        
    except Exception as e:
        print(f"Error analyzing recipe: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing recipe: {str(e)}"
        ) 
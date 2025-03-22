from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import traceback

# Load environment variables from the project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
print("Current working directory:", os.getcwd())  # Debug print
print("API Key found:", "Yes" if api_key else "No")  # Debug print
print("API Key starts with:", api_key[:10] if api_key else "None")  # Debug print

if not api_key:
    raise ValueError("OpenAI API key not found in environment variables")

client = OpenAI(api_key=api_key)

router = APIRouter()

# ✅ Input model for meal plan generation
class MealPlanRequest(BaseModel):
    diet_type: str
    preferences: str = ""

# ✅ Response model for the generated meal plan
class MealPlanResponse(BaseModel):
    meal_plan: str

@router.options("/generate")
async def options_generate_meal_plan():
    """
    Handle OPTIONS requests for the /generate endpoint
    This is needed for CORS preflight requests from browsers
    """
    return {}  # Return empty response with 200 status

# ✅ Generate meal plan endpoint
@router.post("/generate", response_model=MealPlanResponse)
async def generate_meal_plan(req: MealPlanRequest):
    try:
        print(f"Meal plan request received: {req}")
        prompt = f"""
        You are a dietician specializing in healthy meal planning.

        Create a 7-day meal plan that is **{req.diet_type}** and follows these preferences: **{req.preferences}**.
        
        Format the response in this exact structure:
        
        # 7-Day Meal Plan
        
        ## Day 1
        - 🥞 **Breakfast**: [Meal with brief description]
        - 🥗 **Lunch**: [Meal with brief description]
        - 🍛 **Dinner**: [Meal with brief description]
        
        [Repeat for Days 2-7]
        
        # 🛒 Weekly Grocery List
        
        List ALL ingredients needed for the ENTIRE WEEK (21 meals), organized by category. Be thorough and realistic with quantities for a week's worth of meals:
        
        ## Produce
        - [Item] - [Weekly quantity needed]
        - [Example: Onions - 5 medium]
        
        ## Meat & Seafood
        - [Item] - [Weekly quantity needed]
        - [Example: Chicken breast - 4 pounds]
        
        ## Dairy & Eggs
        - [Item] - [Weekly quantity needed]
        - [Example: Eggs - 18 large]
        
        ## Pantry
        - [Item] - [Weekly quantity needed]
        - [Example: Brown rice - 3 cups dry]
        
        ## Spices & Seasonings
        - [Item] - [Weekly quantity needed]
        - [Example: Ground cumin - 3 tablespoons]
        
        ## Beverages
        - [Item] - [Weekly quantity needed]
        
        CRITICAL FORMATTING REQUIREMENTS:
        1. ALWAYS include ALL SIX categories in the grocery list (Produce, Meat & Seafood, Dairy & Eggs, Pantry, Spices & Seasonings, Beverages)
        2. ALWAYS format each category with '## ' prefix (e.g., '## Produce')
        3. ALWAYS include at least 3 items in each category
        4. For vegan/vegetarian diets, include plant-based alternatives in the Meat & Seafood section
        5. Provide REALISTIC quantities for a full week (21 meals)
        6. Include ALL ingredients needed for every meal
        7. Group similar items together
        8. Use standard US measurements
        9. Consider portion sizes and leftovers
        10. Format in Markdown with proper spacing
        11. Include quantities that make sense for bulk shopping
        12. Account for ingredients used in multiple meals
        """

        # ✅ Updated OpenAI Chat Completion call
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        meal_plan_text = response.choices[0].message.content.strip()

        # ✅ Ensure line breaks are properly rendered
        meal_plan_text = meal_plan_text.replace("\\n", "\n").replace("\\t", "\t").replace("\\r", "\n")

        # ✅ Format output for better readability
        formatted_lines = []
        for line in meal_plan_text.split("\n"):
            clean_line = line.strip()
            if clean_line:
                formatted_lines.append(clean_line)
        meal_plan_text = "\n\n".join(formatted_lines)

        if not meal_plan_text:
            return {"meal_plan": "⚠️ AI couldn't generate a meal plan. Please try again!"}

        return {"meal_plan": meal_plan_text}

    except Exception as e:
        error_details = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print("Error details:", error_details)  # Print to server logs
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating meal plan: {str(e)}\nTraceback: {traceback.format_exc()}"
        )

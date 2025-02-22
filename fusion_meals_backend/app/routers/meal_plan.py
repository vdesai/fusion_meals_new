from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve and print API key
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

# ✅ Input model for meal plan generation
class MealPlanRequest(BaseModel):
    diet_type: str
    preferences: str = ""

# ✅ Response model for the generated meal plan
class MealPlanResponse(BaseModel):
    meal_plan: str

# ✅ Generate meal plan endpoint
@router.post("/generate", response_model=MealPlanResponse)
async def generate_meal_plan(req: MealPlanRequest):
    try:
        prompt = f"""
        You are a dietician specializing in healthy meal planning.

        Create a 7-day meal plan that is **{req.diet_type}** and follows these preferences: **{req.preferences}**.
        For each day, provide:
        - 🥞 **Breakfast**
        - 🥗 **Lunch**
        - 🍛 **Dinner**
        
        Additionally, provide a categorized grocery list:
        - 🥦 **Vegetables**
        - 🍎 **Fruits**
        - 🍚 **Grains**
        - 🥛 **Dairy**
        - 🧂 **Spices**

        The output should be formatted with explicit newlines (\\n) and spacing between sections so that it appears readable in Markdown format, not as a single line. Each day's section and grocery list must be clearly separated.
        """

        # ✅ Updated OpenAI Chat Completion call
        response = openai.chat.completions.create(
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
        raise HTTPException(status_code=500, detail=f"Error generating meal plan: {str(e)}")

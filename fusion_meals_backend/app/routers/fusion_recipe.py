from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ✅ Retrieve API key securely
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("❌ OPENAI_API_KEY is not set in the .env file.")
print(f"OpenAI API Key Loaded: {api_key}")

# ✅ Initialize OpenAI client
client = OpenAI(api_key=api_key)

router = APIRouter()

# ✅ Input model for recipe generation
class RecipeRequest(BaseModel):
    ingredients: str
    cuisine1: str
    cuisine2: str
    dietary_preference: str = "None"

# ✅ Response model for the generated recipe
class RecipeResponse(BaseModel):
    recipe: str

# ✅ Dietary preference descriptions
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

# ✅ Generate fusion recipe endpoint
@router.post("/generate", response_model=RecipeResponse)
async def generate_fusion_recipe(req: RecipeRequest):
    try:
        diet_instruction = diet_instructions.get(req.dietary_preference, "No dietary restrictions.")

        prompt = f"""
        You are an AI chef specializing in fusion cuisine.

        User has requested a fusion dish combining **{req.cuisine1} and {req.cuisine2}** cuisine.
        Available ingredients: {req.ingredients}.

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

        Ensure proper markdown formatting with clear sections and bullet points.
        """

        # ✅ Updated OpenAI Chat Completion call
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        recipe_text = response.choices[0].message.content.strip()

        if not recipe_text or "recipe not found" in recipe_text.lower():
            return {"recipe": "⚠️ AI couldn't generate a recipe. Try modifying the ingredients!"}

        return {"recipe": recipe_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")

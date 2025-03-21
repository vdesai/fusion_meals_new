from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
import re

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

router = APIRouter()

class SubstituteRequest(BaseModel):
    ingredient: str
    dietary_restriction: Optional[str] = None
    purpose: Optional[str] = "cooking"  # cooking, baking, etc.
    quantity: Optional[str] = None

class SubstituteItem(BaseModel):
    name: str
    conversion_ratio: float
    nutrition_match: float  # 0-1 how close the nutrition profile is
    taste_similarity: float  # 0-1 how similar it tastes
    description: str
    usage_tips: str

class SubstituteResponse(BaseModel):
    original_ingredient: str
    substitutes: List[SubstituteItem]
    dietary_note: Optional[str] = None

@router.post("/find", response_model=SubstituteResponse)
async def get_ingredient_substitutes(req: SubstituteRequest):
    """
    Get appropriate substitutes for an ingredient based on dietary restrictions,
    cooking purpose, and nutritional equivalence.
    """
    try:
        # Clean up ingredient name
        ingredient = req.ingredient.strip().lower()
        
        # Create a prompt for the LLM
        prompt = f"""
        You are a culinary expert specializing in ingredient substitutions.
        
        INGREDIENT TO SUBSTITUTE: {ingredient}
        QUANTITY: {req.quantity if req.quantity else 'not specified'}
        COOKING PURPOSE: {req.purpose}
        DIETARY RESTRICTION: {req.dietary_restriction if req.dietary_restriction else 'none'}
        
        I need you to provide 3-5 suitable substitutes for this ingredient. For each substitute, include:
        
        1. The exact name of the substitute ingredient
        2. A conversion ratio as a decimal number (e.g., use 0.75 to indicate using 0.75 units of substitute for 1 unit of original)
        3. A nutrition match score (0-1) indicating how well it matches the nutritional profile
        4. A taste similarity score (0-1) indicating how close the flavor is to the original
        5. A short description of why this substitute works
        6. Tips for using it in recipes
        
        Format your response as a clean JSON object exactly like this:
        {{
          "substitutes": [
            {{
              "name": "substitute name",
              "conversion_ratio": 0.75,
              "nutrition_match": 0.8,
              "taste_similarity": 0.7,
              "description": "Why this works as a substitute",
              "usage_tips": "How to use it in cooking"
            }},
            ...more substitutes...
          ]
        }}
        
        ONLY output this JSON object and nothing else. No explanations before or after. 
        Make sure the JSON is valid with proper quotation marks, commas, and brackets.
        All numeric values should be decimal numbers, not fractions or ratios like "1:0.75".
        
        Base your substitutions on modern culinary knowledge, nutrition science, and cooking chemistry.
        Consider the cooking purpose when suggesting substitutes.
        If the user has dietary restrictions, ensure the substitutes respect them.
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Extract and clean the response
        content = response.choices[0].message.content.strip()
        
        # Parse the JSON into substitutes
        data = json.loads(content)
        
        substitutes = []
        for item in data["substitutes"]:
            # Handle potential string ratio format (e.g. "1:0.75")
            conversion_ratio = item["conversion_ratio"]
            if isinstance(conversion_ratio, str):
                # If it's formatted as "1:X", extract X
                if ":" in conversion_ratio:
                    match = re.search(r'1:(\d+\.?\d*)', conversion_ratio)
                    if match:
                        conversion_ratio = float(match.group(1))
                    else:
                        conversion_ratio = 1.0
                else:
                    # Try to convert directly to float
                    try:
                        conversion_ratio = float(conversion_ratio)
                    except ValueError:
                        conversion_ratio = 1.0
            
            substitutes.append(
                SubstituteItem(
                    name=item["name"],
                    conversion_ratio=float(conversion_ratio),
                    nutrition_match=float(item["nutrition_match"]),
                    taste_similarity=float(item["taste_similarity"]),
                    description=item["description"],
                    usage_tips=item["usage_tips"]
                )
            )
        
        # Create a dietary note if needed
        dietary_note = None
        if req.dietary_restriction:
            dietary_note = f"All substitutes are compatible with {req.dietary_restriction} dietary needs."
        
        return SubstituteResponse(
            original_ingredient=req.ingredient,
            substitutes=substitutes,
            dietary_note=dietary_note
        )
        
    except Exception as e:
        print(f"Error generating substitutes: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error finding substitutes: {str(e)}"
        ) 
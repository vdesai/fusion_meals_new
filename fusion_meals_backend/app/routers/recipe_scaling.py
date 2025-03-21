from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import re
from dotenv import load_dotenv
from openai import OpenAI
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

router = APIRouter()

class ScalingRequest(BaseModel):
    recipe_text: str
    scale_factor: float  # e.g., 0.5 to halve, 2 to double
    convert_units: Optional[str] = None  # "metric" or "imperial" or None
    serving_size: Optional[int] = None  # Adjust to specific serving size

class ScalingResponse(BaseModel):
    original_recipe: str
    scaled_recipe: str
    original_serving_size: Optional[int] = None
    new_serving_size: Optional[int] = None
    conversion_details: Optional[Dict[str, Any]] = None
    

@router.post("/scale", response_model=ScalingResponse)
async def scale_recipe(req: ScalingRequest):
    """
    Scale a recipe by a given factor and optionally convert between measurement systems.
    """
    try:
        recipe_text = req.recipe_text.strip()
        scale_factor = req.scale_factor
        convert_units = req.convert_units
        target_serving_size = req.serving_size
        
        # Debug logging
        print(f"Recipe scaling request - scale_factor: {scale_factor}, target_serving_size: {target_serving_size}, convert_units: {convert_units}")
        
        # Check if the recipe is in JSON format (structured)
        is_json_recipe = False
        recipe_json = None
        
        try:
            # Try to parse recipe as JSON
            recipe_json = json.loads(recipe_text)
            is_json_recipe = isinstance(recipe_json, dict)
            print(f"Detected JSON recipe: {is_json_recipe}")
            
            # If it's a JSON recipe, extract serving size from the JSON structure
            if is_json_recipe and "SERVES" in recipe_json:
                original_serving_size = int(recipe_json["SERVES"])
                print(f"Extracted serving size from JSON: {original_serving_size}")
            else:
                original_serving_size = None
        except json.JSONDecodeError:
            # Not a JSON recipe, proceed with text extraction
            is_json_recipe = False
            recipe_json = None
            original_serving_size = None
            
        # If not a JSON recipe, extract serving size from text
        if not is_json_recipe:
            serving_size_match = re.search(r'serves\s+(\d+)|servings?:?\s*(\d+)|yield:?\s*(\d+)|for\s+(\d+)\s+people', 
                                        recipe_text.lower())
            if serving_size_match:
                for group in serving_size_match.groups():
                    if group:
                        original_serving_size = int(group)
                        break
        
        print(f"Original serving size detected: {original_serving_size}")
        
        # Calculate the actual scale factor if target_serving_size is provided
        if target_serving_size and original_serving_size:
            actual_scale_factor = target_serving_size / original_serving_size
            print(f"Using target serving size: {target_serving_size}, calculated scale factor: {actual_scale_factor}")
        elif target_serving_size and not original_serving_size:
            # If target serving size is provided but original serving size couldn't be detected
            print(f"Target serving size provided ({target_serving_size}), but original serving size not detected. Using scale factor: {scale_factor}")
            actual_scale_factor = scale_factor
            # For JSON recipes, if SERVES field doesn't exist, we'll add it with the target value
            if is_json_recipe and recipe_json:
                print(f"Adding SERVES field to JSON recipe with value: {target_serving_size}")
                recipe_json["SERVES"] = target_serving_size
                original_serving_size = target_serving_size  # Set this so we can calculate new_serving_size later
        else:
            actual_scale_factor = scale_factor
            print(f"Using provided scale factor: {actual_scale_factor}")
            
        # Create different prompts based on recipe type
        if is_json_recipe:
            new_serving_size = target_serving_size if target_serving_size else (
                int(original_serving_size * actual_scale_factor) if original_serving_size else None
            )
            
            prompt = f"""
            You are a culinary expert specializing in recipe scaling and unit conversion.
            
            I need you to scale a recipe by a factor of {actual_scale_factor} and make it easy to follow.
            
            ORIGINAL RECIPE (in JSON format):
            {json.dumps(recipe_json, indent=2)}
            
            SCALING FACTOR: {actual_scale_factor}
            
            {"CONVERT UNITS TO: " + convert_units.upper() if convert_units else ""}
            
            {"TARGET SERVING SIZE: " + str(target_serving_size) if target_serving_size else ""}
            
            Please:
            1. Carefully identify all ingredient quantities in the recipe and adjust them by the scaling factor
            2. Round to reasonable cooking measurements (e.g., don't say 1.33 eggs, say 1 or 2 eggs)
            3. For very small amounts (less than 1/8 tsp), use a pinch or dash
            4. Update the SERVES value to {new_serving_size if new_serving_size else f"approximately {original_serving_size * actual_scale_factor:.1f} if original was {original_serving_size}"}
            5. Keep all other recipe fields the same (TITLE, DESCRIPTION, etc.)
            6. Intelligent handling of ranges (e.g., "2-3 cloves garlic" scaled by 2 becomes "4-6 cloves garlic")
            
            Return the scaled recipe in the EXACT SAME JSON format as the original, maintaining all fields and structure.
            
            Format your response as a clean JSON object with the following structure:
            {{
              "scaled_recipe": THE_COMPLETE_SCALED_RECIPE_JSON_OBJECT,
              "conversion_details": {{
                "original_serving_size": {original_serving_size if original_serving_size is not None else "null"},
                "new_serving_size": {new_serving_size if new_serving_size is not None else "null"},
                "significant_changes": [
                  "flour: 2 cups → 4 cups",
                  "salt: 1 tsp → 2 tsp"
                ]
              }}
            }}
            
            IMPORTANT: Make sure to update all ingredient quantities proportionally according to the scaling factor!
            IMPORTANT: Make sure to update the SERVES field to {new_serving_size if new_serving_size else "the scaled value"}!
            
            ONLY output this JSON object and nothing else. No explanations before or after.
            """
        else:
            new_serving_size = target_serving_size if target_serving_size else (
                int(original_serving_size * actual_scale_factor) if original_serving_size else None
            )
            
            prompt = f"""
            You are a culinary expert specializing in recipe scaling and unit conversion.
            
            I need you to scale a recipe by a factor of {actual_scale_factor} and make it easy to follow.
            
            ORIGINAL RECIPE:
            {recipe_text}
            
            SCALING FACTOR: {actual_scale_factor}
            
            {"CONVERT UNITS TO: " + convert_units.upper() if convert_units else ""}
            
            {"TARGET SERVING SIZE: " + str(target_serving_size) if target_serving_size else ""}
            
            Please:
            1. Carefully identify all ingredient quantities and adjust them by the scaling factor
            2. Round to reasonable cooking measurements (e.g., don't say 1.33 eggs, say 1 or 2 eggs)
            3. Maintain the same formatting and structure as the original recipe
            4. For very small amounts (less than 1/8 tsp), use a pinch or dash
            5. Keep instructions clear and easy to follow
            6. If original serving size is mentioned, update it to {new_serving_size if new_serving_size else f"approximately {original_serving_size * actual_scale_factor:.1f} if original was {original_serving_size}"}
            7. Include all parts of the original recipe (ingredients, instructions, notes, etc.)
            8. Intelligent handling of ranges (e.g., "2-3 cloves garlic" scaled by 2 becomes "4-6 cloves garlic")
            
            Format your response as a clean JSON object with the following structure:
            {{
              "scaled_recipe": "The full scaled recipe with all the original sections and formatting",
              "conversion_details": {{
                "original_serving_size": {original_serving_size if original_serving_size is not None else "null"},
                "new_serving_size": {new_serving_size if new_serving_size is not None else "null"},
                "significant_changes": [
                  "flour: 2 cups → 4 cups",
                  "salt: 1 tsp → 2 tsp"
                ]
              }}
            }}
            
            IMPORTANT: Make sure to update all ingredient quantities proportionally according to the scaling factor!
            IMPORTANT: Make sure to update the serving size information in the recipe text!
            
            ONLY output this JSON object and nothing else. No explanations before or after.
            """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,  # Lower temperature for more precise calculations
            response_format={"type": "json_object"}
        )
        
        # Extract and clean the response
        content = response.choices[0].message.content.strip()
        print(f"API response: {content[:200]}...")  # Print truncated response for debugging
        
        try:
            # Parse the JSON into a structured response
            data = json.loads(content)
            
            # Validate required fields
            if "scaled_recipe" not in data:
                raise ValueError("API response missing 'scaled_recipe' field")
                
            # Handle scaled_recipe based on the original recipe format
            if is_json_recipe:
                # For JSON recipes, ensure scaled_recipe is properly serialized
                if isinstance(data["scaled_recipe"], dict):
                    scaled_recipe = json.dumps(data["scaled_recipe"], indent=2)
                else:
                    # If OpenAI returned it as a string, try to parse it back to ensure it's valid
                    try:
                        json_obj = json.loads(data["scaled_recipe"])
                        scaled_recipe = json.dumps(json_obj, indent=2)
                    except (json.JSONDecodeError, TypeError):
                        scaled_recipe = data["scaled_recipe"]
            else:
                # For text recipes, just use the string
                if isinstance(data["scaled_recipe"], dict):
                    scaled_recipe = json.dumps(data["scaled_recipe"], indent=2)
                else:
                    scaled_recipe = data["scaled_recipe"]
            
            # Create the response
            return ScalingResponse(
                original_recipe=recipe_text,
                scaled_recipe=scaled_recipe,
                original_serving_size=original_serving_size,
                new_serving_size=data.get("conversion_details", {}).get("new_serving_size"),
                conversion_details=data.get("conversion_details")
            )
        except json.JSONDecodeError as json_err:
            print(f"JSON parsing error: {str(json_err)}")
            print(f"Raw content: {content}")
            raise HTTPException(
                status_code=500,
                detail=f"Error parsing API response: {str(json_err)}"
            )
        
    except Exception as e:
        print(f"Error scaling recipe: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error scaling recipe: {str(e)}"
        )


@router.post("/convert-units", response_model=ScalingResponse)
async def convert_recipe_units(req: ScalingRequest):
    """
    Convert recipe units between metric and imperial systems without scaling.
    """
    # For unit conversion only, we set scale factor to 1.0
    modified_request = ScalingRequest(
        recipe_text=req.recipe_text,
        scale_factor=1.0,
        convert_units=req.convert_units,
        serving_size=req.serving_size
    )
    
    # Reuse the scaling endpoint with a scale factor of 1.0
    return await scale_recipe(modified_request) 
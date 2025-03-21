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

class SharingRequest(BaseModel):
    recipe_text: str
    platform: str  # "twitter", "instagram", "facebook", "email"
    additional_notes: Optional[str] = None
    include_tags: Optional[bool] = True
    highlight_feature: Optional[str] = None  # "healthy", "quick", "budget", "vegetarian", etc.

class SharingResponse(BaseModel):
    original_recipe: str
    sharing_content: Dict[str, Any]
    suggested_image_prompts: List[str]
    suggested_tags: List[str]
    scheduled_time_suggestions: Optional[List[Dict[str, str]]] = None

@router.post("/generate", response_model=SharingResponse)
async def generate_sharing_content(req: SharingRequest):
    """
    Generate social media sharing content for a recipe.
    """
    try:
        recipe_text = req.recipe_text.strip()
        platform = req.platform.lower()
        additional_notes = req.additional_notes
        include_tags = req.include_tags
        highlight_feature = req.highlight_feature
        
        # Check if the recipe is in JSON format
        is_json_recipe = False
        try:
            recipe_json = json.loads(recipe_text)
            is_json_recipe = isinstance(recipe_json, dict)
            if is_json_recipe:
                # Format the JSON recipe for better processing
                formatted_recipe = json.dumps(recipe_json, indent=2)
                # Extract recipe title if available
                recipe_title = recipe_json.get("TITLE", "Recipe")
            else:
                formatted_recipe = recipe_text
                recipe_title = "Recipe"
        except:
            formatted_recipe = recipe_text
            recipe_title = "Recipe"
        
        # Platform-specific content length and style guidance
        platform_guidance = {
            "twitter": "280 character limit. Conversational, witty, use emojis sparingly. Use line breaks for readability.",
            "instagram": "Strong visual focus, use emojis, descriptive and evocative language, 5-10 relevant hashtags.",
            "facebook": "Medium length, conversational, personal tone, 1-2 questions to engage audience.",
            "email": "More detailed, personal, include a subject line, greeting, and closing. Focus on why the recipient would enjoy it."
        }
        
        # Create prompt for sharing content generation
        prompt = f"""
        As a social media and food content expert, create compelling sharing content for this recipe:

        RECIPE:
        {formatted_recipe}

        TARGET PLATFORM: {platform}
        PLATFORM GUIDANCE: {platform_guidance.get(platform, "Keep it engaging and authentic.")}
        {"ADDITIONAL NOTES: " + additional_notes if additional_notes else ""}
        {"HIGHLIGHT THIS FEATURE: " + highlight_feature if highlight_feature else ""}

        Please generate:

        1. SHARING CONTENT:
           - Create the exact text/content that should be posted
           - If email, include subject line
           - Highlight what makes this recipe special
           - Make it authentic, engaging, and optimized for the platform
           - Include a call to action (try it, share thoughts, etc.)

        2. IMAGE DESCRIPTION PROMPTS:
           - 3 detailed prompts that could be used to generate appealing images of this dish
           - Focus on visual appeal, styling, and presentation
           - Include lighting suggestions, angles, and prop ideas

        3. SUGGESTED HASHTAGS/TAGS:
           - 8-10 relevant and trending hashtags/tags for the recipe
           - Mix of popular and niche tags
           - Include food-specific, dietary-specific, and seasonal tags if relevant

        4. BEST TIME TO POST:
           - Suggest 3 optimal times to post this recipe content
           - Include day of week and time
           - Explain why this timing would be effective

        Format your response as a JSON object with the following structure:
        {{
          "sharing_content": {{
            "main_text": "The actual post text goes here...",
            "subject_line": "Subject for email only",
            "call_to_action": "Try this dish tonight and let me know what you think!",
            "short_version": "Shorter version for limited space"
          }},
          "suggested_image_prompts": [
            "A rustic wooden table with the dish as the centerpiece, steam rising, natural window light from the left, garnished with fresh herbs",
            "Overhead shot of the dish with ingredients artfully scattered around, bright natural lighting, blue linen napkin for contrast",
            "Close-up of someone taking a bite or serving, showing texture and layers, soft focus background, warm lighting"
          ],
          "suggested_tags": [
            "#MondayMealPrep",
            "#HomemadeCooking",
            "#ComfortFood",
            "#FoodPhotography",
            "#RecipeShare",
            "#FoodBlogger",
            "#EasyRecipe",
            "#DeliciousFood"
          ],
          "scheduled_time_suggestions": [
            {{
              "day": "Sunday",
              "time": "10:00 AM",
              "rationale": "People are planning their weekly meals and have time to grocery shop"
            }},
            {{
              "day": "Thursday",
              "time": "4:30 PM",
              "rationale": "People are thinking about what to cook for dinner but still have time to shop"
            }},
            {{
              "day": "Saturday",
              "time": "11:30 AM",
              "rationale": "Weekend cooking inspiration when people have time to try new recipes"
            }}
          ]
        }}

        Make sure the content is authentic, engaging, and optimized specifically for {platform}.
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,  # Higher temperature for more creative outputs
            response_format={"type": "json_object"}
        )
        
        # Extract and process the response
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
        
        # Create the response
        return SharingResponse(
            original_recipe=recipe_text,
            sharing_content=data.get("sharing_content", {}),
            suggested_image_prompts=data.get("suggested_image_prompts", []),
            suggested_tags=data.get("suggested_tags", []),
            scheduled_time_suggestions=data.get("scheduled_time_suggestions", [])
        )
        
    except Exception as e:
        print(f"Error generating sharing content: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating sharing content: {str(e)}"
        ) 
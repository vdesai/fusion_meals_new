from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
import random

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

router = APIRouter()

class CuisineRequest(BaseModel):
    region: Optional[str] = None  # e.g., "East Asia", "Mediterranean", "South America"
    country: Optional[str] = None  # e.g., "Thailand", "Mexico", "Italy"
    dietary_preference: Optional[str] = None  # e.g., "vegetarian", "gluten-free"
    difficulty_level: Optional[str] = None  # e.g., "beginner", "intermediate", "advanced"
    include_history: bool = True
    include_techniques: bool = True

class CuisineResponse(BaseModel):
    cuisine_info: Dict[str, Any]
    representative_dishes: List[Dict[str, Any]]
    cultural_context: Optional[Dict[str, Any]] = None
    techniques: Optional[List[Dict[str, Any]]] = None

@router.post("/explore", response_model=CuisineResponse)
async def explore_cuisine(req: CuisineRequest):
    """
    Explore a global cuisine with detailed information about its history,
    key dishes, cultural significance, and cooking techniques.
    """
    try:
        # Build the prompt based on request
        region_text = f"from the {req.region} region" if req.region else ""
        country_text = f"from {req.country}" if req.country else ""
        dietary_text = f"with a focus on {req.dietary_preference} options" if req.dietary_preference else ""
        difficulty_text = f"suitable for {req.difficulty_level} cooks" if req.difficulty_level else ""
        
        location = country_text or region_text
        query_text = f"cuisine {location} {dietary_text} {difficulty_text}".strip()
        
        # Create systems prompt
        system_prompt = """You are a culinary anthropologist with expertise in global cuisines.
        Provide detailed, accurate information about the requested cuisine, including its history,
        cultural significance, key ingredients, signature dishes, and cooking techniques.
        Focus on authenticity and cultural context. Provide information in a structured JSON format."""
        
        history_section = """
        Include a detailed history of the cuisine, including:
        - Historical origins
        - Key cultural influences
        - Evolution over time
        - Regional variations
        """ if req.include_history else ""
        
        techniques_section = """
        Include traditional cooking techniques:
        - Name and description of each technique
        - Cultural significance
        - Key dishes that use the technique
        - Basic instructions for home cooks to try
        """ if req.include_techniques else ""
        
        # Create user prompt
        user_prompt = f"""
        Please provide comprehensive information about {query_text}.
        
        {history_section}
        {techniques_section}
        
        Return the information in the following JSON structure:
        {{
          "cuisine_info": {{
            "name": "",
            "region": "",
            "countries": [""],
            "key_ingredients": [""],
            "flavor_profile": "",
            "historical_overview": "",
            "dietary_characteristics": ""
          }},
          "representative_dishes": [
            {{
              "name": "",
              "description": "",
              "key_ingredients": [""],
              "cultural_significance": "",
              "difficulty": "",
              "preparation_time": "",
              "typical_occasions": ""
            }}
          ],
          "cultural_context": {{
            "dining_customs": "",
            "meal_structure": "",
            "cultural_significance": "",
            "celebrations_and_festivals": [""]
          }},
          "techniques": [
            {{
              "name": "",
              "description": "",
              "cultural_significance": "",
              "key_dishes": [""],
              "basic_instructions": ""
            }}
          ]
        }}
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        # Parse the response
        cuisine_data = json.loads(response.choices[0].message.content)
        
        # Return the response
        return cuisine_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exploring cuisine: {str(e)}")

@router.get("/regions")
async def get_cuisine_regions():
    """
    Get a list of global cuisine regions for exploration.
    """
    regions = {
        "regions": [
            {
                "name": "East Asia",
                "countries": ["China", "Japan", "Korea", "Taiwan"],
                "description": "Known for umami flavors, rice-based dishes, and techniques like stir-frying and steaming."
            },
            {
                "name": "Southeast Asia",
                "countries": ["Thailand", "Vietnam", "Malaysia", "Indonesia", "Philippines"],
                "description": "Bold flavors combining sweet, sour, salty, and spicy elements, with abundant herbs and spices."
            },
            {
                "name": "South Asia",
                "countries": ["India", "Pakistan", "Nepal", "Sri Lanka", "Bangladesh"],
                "description": "Rich in spices, curries, and vegetarian options, with regional variations across the subcontinent."
            },
            {
                "name": "Middle East & North Africa",
                "countries": ["Lebanon", "Turkey", "Morocco", "Egypt", "Iran"],
                "description": "Features mezze platters, grilled meats, aromatic spices, and dishes influenced by ancient trade routes."
            },
            {
                "name": "Mediterranean",
                "countries": ["Italy", "Greece", "Spain", "France (Southern)", "Cyprus"],
                "description": "Olive oil-based cuisine with fresh vegetables, seafood, and herbs reflecting a healthy lifestyle."
            },
            {
                "name": "Eastern Europe",
                "countries": ["Poland", "Russia", "Ukraine", "Hungary", "Romania"],
                "description": "Hearty dishes with potatoes, cabbage, and preserved foods, adapted to cold climates."
            },
            {
                "name": "Western & Northern Europe",
                "countries": ["France", "Germany", "United Kingdom", "Scandinavia"],
                "description": "Ranging from refined French techniques to rustic comfort foods, with emphasis on local ingredients."
            },
            {
                "name": "Latin America & Caribbean",
                "countries": ["Mexico", "Peru", "Brazil", "Argentina", "Jamaica"],
                "description": "Vibrant flavors combining indigenous ingredients with European, African, and Asian influences."
            },
            {
                "name": "North America",
                "countries": ["United States", "Canada"],
                "description": "Diverse fusion cuisine blending immigrant traditions with innovative techniques and abundant resources."
            },
            {
                "name": "Africa (Sub-Saharan)",
                "countries": ["Ethiopia", "Nigeria", "South Africa", "Senegal", "Kenya"],
                "description": "Rich stews, grains, and plant-based dishes with bold spices and unique fermentation techniques."
            }
        ]
    }
    return regions

@router.get("/techniques")
async def get_global_techniques():
    """
    Get a list of global cooking techniques across cuisines.
    """
    techniques = {
        "techniques": [
            {
                "name": "Stir-frying",
                "origin": "China",
                "description": "Quick cooking of small pieces of food in a wok over high heat with constant stirring",
                "difficulty": "Intermediate"
            },
            {
                "name": "Sous Vide",
                "origin": "France",
                "description": "Vacuum-sealed food cooked in a water bath at a precise, constant temperature",
                "difficulty": "Intermediate"
            },
            {
                "name": "Fermentation",
                "origin": "Global",
                "description": "Using bacteria, yeasts or other microorganisms to transform food, creating new flavors and preserving items",
                "difficulty": "Advanced"
            },
            {
                "name": "Smoking",
                "origin": "Global",
                "description": "Exposing food to smoke from burning or smoldering plant materials for flavor",
                "difficulty": "Advanced"
            },
            {
                "name": "Tandoor Cooking",
                "origin": "India/Central Asia",
                "description": "Cooking in a clay oven called a tandoor at very high temperatures",
                "difficulty": "Advanced"
            },
            {
                "name": "Tagine Cooking",
                "origin": "North Africa",
                "description": "Slow-cooking in a conical earthenware pot that traps steam and returns moisture to the dish",
                "difficulty": "Intermediate"
            },
            {
                "name": "Nixtamalization",
                "origin": "Mesoamerica",
                "description": "Processing corn with alkaline solution to improve nutritional value and flavor",
                "difficulty": "Advanced"
            },
            {
                "name": "Braising",
                "origin": "Global",
                "description": "Searing food at high temperature, then cooking slowly in liquid in a covered pot",
                "difficulty": "Beginner"
            }
        ]
    }
    return techniques

@router.get("/ingredient-map")
async def get_ingredient_map():
    """
    Get a map of signature ingredients across global cuisines.
    """
    ingredient_map = {
        "ingredient_map": [
            {
                "category": "Spices",
                "ingredients": [
                    {"name": "Saffron", "cuisines": ["Persian", "Spanish", "Indian"], "notes": "The world's most expensive spice, derived from crocus flowers"},
                    {"name": "Star Anise", "cuisines": ["Chinese", "Vietnamese"], "notes": "Key component in Chinese five-spice and Vietnamese pho"},
                    {"name": "Sumac", "cuisines": ["Middle Eastern", "Mediterranean"], "notes": "Tart, lemony spice used in za'atar and many Lebanese dishes"},
                    {"name": "Berbere", "cuisines": ["Ethiopian"], "notes": "Complex spice blend with chili peppers, fenugreek, and more"}
                ]
            },
            {
                "category": "Condiments",
                "ingredients": [
                    {"name": "Fish Sauce", "cuisines": ["Thai", "Vietnamese"], "notes": "Fermented anchovy sauce adding umami depth"},
                    {"name": "Gochujang", "cuisines": ["Korean"], "notes": "Fermented chili paste with sweet, spicy and umami notes"},
                    {"name": "Harissa", "cuisines": ["North African"], "notes": "Hot chili pepper paste with roasted red peppers and spices"},
                    {"name": "Miso", "cuisines": ["Japanese"], "notes": "Fermented soybean paste used in soups, marinades and glazes"}
                ]
            },
            {
                "category": "Aromatics",
                "ingredients": [
                    {"name": "Lemongrass", "cuisines": ["Thai", "Vietnamese", "Malaysian"], "notes": "Citrusy stalks used in soups, curries and stir-fries"},
                    {"name": "Epazote", "cuisines": ["Mexican"], "notes": "Herb with notes of mint, citrus, and petroleum used in bean dishes"},
                    {"name": "Kaffir Lime Leaves", "cuisines": ["Thai"], "notes": "Aromatic leaves with intense citrus notes"},
                    {"name": "Asafoetida", "cuisines": ["Indian"], "notes": "Pungent resin with onion-garlic flavor when cooked"}
                ]
            }
        ]
    }
    return ingredient_map 
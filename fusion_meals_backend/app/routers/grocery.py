from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
from dotenv import load_dotenv
import re
from ..services.amazon_service import amazon_client, AmazonProduct

# Load environment variables
load_dotenv()

router = APIRouter()

class GroceryItem(BaseModel):
    name: str
    quantity: str
    category: str

class GroceryListRequest(BaseModel):
    recipe_ingredients: str

class GroceryListResponse(BaseModel):
    items: List[GroceryItem]
    estimated_total: float

class AmazonCheckoutRequest(BaseModel):
    items: List[GroceryItem]
    user_token: Optional[str] = None

class AmazonCheckoutResponse(BaseModel):
    cart_id: str
    checkout_url: str
    item_count: int
    total_price: float
    matched_items: List[Dict[str, Any]]
    success: bool
    message: str

@router.post("/parse-recipe", response_model=GroceryListResponse)
async def parse_recipe_ingredients(req: GroceryListRequest):
    try:
        print("\n=== Received ingredients ===")
        print(req.recipe_ingredients)
        print("===========================\n")
        
        if not req.recipe_ingredients or not req.recipe_ingredients.strip():
            raise HTTPException(status_code=400, detail="No ingredients provided")
        
        # First, try to parse the ingredients directly from the input
        # This will preserve the exact categories and items
        try:
            # Create a dictionary to store items by category
            categorized_items = {}
            
            # Define the required categories
            required_categories = ["Produce", "Meat & Seafood", "Dairy & Eggs", "Pantry", "Spices & Seasonings", "Beverages"]
            
            # Define common items for each category to help with categorization
            category_items = {
                "Produce": ["cabbage", "tomatoes", "cucumbers", "spinach", "greens", "cauliflower", "mushrooms", 
                           "eggplant", "berries", "lettuce", "onion", "garlic", "potato", "carrot", "pepper", "broccoli",
                           "ginger", "chili", "coriander", "cilantro", "lemon", "lime", "fruit", "vegetable", "beans",
                           "zucchini", "squash", "peas", "corn", "asparagus", "brussels", "kale", "celery", "radish",
                           "avocado", "apple", "banana", "orange", "grape", "melon", "berry", "salad"],
                "Meat & Seafood": ["chicken", "beef", "pork", "lamb", "fish", "salmon", "shrimp", "tofu", "tempeh", "seitan",
                                  "meat", "seafood", "turkey", "duck", "sausage", "bacon", "ham", "steak", "ground"],
                "Dairy & Eggs": ["milk", "cheese", "yogurt", "butter", "cream", "eggs", "paneer", "cottage cheese", "sour cream",
                                "dairy", "curd", "ghee", "buttermilk", "kefir", "whey", "ricotta", "mozzarella", "cheddar"],
                "Pantry": ["rice", "pasta", "flour", "sugar", "oil", "vinegar", "sauce", "canned", "dried",
                          "bread", "cereal", "grain", "nut", "seed", "noodle", "cracker", "chip", "snack",
                          "honey", "syrup", "jam", "peanut butter", "condiment"],
                "Spices & Seasonings": ["salt", "pepper", "cumin", "turmeric", "paprika", "cinnamon", "oregano", "basil", "thyme",
                                       "spice", "herb", "seasoning", "masala", "powder", "extract", "vanilla", "bay leaf",
                                       "chili powder", "curry", "garam masala", "cardamom", "clove", "nutmeg"],
                "Beverages": ["water", "juice", "soda", "coffee", "tea", "wine", "beer", "drink", "beverage", "smoothie",
                             "cocktail", "liquor", "spirit", "kombucha", "lemonade", "cider"]
            }
            
            # Special case items that need specific categorization
            special_cases = {
                "paneer": "Dairy & Eggs",
                "tofu": "Meat & Seafood",
                "tempeh": "Meat & Seafood",
                "seitan": "Meat & Seafood",
                "yogurt": "Dairy & Eggs",
                "curd": "Dairy & Eggs",
                "ghee": "Dairy & Eggs"
            }
            
            # Extract all items from the input first, regardless of their original category
            all_extracted_items = []
            
            # Clean up the input - remove any leading/trailing whitespace
            cleaned_input = req.recipe_ingredients.strip()
            
            # Split the input into sections based on markdown headers
            # First normalize the headers to ensure they all start with ##
            normalized_input = cleaned_input
            if not normalized_input.startswith("##"):
                # Check if the first line is a category
                first_line_end = normalized_input.find("\n")
                if first_line_end > 0:
                    first_line = normalized_input[:first_line_end].strip()
                    # If it's a category name without ##, add ##
                    if any(category in first_line for category in required_categories):
                        normalized_input = "## " + normalized_input
            
            # Split by section headers (## Category)
            sections = re.split(r'\n##\s+|\n#\s+|^##\s+', normalized_input)
            # Remove any empty sections
            sections = [s.strip() for s in sections if s.strip()]
            
            print(f"Found {len(sections)} sections to process")
            
            # Process each section
            for section in sections:
                lines = section.strip().split('\n')
                if not lines:
                    continue
                
                # Extract category name from the first line
                category_line = lines[0].strip()
                category = category_line.replace(':', '').strip()
                
                # Skip if no valid category
                if not category:
                    continue
                    
                print(f"Processing category: {category}")
                
                # Process items in this category
                for i in range(1, len(lines)):
                    line = lines[i].strip()
                    if not line or line.startswith('#'):
                        continue
                        
                    # Try different formats for item-quantity pairs
                    # Format 1: "- Item - Quantity"
                    if line.startswith('-'):
                        line = line[1:].strip()
                        
                    # Format 2: "Item - Quantity"
                    if ' - ' in line:
                        parts = line.split(' - ', 1)
                        name = parts[0].strip()
                        quantity = parts[1].strip() if len(parts) > 1 else "1"
                        
                        # Add to all extracted items
                        all_extracted_items.append({"name": name, "quantity": quantity, "original_category": category})
                        continue
                    
                    # Format 3: Just try to split on last hyphen
                    if '-' in line:
                        last_hyphen = line.rfind('-')
                        name = line[:last_hyphen].strip()
                        quantity = line[last_hyphen+1:].strip()
                        if name and quantity:
                            # Add to all extracted items
                            all_extracted_items.append({"name": name, "quantity": quantity, "original_category": category})
                            continue
                    
                    # Format 4: Just use the whole line as the item name
                    name = line.strip()
                    if name:
                        # Add to all extracted items
                        all_extracted_items.append({"name": name, "quantity": "1", "original_category": category})
            
            # Now categorize all extracted items
            # First, create a set to track items we've already categorized to avoid duplicates
            categorized_item_names = set()
            
            # Process items in a specific order of categories to ensure proper categorization
            # This helps ensure items like "green beans" go to Produce instead of Pantry
            category_priority = ["Dairy & Eggs", "Meat & Seafood", "Produce", "Spices & Seasonings", "Pantry", "Beverages"]
            
            # First pass: categorize items based on their original category and keywords
            for item in all_extracted_items:
                name = item["name"]
                quantity = item["quantity"]
                item_lower = name.lower()
                
                # Skip if we've already categorized this item
                if item_lower in categorized_item_names:
                    continue
                
                # Check for special cases first
                correct_category = None
                for special_item, special_category in special_cases.items():
                    if special_item in item_lower:
                        correct_category = special_category
                        break
                
                # If not a special case, check each category in priority order
                if not correct_category:
                    for cat in category_priority:
                        keywords = category_items.get(cat, [])
                        if any(keyword in item_lower for keyword in keywords):
                            correct_category = cat
                            break
                
                # If no category matched, use the original category
                if not correct_category:
                    correct_category = item["original_category"]
                
                # Add the item to the correct category
                if correct_category not in categorized_items:
                    categorized_items[correct_category] = []
                
                categorized_items[correct_category].append({"name": name, "quantity": quantity, "category": correct_category})
                categorized_item_names.add(item_lower)
            
            # Check if we have all required categories
            # If not, use OpenAI to fill in the missing ones
            missing_categories = [cat for cat in required_categories if cat not in categorized_items]
            
            # Add empty lists for missing categories
            for missing_cat in missing_categories:
                categorized_items[missing_cat] = []
                # Add a placeholder item to ensure the category appears in the output
                categorized_items[missing_cat].append({
                    "name": f"No {missing_cat.lower()} items needed",
                    "quantity": "",
                    "category": missing_cat
                })
            
            # DISABLED: No longer generating suggestions for missing categories
            # This ensures we ONLY use items from the original input
            
            # Convert the categorized items to a flat list
            all_items = []
            for category, items in categorized_items.items():
                all_items.extend(items)
            
            # Create the response
            result = GroceryListResponse(
                items=[GroceryItem(**item) for item in all_items],
                estimated_total=len(all_items)  # Simple estimate based on number of items
            )
            
            print("\n=== Final Response ===")
            print(result)
            print("=====================\n")
            
            return result
            
        except Exception as direct_parse_error:
            print(f"Direct parsing failed: {str(direct_parse_error)}")
            # Fall back to OpenAI parsing if direct parsing fails
            
        # Use OpenAI as a fallback
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt = f"""You are a helpful AI that converts recipe ingredients into a structured grocery list.

        The input contains ingredients from a markdown-formatted grocery list, which is organized into sections.
        Each section starts with a category name (like "Produce", "Dairy & Eggs", etc.) followed by items with their quantities.

        Input ingredients to process:
        {req.recipe_ingredients}

        Rules for processing:
        1. Process ALL sections and maintain their EXACT category names
        2. Each item must be assigned to its correct category section
        3. Keep the exact quantities as provided in the input
        4. Remove any markdown formatting (##), bullet points (-), or other special characters from item names
        5. Combine duplicate items within the same category
        6. Keep special characters in category names (e.g., "Dairy & Eggs")
        7. Process every single item from every category
        8. CRITICAL: For categories that exist in the input, use EXACTLY the items listed in those categories without modification or substitution
        9. You MUST include ALL of these categories in your response: Produce, Meat & Seafood, Dairy & Eggs, Pantry, Spices & Seasonings, and Beverages
        10. Only add reasonable items for categories that are completely missing from the input

        CRITICAL: Your response MUST be a valid JSON object with NO markdown formatting, NO code blocks, and NO explanations.
        DO NOT wrap the JSON in ```json or ``` tags. Return ONLY the raw JSON.
        
        Return ONLY a JSON object in this exact format:
        {{
            "items": [
                {{"name": "item name without quantity", "quantity": "exact quantity from input", "category": "exact category name from section"}}
            ],
            "estimated_total": number
        }}
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a JSON-only response assistant specializing in grocery lists. You MUST ALWAYS include these categories in your response: Produce, Meat & Seafood, Dairy & Eggs, Pantry, Spices & Seasonings, and Beverages. IMPORTANT: For categories that exist in the input, use EXACTLY the items listed in those categories without modification. Only add reasonable items for categories that are completely missing from the input."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,  # Lower temperature for more deterministic results
            max_tokens=2000  # Increase token limit to handle larger lists
        )

        # Get the response content
        content = response.choices[0].message.content.strip()
        print("\n=== OpenAI Response ===")
        print(content)
        print("======================\n")
        
        # Parse the JSON response
        try:
            # Remove any markdown code block formatting if present
            if content.startswith("```json"):
                content = content[7:]
            elif content.startswith("```"):
                content = content[3:]
            
            if content.endswith("```"):
                content = content[:-3]
            
            # Try to find JSON content if wrapped in other text
            json_start = content.find('{')
            json_end = content.rfind('}')
            
            if json_start >= 0 and json_end > json_start:
                content = content[json_start:json_end+1]
            
            content = content.strip()
            
            parsed_json = json.loads(content)
            print("\n=== Parsed JSON ===")
            print(json.dumps(parsed_json, indent=2))
            print("==================\n")
            
            # Validate the JSON structure
            if "items" not in parsed_json:
                raise ValueError("Response JSON missing 'items' field")
            if "estimated_total" not in parsed_json:
                raise ValueError("Response JSON missing 'estimated_total' field")
                
            # Convert to GroceryListResponse
            result = GroceryListResponse(
                items=[GroceryItem(**item) for item in parsed_json["items"]],
                estimated_total=float(parsed_json["estimated_total"])
            )
            print("\n=== Final Response ===")
            print(result)
            print("=====================\n")
            return result
        except json.JSONDecodeError as e:
            print(f"\n=== JSON Decode Error ===")
            print(f"Error: {str(e)}")
            print(f"Content: {content}")
            print("========================\n")
            
            # Fallback: Try to create a basic response if JSON parsing fails
            try:
                print("\n=== Using fallback parser ===")
                # Create a simple fallback response
                fallback_items = []
                
                # Try to extract sections from the input
                sections = req.recipe_ingredients.split('\n\n')
                if len(sections) == 1:  # If no blank lines, try splitting by section headers
                    sections = re.split(r'\n##\s+|\n#\s+', req.recipe_ingredients)
                
                print(f"Found {len(sections)} sections to process")
                
                for section in sections:
                    lines = section.strip().split('\n')
                    if not lines:
                        continue
                    
                    # Extract category name
                    category_line = lines[0].strip()
                    category = category_line.replace(':', '').replace('##', '').replace('#', '').strip()
                    
                    if not category:
                        continue
                        
                    print(f"Processing category: {category}")
                    
                    # Process items in this category
                    for i in range(1, len(lines)):
                        line = lines[i].strip()
                        if not line or line.startswith('#'):
                            continue
                            
                        # Try different formats for item-quantity pairs
                        # Format 1: "Item - Quantity"
                        if ' - ' in line:
                            parts = line.split(' - ', 1)
                            name = parts[0].replace('-', '').strip()
                            quantity = parts[1].strip() if len(parts) > 1 else "1"
                            fallback_items.append({"name": name, "quantity": quantity, "category": category})
                            continue
                            
                        # Format 2: "- Item - Quantity"
                        if line.startswith('-'):
                            line = line[1:].strip()
                            if ' - ' in line:
                                parts = line.split(' - ', 1)
                                name = parts[0].strip()
                                quantity = parts[1].strip() if len(parts) > 1 else "1"
                                fallback_items.append({"name": name, "quantity": quantity, "category": category})
                                continue
                        
                        # Format 3: Just try to split on last hyphen
                        if '-' in line:
                            last_hyphen = line.rfind('-')
                            name = line[:last_hyphen].replace('-', '').strip()
                            quantity = line[last_hyphen+1:].strip()
                            if name and quantity:
                                fallback_items.append({"name": name, "quantity": quantity, "category": category})
                                continue
                        
                        # Format 4: Just use the whole line as the item name
                        name = line.replace('-', '').strip()
                        if name:
                            fallback_items.append({"name": name, "quantity": "1", "category": category})
                
                if fallback_items:
                    print(f"Fallback parser found {len(fallback_items)} items")
                    result = GroceryListResponse(
                        items=[GroceryItem(**item) for item in fallback_items],
                        estimated_total=0.0  # We can't estimate in fallback mode
                    )
                    print("\n=== Fallback Response ===")
                    print(result)
                    print("========================\n")
                    return result
                else:
                    print("Fallback parser found no items")
            except Exception as fallback_error:
                print(f"Fallback also failed: {str(fallback_error)}")
                
            raise HTTPException(status_code=500, detail=f"Error parsing OpenAI response: {str(e)}")

    except json.JSONDecodeError as e:
        print("\n!!! JSON Decode Error !!!")
        print("Error:", str(e))
        print("Failed content:", content if 'content' in locals() else "No content")
        print("!!!!!!!!!!!!!!!!!!!!!\n")
        raise HTTPException(status_code=500, detail=f"Error parsing OpenAI response: {str(e)}")
    except Exception as e:
        print("\n!!! General Error !!!")
        print("Error:", str(e))
        print("!!!!!!!!!!!!!!!!!!\n")
        raise HTTPException(status_code=500, detail=f"Error parsing ingredients: {str(e)}")

@router.post("/add-to-cart")
async def add_to_cart(items: List[GroceryItem]):
    """
    Endpoint to add items to a shopping cart.
    This integrates with various grocery delivery services:
    - Instacart API
    - Walmart API
    - Amazon Fresh API
    - Local grocery store APIs
    """
    try:
        # Create a structured response with more details
        service_details = {
            "Instacart": {
                "available": True,
                "delivery_time": "1-2 hours",
                "delivery_fee": "$3.99",
                "min_order": "$10.00"
            },
            "Walmart Grocery": {
                "available": True,
                "delivery_time": "Same day or next day",
                "delivery_fee": "$7.95",
                "min_order": "$35.00"
            },
            "Amazon Fresh": {
                "available": True,
                "delivery_time": "2-hour delivery window",
                "delivery_fee": "Free with Prime",
                "min_order": "$35.00"
            },
            "Local Stores": {
                "available": False,
                "delivery_time": "Coming soon",
                "delivery_fee": "Varies",
                "min_order": "Varies"
            }
        }
        
        # Calculate estimated prices for the grocery items
        estimated_prices = {}
        for item in items:
            # Skip placeholder items
            if item.name.startswith("No ") and item.name.endswith("items needed"):
                continue
                
            # Very simple price estimation based on typical costs
            category_base_prices = {
                "Produce": 2.99,
                "Meat & Seafood": 7.99,
                "Dairy & Eggs": 3.99,
                "Pantry": 4.99,
                "Spices & Seasonings": 3.49,
                "Beverages": 4.29
            }
            
            # Extract quantity number if possible
            quantity_str = item.quantity.lower()
            quantity_num = 1.0
            
            # Try to extract numeric quantity
            import re
            quantity_match = re.search(r'(\d+\.?\d*)', quantity_str)
            if quantity_match:
                try:
                    quantity_num = float(quantity_match.group(1))
                except:
                    quantity_num = 1.0
            
            # Adjust for units
            if "kg" in quantity_str or "kilo" in quantity_str:
                quantity_num *= 2.2  # Convert to pounds
            
            base_price = category_base_prices.get(item.category, 3.99)
            estimated_prices[item.name] = round(base_price * quantity_num, 2)
        
        # Calculate total price
        total_price = sum(estimated_prices.values())
        
        # Simulate storing cart in a database
        cart_id = "cart_" + str(hash("".join([item.name for item in items])))[:8]
        
        return {
            "message": "Items added to cart successfully",
            "cart_id": cart_id,
            "item_count": len(estimated_prices),
            "estimated_total": round(total_price, 2),
            "supported_services": service_details,
            "estimated_prices": estimated_prices,
            "next_steps": [
                "Review your cart and make any adjustments",
                "Select a delivery service",
                "Proceed to checkout"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding items to cart: {str(e)}")

@router.post("/amazon-checkout", response_model=AmazonCheckoutResponse)
async def amazon_checkout(req: AmazonCheckoutRequest):
    """Create an Amazon cart with the specified items"""
    try:
        # Convert items to actual grocery items
        actual_items = []
        for item in req.items:
            # Extract quantity number for better matching
            quantity_match = re.search(r'(\d+\.?\d*)', item.quantity)
            quantity = 1
            if quantity_match:
                try:
                    quantity = int(float(quantity_match.group(1)))
                except:
                    quantity = 1
            
            # Limit quantity to reasonable amount
            quantity = min(quantity, 10)
            
            actual_items.append(GroceryItem(
                name=item.name,
                quantity=str(quantity),
                category=item.category
            ))
        
        # Initialize matched products list
        matched_products = []
        
        # Process each item
        for item in actual_items:
            # Get the appropriate Amazon category for this item
            amazon_category = "Grocery"
            if item.category == "Produce":
                amazon_category = "GroceryFresh"
            elif item.category == "Meat & Seafood":
                amazon_category = "GroceryFresh"
            
            # Search for products on Amazon (using mock data)
            search_term = f"{item.name}"
            products = amazon_client.search_products(search_term, amazon_category)
            
            if products:
                # Take the first matching product
                best_match = products[0]
                
                matched_products.append({
                    "asin": best_match.asin,
                    "title": best_match.title,
                    "price": best_match.price,
                    "quantity": int(item.quantity),
                    "original_item": {
                        "name": item.name,
                        "quantity": item.quantity,
                        "category": item.category
                    }
                })
                
                logger.info(f"Matched '{item.name}' to Amazon product: {best_match.title}")
            else:
                logger.warning(f"No matching products found for {item.name}")
        
        # Create cart with matched products
        if not matched_products:
            raise HTTPException(status_code=404, detail="No matching products found on Amazon")
        
        cart_response = amazon_client.create_cart(matched_products, req.user_token)
        
        # Build final response
        response = AmazonCheckoutResponse(
            cart_id=cart_response["cart_id"],
            checkout_url=cart_response["checkout_url"],
            item_count=cart_response["item_count"],
            total_price=cart_response["total_price"],
            matched_items=matched_products,
            success=cart_response["success"],
            message=cart_response["message"]
        )
        
        logger.info(f"Successfully created Amazon cart: {response.cart_id}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing Amazon checkout: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing Amazon checkout: {str(e)}") 
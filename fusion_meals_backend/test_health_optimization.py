import requests
import json

# API endpoint
url = "http://localhost:8001/ai-chef/premium/ai-chef"

# Sample meal plan data
meal_plan_data = {
    "breakfast": {
        "meal": "Scrambled eggs with toast",
        "ingredients": ["Eggs", "Butter", "Whole wheat bread", "Salt", "Pepper"]
    },
    "lunch": {
        "meal": "Chicken sandwich with chips",
        "ingredients": ["Grilled chicken breast", "White bread", "Lettuce", "Tomato", "Mayonnaise", "Potato chips"]
    },
    "dinner": {
        "meal": "Spaghetti with meat sauce",
        "ingredients": ["Spaghetti pasta", "Ground beef", "Tomato sauce", "Onion", "Garlic", "Olive oil", "Parmesan cheese"]
    },
    "snacks": [
        {
            "meal": "Chocolate chip cookies",
            "ingredients": ["Flour", "Sugar", "Butter", "Chocolate chips", "Eggs"]
        },
        {
            "meal": "Apple",
            "ingredients": ["Apple"]
        }
    ]
}

# Create request payload
payload = {
    "request_type": "health_optimization",
    "health_goals": ["heart_health", "mental_clarity"],
    "activity_level": "moderate",
    "health_conditions": ["diabetes"],
    "meal_plan_data": json.dumps(meal_plan_data)
}

# Send the request
print("Sending request to:", url)
print("Payload:", json.dumps(payload, indent=2))

try:
    response = requests.post(url, json=payload)
    
    # Print response
    print("\nStatus Code:", response.status_code)
    
    if response.status_code == 200:
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
    else:
        print("\nError Response:")
        print(response.text)
except Exception as e:
    print("Error:", e) 
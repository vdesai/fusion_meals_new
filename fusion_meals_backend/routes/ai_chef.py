from typing import Optional, Dict
from fastapi import Cookie, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fusion_meals_backend.models import AIChefRequest, AIChefResponse

def get_user_subscription(session_id: Optional[str] = Cookie(None)):
    """
    Get user subscription details from the session ID
    In a real app, this would query a database
    """
    # !!! DEMO CHANGES - Always return a demo premium user for development !!!
    # Bypassing authentication for demo purposes
    demo_mode = True
    
    if demo_mode:
        # Return a mock premium user for demo purposes
        user_id = "demo_user"
        return {
            "user_id": user_id,
            "subscription": PREMIUM_USERS[user_id]
        }
        
    # Normal authentication flow (disabled in demo mode)
    if not session_id:
        return None
        
    # For demo purposes, we're just returning the mock premium user
    user_id = "demo_user"
    
    if user_id in PREMIUM_USERS:
        return {
            "user_id": user_id,
            "subscription": PREMIUM_USERS[user_id]
        }
    return None

@router.post("/premium/ai-chef", response_model=AIChefResponse)
async def ai_personal_chef(req: AIChefRequest, user_data: Optional[Dict] = Depends(get_user_subscription)):
    """
    AI Personal Chef - Premium feature that provides personalized meal planning,
    detailed cooking guidance, ingredient sourcing, and curated recipes.
    
    This is a premium feature that requires a subscription.
    """
    # Check if user has premium access - DEMO MODE ALWAYS PASSES THIS CHECK
    if not user_data or user_data.get("subscription", {}).get("subscription_level") != "premium":
        # For demo purposes, still proceed if demo mode is enabled
        if not user_data:
            demo_mode = True
            if demo_mode:
                # Use the demo user for demonstration
                user_data = {
                    "user_id": "demo_user",
                    "subscription": PREMIUM_USERS["demo_user"]
                }
            else:
                # Normal behavior - require authentication
                raise HTTPException(status_code=403, detail={
                    "message": "This is a premium feature. Please upgrade your subscription to access AI Personal Chef.",
                    "upgrade_url": "/subscription/upgrade"
                })
    
    # Get user preferences
    user_preferences = user_data["subscription"].get("preferences", {}) 
from fastapi import APIRouter, HTTPException, Cookie, Response, Request
from pydantic import BaseModel
from typing import Optional
import json

from ..services.auth_service import auth_service, UserSession

router = APIRouter()

class AmazonAuthRequest(BaseModel):
    redirect_uri: Optional[str] = None

class AmazonCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None

class UserSessionResponse(BaseModel):
    session_id: str
    user_id: str
    amazon_connected: bool
    instacart_connected: bool

@router.get("/session")
async def get_session(session_id: Optional[str] = Cookie(None)):
    """Get the current user session"""
    if not session_id:
        # Create a new session for demo purposes
        session = auth_service.create_session("demo_user")
        response = UserSessionResponse(
            session_id=session.session_id,
            user_id=session.user_id,
            amazon_connected=session.amazon_token is not None,
            instacart_connected=session.instacart_token is not None
        )
        # Set session cookie
        response_obj = Response(content=json.dumps(response.dict()))
        response_obj.set_cookie(key="session_id", value=session.session_id, httponly=True, max_age=86400)
        return response_obj
    
    # Get existing session
    session = auth_service.get_session(session_id)
    if not session:
        # Session expired or invalid, create a new one
        session = auth_service.create_session("demo_user")
        response = UserSessionResponse(
            session_id=session.session_id,
            user_id=session.user_id,
            amazon_connected=session.amazon_token is not None,
            instacart_connected=session.instacart_token is not None
        )
        # Set session cookie
        response_obj = Response(content=json.dumps(response.dict()))
        response_obj.set_cookie(key="session_id", value=session.session_id, httponly=True, max_age=86400)
        return response_obj
    
    return UserSessionResponse(
        session_id=session.session_id,
        user_id=session.user_id,
        amazon_connected=auth_service.is_amazon_connected(session.session_id),
        instacart_connected=session.instacart_token is not None
    )

@router.post("/amazon/auth")
async def amazon_auth(req: AmazonAuthRequest, session_id: Optional[str] = Cookie(None)):
    """Start Amazon OAuth flow"""
    # Create session if not exists
    if not session_id:
        session = auth_service.create_session("demo_user")
        session_id = session.session_id
    else:
        session = auth_service.get_session(session_id)
        if not session:
            session = auth_service.create_session("demo_user")
            session_id = session.session_id
    
    # Get Amazon OAuth URL
    auth_url = auth_service.generate_amazon_auth_url()
    
    # In a real app, we would redirect to the Amazon OAuth page
    # For this demo, we'll return the URL and let the frontend handle it
    return {"auth_url": auth_url, "session_id": session_id}

@router.get("/amazon/callback")
async def amazon_callback(request: Request, session_id: Optional[str] = Cookie(None)):
    """Handle Amazon OAuth callback - this endpoint is called by Amazon after user authorizes"""
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    # Get query parameters
    query_params = dict(request.query_params)
    code = query_params.get("code")
    state = query_params.get("state")
    
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not provided")
    
    # Exchange code for token
    session = auth_service.exchange_amazon_code(code, session_id)
    if not session:
        raise HTTPException(status_code=500, detail="Failed to authenticate with Amazon")
    
    # Redirect to frontend
    redirect_url = "http://localhost:3000/meal-plans?amazon_connected=true"
    response = Response(status_code=302)
    response.headers["Location"] = redirect_url
    return response

@router.post("/amazon/callback")
async def amazon_callback_post(req: AmazonCallbackRequest, session_id: Optional[str] = Cookie(None)):
    """Handle Amazon OAuth callback - for server-to-server calls"""
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    # Exchange code for token
    session = auth_service.exchange_amazon_code(req.code, session_id)
    if not session:
        raise HTTPException(status_code=500, detail="Failed to authenticate with Amazon")
    
    return {"success": True, "message": "Amazon connected successfully"}

@router.post("/amazon/mock-auth")
async def amazon_mock_auth(session_id: Optional[str] = Cookie(None)):
    """Mock Amazon authentication (for demo purposes only)"""
    if not session_id:
        session = auth_service.create_session("demo_user")
        session_id = session.session_id
    
    session = auth_service.mock_amazon_auth(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Failed to authenticate with Amazon")
    
    response = {"success": True, "message": "Amazon connected successfully (mock)", "amazon_token": session.amazon_token}
    
    # Set session cookie
    response_obj = Response(content=json.dumps(response))
    response_obj.set_cookie(key="session_id", value=session_id, httponly=True, max_age=86400)
    
    return response_obj 
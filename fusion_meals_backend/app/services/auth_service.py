import os
import time
import secrets
import json
import requests
from typing import Dict, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class UserSession(BaseModel):
    user_id: str
    amazon_token: Optional[str] = None
    amazon_refresh_token: Optional[str] = None
    amazon_token_expires_at: Optional[int] = None
    instacart_token: Optional[str] = None
    session_id: str
    created_at: int
    expires_at: int

class AuthService:
    def __init__(self):
        # Amazon OAuth Configuration
        self.amazon_client_id = os.getenv("AMAZON_CLIENT_ID")
        self.amazon_client_secret = os.getenv("AMAZON_CLIENT_SECRET")
        self.amazon_redirect_uri = os.getenv("AMAZON_REDIRECT_URI")
        
        # Check if Amazon credentials are available
        self.has_amazon_credentials = all([
            self.amazon_client_id, 
            self.amazon_client_secret, 
            self.amazon_redirect_uri
        ])
        
        if not self.has_amazon_credentials:
            print("WARNING: Amazon OAuth credentials not found. Using mock authentication.")
        
        # In a real app, we would use a database to store user sessions
        # For this demo, we'll use an in-memory dictionary
        self.user_sessions: Dict[str, UserSession] = {}
        
        # Mock user for demo purposes
        self.create_session("demo_user")
    
    def create_session(self, user_id: str) -> UserSession:
        """Create a new user session"""
        session_id = secrets.token_urlsafe(32)
        now = int(time.time())
        expires = now + (24 * 60 * 60)  # 24 hours
        
        session = UserSession(
            user_id=user_id,
            session_id=session_id,
            created_at=now,
            expires_at=expires
        )
        
        self.user_sessions[session_id] = session
        return session
    
    def get_session(self, session_id: str) -> Optional[UserSession]:
        """Get a session by ID, if it exists and is valid"""
        session = self.user_sessions.get(session_id)
        if not session:
            return None
            
        now = int(time.time())
        if session.expires_at < now:
            # Session expired
            del self.user_sessions[session_id]
            return None
            
        return session
    
    def update_amazon_token(self, session_id: str, access_token: str, refresh_token: str, expires_in: int) -> Optional[UserSession]:
        """Update Amazon tokens for a user session"""
        session = self.get_session(session_id)
        if not session:
            return None
            
        now = int(time.time())
        session.amazon_token = access_token
        session.amazon_refresh_token = refresh_token
        session.amazon_token_expires_at = now + expires_in
        return session
    
    def generate_amazon_auth_url(self) -> str:
        """Generate an Amazon OAuth URL for user authorization"""
        if not self.has_amazon_credentials:
            return "https://www.amazon.com/ap/oa?mock=true"  # Mock URL
            
        # Amazon OAuth parameters
        params = {
            "client_id": self.amazon_client_id,
            "scope": "profile",
            "response_type": "code",
            "redirect_uri": self.amazon_redirect_uri,
            "state": secrets.token_urlsafe(16)  # State parameter for security
        }
        
        # Build the OAuth URL
        base_url = "https://www.amazon.com/ap/oa"
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    def exchange_amazon_code(self, code: str, session_id: str) -> Optional[UserSession]:
        """Exchange authorization code for tokens"""
        if not self.has_amazon_credentials:
            return self.mock_amazon_auth(session_id)
            
        # Exchange the code for access and refresh tokens
        token_url = "https://api.amazon.com/auth/o2/token"
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.amazon_redirect_uri,
            "client_id": self.amazon_client_id,
            "client_secret": self.amazon_client_secret
        }
        
        try:
            response = requests.post(token_url, data=payload)
            response.raise_for_status()
            
            token_data = response.json()
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            expires_in = token_data.get("expires_in", 3600)  # Default 1 hour
            
            if not access_token or not refresh_token:
                print("Warning: Failed to obtain Amazon tokens")
                return None
                
            # Update the session with the Amazon tokens
            return self.update_amazon_token(session_id, access_token, refresh_token, expires_in)
            
        except Exception as e:
            print(f"Error exchanging Amazon code: {str(e)}")
            return None
    
    def refresh_amazon_token(self, session_id: str) -> Optional[UserSession]:
        """Refresh the Amazon access token using the refresh token"""
        session = self.get_session(session_id)
        if not session or not session.amazon_refresh_token:
            return None
            
        if not self.has_amazon_credentials:
            # In mock mode, just extend the expiration
            now = int(time.time())
            session.amazon_token_expires_at = now + 3600  # 1 hour
            return session
            
        # Exchange the refresh token for a new access token
        token_url = "https://api.amazon.com/auth/o2/token"
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": session.amazon_refresh_token,
            "client_id": self.amazon_client_id,
            "client_secret": self.amazon_client_secret
        }
        
        try:
            response = requests.post(token_url, data=payload)
            response.raise_for_status()
            
            token_data = response.json()
            access_token = token_data.get("access_token")
            expires_in = token_data.get("expires_in", 3600)  # Default 1 hour
            
            if not access_token:
                print("Warning: Failed to refresh Amazon token")
                return None
                
            # Update the session with the new access token
            now = int(time.time())
            session.amazon_token = access_token
            session.amazon_token_expires_at = now + expires_in
            return session
            
        except Exception as e:
            print(f"Error refreshing Amazon token: {str(e)}")
            return None
    
    def mock_amazon_auth(self, session_id: str) -> Optional[UserSession]:
        """Mock Amazon authentication (for demo purposes)"""
        session = self.get_session(session_id)
        if not session:
            return None
            
        # Generate a mock token
        now = int(time.time())
        mock_token = f"amzn_{secrets.token_hex(16)}"
        mock_refresh_token = f"amzn_refresh_{secrets.token_hex(16)}"
        
        session.amazon_token = mock_token
        session.amazon_refresh_token = mock_refresh_token
        session.amazon_token_expires_at = now + 3600  # 1 hour
        return session
    
    def is_amazon_connected(self, session_id: str) -> bool:
        """Check if Amazon is connected for this user"""
        session = self.get_session(session_id)
        if not session:
            return False
            
        # Check if token exists and is not expired
        if not session.amazon_token:
            return False
            
        # Check if token is expired
        if session.amazon_token_expires_at:
            now = int(time.time())
            if session.amazon_token_expires_at < now:
                # Try to refresh the token
                refreshed = self.refresh_amazon_token(session_id)
                return refreshed is not None
                
        return True

# Initialize the auth service
auth_service = AuthService() 
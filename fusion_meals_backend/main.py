from app.main import app
import os

# This file allows Render to find the app using uvicorn main:app
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))  # Get port from environment variable or default to 8001
    print(f"Starting server on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 
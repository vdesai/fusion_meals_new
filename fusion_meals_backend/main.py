from app.main import app

# This file allows Render to find the app using uvicorn main:app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 
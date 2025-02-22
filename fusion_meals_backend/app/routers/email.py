from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()

router = APIRouter()

class EmailRequest(BaseModel):
    email: EmailStr
    content: str

@router.post("/send")
async def send_email(request: EmailRequest):
    try:
        message = Mail(
            from_email='desaivinit8@gmail.com',  # Replace with your verified sender email
            to_emails=request.email,
            subject='Fusion Meals: Your Requested Content',
            html_content=f"<p>{request.content}</p>"
        )

        # ✅ Initialize SendGrid client (No SSL bypass needed here now)
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)

        if response.status_code in [200, 202]:
            return {"message": f"✅ Email sent to {request.email} successfully!"}
        else:
            raise HTTPException(status_code=500, detail=f"Failed with status: {response.status_code}, Body: {response.body}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

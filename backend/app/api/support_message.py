from datetime import datetime
from fastapi import APIRouter, Request
from app.services.firebase.firebase_config import db
from app.utils.check_csrf import check_csrf_token
from app.utils.slowapi_set import limiter

router = APIRouter()

@router.post("/support-message")
@limiter.limit("5/minute")
async def support_message(request: Request):
    try:
        check_csrf_token(request)

        data = await request.json()
        name = data.get("name")
        contact = data.get("contact")
        message = data.get("message")

        if not all([name, contact, message]):
            return {"status": "error", "message": "Усі поля обовʼязкові"}

        db.collection("support_messages").add({
            "name": name,
            "contact": contact,
            "message": message,
            "timestamp": datetime.now().isoformat()
        })

        return {"status": "success", "message": "Повідомлення збережено"}
    except Exception as e:
        return {"status": "error", "message": f"Помилка: {str(e)}"}
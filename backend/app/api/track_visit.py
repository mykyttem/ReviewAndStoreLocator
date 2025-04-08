import hashlib
from fastapi import APIRouter, Request
from app.services.firebase.firebase_config import db
from datetime import datetime
from user_agents import parse

router = APIRouter()

@router.post("/track-visit")
async def track_visit(request: Request):
    try:
        user_agent = request.headers.get("User-Agent", "unknown")
        ua = parse(user_agent)
        current_date = datetime.now().strftime('%Y-%m-%d')

        unique_key = hashlib.md5(
            f"{ua.browser.family}-{ua.os.family}-{current_date}".encode('utf-8')
        ).hexdigest()

        existing_visit = db.collection('visits').document(unique_key).get()
        if existing_visit.exists:
            return {"status": "info", "message": "Visit already tracked today"}

        db.collection('visits').document(unique_key).set({
            "device_info": {
                "browser": ua.browser.family,
                "os": ua.os.family,
                "is_mobile": ua.is_mobile
            },
            "date": current_date,
            "timestamp": datetime.now().isoformat(),
            "unique_key": unique_key
        })

        return {"status": "success", "date": current_date}

    except Exception as e:
        return {"status": "error", "message": f"Invalid data format: {str(e)}"}
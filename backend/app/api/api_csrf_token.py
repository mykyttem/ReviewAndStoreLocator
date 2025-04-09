import os
from fastapi import APIRouter, Request
from ..csrf_token import csrf_protect
from dotenv import load_dotenv
from app.utils.slowapi_set import limiter

load_dotenv()
SECRET_KEY = os.getenv("CSRF_SECRET_KEY") 

router = APIRouter()

@router.get("/csrf-token")
@limiter.limit("5/minute")
async def get_csrf_token(request: Request):
    csrf_token = csrf_protect.generate_csrf_tokens(secret_key=SECRET_KEY)
    return {"csrf_token": csrf_token}
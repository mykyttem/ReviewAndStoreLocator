import os
from fastapi import APIRouter, Request
from ..csrf_token import csrf_protect
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("CSRF_SECRET_KEY") 

router = APIRouter()

@router.get("/csrf-token")
async def get_csrf_token(request: Request):
    csrf_token = csrf_protect.generate_csrf_tokens(secret_key=SECRET_KEY)
    return {"csrf_token": csrf_token}
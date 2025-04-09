from fastapi import Request, HTTPException
from ..csrf_token import csrf_protect

def check_csrf_token(request: Request):
    csrf_token = request.headers.get("X-CSRF-Token")
    if not csrf_token:
        raise HTTPException(status_code=400, detail="CSRF token is missing")
    
    csrf_protect.validate_csrf(csrf_token)
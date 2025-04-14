from fastapi import APIRouter, Request
from app.utils.slowapi_set import limiter
from fastapi.responses import Response

router = APIRouter()

@router.api_route("/ping", methods=["HEAD", "GET"])
@limiter.limit("10/minute")
async def ping_test(request: Request):
    return Response(status_code=200)
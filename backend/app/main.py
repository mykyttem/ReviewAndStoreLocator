from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.location import router as location_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(location_router)
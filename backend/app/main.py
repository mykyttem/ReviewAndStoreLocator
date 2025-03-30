from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

async def get_nearby_shops(latitude: float, longitude: float, radius: int = 500):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{latitude},{longitude}",
        "radius": radius,
        "type": "store|supermarket|shopping_mall",
        "key": GOOGLE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()

@app.post("/location")
async def receive_location(request: Request):
    data = await request.json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    
    if not latitude or not longitude:
        return {"status": "error", "message": "Missing coordinates"}
    
    shops_data = await get_nearby_shops(latitude, longitude)
    
    shops = []
    if shops_data.get("results"):
        for place in shops_data["results"]:
            shops.append({
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating"),
                "location": place.get("geometry", {}).get("location")
            })
    
    return {
        "status": "success",
        "user_location": {"latitude": latitude, "longitude": longitude},
        "nearby_shops": shops
    }
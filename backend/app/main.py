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

async def get_place_details(place_id: str):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "website,opening_hours,formatted_phone_number",
        "key": GOOGLE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()

async def get_nearby_shops(latitude: float, longitude: float, radius: int = 500):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{latitude},{longitude}",
        "radius": radius,
        "type": "store|supermarket|shopping_mall",
        "key": GOOGLE_API_KEY,
        "fields": "name,vicinity,rating,user_ratings_total,geometry,place_id"
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
            details = {}
            if "place_id" in place:
                details_response = await get_place_details(place["place_id"])
                details = details_response.get("result", {})
            
            shops.append({
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating"),
                "total_reviews": place.get("user_ratings_total", 0),
                "website": details.get("website"),
                "phone": details.get("formatted_phone_number"),
                "opening_hours": details.get("opening_hours", {}).get("weekday_text"),
                "location": place.get("geometry", {}).get("location")
            })
    
    return {
        "status": "success",
        "user_location": {"latitude": latitude, "longitude": longitude},
        "nearby_shops": shops
    }
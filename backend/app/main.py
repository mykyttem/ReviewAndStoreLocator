from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
cache = {}

async def get_place_details(place_id: str):
    if place_id in cache and cache[place_id]['expiry'] > datetime.now():
        return cache[place_id]['data']
    
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "website,opening_hours,formatted_phone_number",
        "key": GOOGLE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        
        cache[place_id] = {
            'data': data,
            'expiry': datetime.now() + timedelta(hours=1)
        }
        
        return data

async def get_nearby_shops(latitude: float, longitude: float, radius: int = 500):
    cache_key = f"{latitude},{longitude}"
    
    if cache_key in cache and cache[cache_key]['expiry'] > datetime.now():
        return cache[cache_key]['data']
    
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
        data = response.json()
        
        cache[cache_key] = {
            'data': data,
            'expiry': datetime.now() + timedelta(minutes=30)
        }
        
        return data

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
            rating = place.get("rating")
            total_reviews = place.get("user_ratings_total", 0)
            
            C = 3
            m = 3.5
            weighted_rating = 0
            
            if rating and total_reviews > 0:
                weighted_rating = (total_reviews * rating + C * m) / (total_reviews + C)
            
            shops.append({
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": rating,
                "total_reviews": total_reviews,
                "weighted_rating": weighted_rating,
                "website": place.get("website"),
                "location": place.get("geometry", {}).get("location")
            })
    
    shops.sort(key=lambda x: x.get("weighted_rating", 0), reverse=True)
    
    return {
        "status": "success",
        "user_location": {"latitude": latitude, "longitude": longitude},
        "nearby_shops": shops
    }
import httpx
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

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

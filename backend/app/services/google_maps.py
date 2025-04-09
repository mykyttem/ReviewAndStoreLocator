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
        
        if data.get("status") == "OK":
            cache[place_id] = {
                'data': data,
                'expiry': datetime.now() + timedelta(hours=1)
            }
        else:
            cache[place_id] = {
                'data': {},
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

        if data.get("status") == "OK":
            cache[cache_key] = {
                'data': data,
                'expiry': datetime.now() + timedelta(minutes=30)
            }
        else:
            cache[cache_key] = {
                'data': {},
                'expiry': datetime.now() + timedelta(minutes=30)
            }

        return data


async def get_shops_with_map_links(latitude: float, longitude: float):
    shops_data = await get_nearby_shops(latitude, longitude)
    shops = []
    
    if "results" in shops_data:
        for place in shops_data["results"]:
            place_id = place.get("place_id")
            if place_id:
                place_details = await get_place_details(place_id)
                location = place.get("geometry", {}).get("location", {})
                place_id = place.get("place_id")

                shops.append({
                    "name": place.get("name"),
                    "address": place.get("vicinity", "N/A"),
                    "rating": place.get("rating"),
                    "total_reviews": place.get("user_ratings_total", 0),
                    "place_id": place_id,
                    "location": location,
                    "opening_hours": place_details.get("result", {}).get("opening_hours", {}).get("weekday_text", []),
                    "phone_number": place_details.get("result", {}).get("formatted_phone_number", "N/A")
                })


    return shops


async def geocode_place_name(place_name: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": place_name,
        "key": GOOGLE_API_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        if data["status"] == "OK" and data["results"]:
            location = data["results"][0]["geometry"]["location"]
            return location
        else:
            return None
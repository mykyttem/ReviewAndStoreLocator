from fastapi import APIRouter, Request
from app.services.google_maps import get_nearby_shops

router = APIRouter()

@router.post("/location")
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

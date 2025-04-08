from fastapi import APIRouter, Request
from app.services.google_maps import get_nearby_shops, get_place_details

router = APIRouter()

@router.post("/location")
async def receive_location(request: Request):
    data = await request.json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    
    if not latitude or not longitude:
        return {"status": "error", "message": "Missing coordinates"}
    
    # Отримуємо дані про найближчі магазини
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
            
            place_id = place.get("place_id")
            if place_id:
                place_details = await get_place_details(place_id)
                
                phone_number = place_details.get("result", {}).get("formatted_phone_number", "N/A")
                opening_hours = place_details.get("result", {}).get("opening_hours", {}).get("weekday_text", [])

                shop_lat = place.get("geometry", {}).get("location", {}).get("lat")
                shop_lng = place.get("geometry", {}).get("location", {}).get("lng")
                place_id = place.get("place_id")

                map_url = None
                if place_id:
                    map_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
                elif shop_lat and shop_lng:
                    if isinstance(shop_lat, float) and isinstance(shop_lng, float):
                        map_url = f"https://www.google.com/maps?q={shop_lat},{shop_lng}"
                    else:
                        print("Invalid latitude or longitude values")


                shops.append({
                    "name": place.get("name"),
                    "address": place.get("vicinity"),
                    "rating": rating,
                    "total_reviews": total_reviews,
                    "weighted_rating": weighted_rating,
                    "map_url": map_url,
                    "location": place.get("geometry", {}).get("location"),
                    "phone_number": phone_number,
                    "opening_hours": opening_hours
                })
    
    shops.sort(key=lambda x: x.get("weighted_rating", 0), reverse=True)
    
    return {
        "status": "success",
        "user_location": {"latitude": latitude, "longitude": longitude},
        "nearby_shops": shops
    }

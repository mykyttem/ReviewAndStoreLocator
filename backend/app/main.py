from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/location")
async def receive_location(request: Request):
    # Get JSON data from the request
    data = await request.json()
    
    # Extract latitude and longitude
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    
    # Here you can process the data (save to database, etc.)
    print(f"Received location: Latitude {latitude}, Longitude {longitude}")
    
    return {
        "status": "success",
        "message": "Location received",
        "data": {
            "latitude": latitude,
            "longitude": longitude
        }
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.location import router as location_router
from app.api.track_visit import router as track_visit_router
from app.api.support_message import router as support_message_router
from app.api.search_by_place import router as search_by_place_router
from app.api.ping import router as ping_test_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hunters-store-locator.netlify.app", "http://localhost:3000", "uptimerobot.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(location_router, prefix="/api")
app.include_router(track_visit_router, prefix="/api")
app.include_router(support_message_router, prefix="/api")
app.include_router(search_by_place_router, prefix="/api")
app.include_router(ping_test_router, prefix="/api")
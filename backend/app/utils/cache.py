from datetime import datetime, timedelta
from typing import Optional, Dict

# Simple in-memory caching
cache: Dict[str, Dict] = {}

def get_from_cache(key: str) -> Optional[Dict]:
    if key in cache and cache[key]['expiry'] > datetime.now():
        return cache[key]['data']
    return None

def set_cache(key: str, data: Dict, expiry_duration: timedelta):
    cache[key] = {
        'data': data,
        'expiry': datetime.now() + expiry_duration
    }

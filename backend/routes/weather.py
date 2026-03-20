from fastapi import APIRouter, Query
from dotenv import load_dotenv
import os
import httpx

load_dotenv()

router = APIRouter()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

@router.get("/")
async def get_weather(city: str = Query(..., description="City name")):
    if not WEATHER_API_KEY:
        return {"error": "WEATHER_API_KEY not set"}
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code == 200:
            return resp.json()
        return {"error": "City not found or API error", "status": resp.status_code}

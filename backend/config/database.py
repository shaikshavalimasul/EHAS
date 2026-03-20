import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load .env from project root (one level above backend/)
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")

client = AsyncIOMotorClient(MONGODB_URI)
db = client.examhall

students_collection = db["students"]
exam_configs_collection = db["exam_configs"]
seating_allocations_collection = db["seating_allocations"]

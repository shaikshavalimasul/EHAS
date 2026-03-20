import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load .env locally if present, on Render env vars are set directly
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = AsyncIOMotorClient(MONGODB_URI)
db = client.examhall

students_collection = db["students"]
exam_configs_collection = db["exam_configs"]
seating_allocations_collection = db["seating_allocations"]

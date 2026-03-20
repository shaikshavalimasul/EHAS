from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from config.database import exam_configs_collection

router = APIRouter()

class ExamConfigCreate(BaseModel):
    exam_type: str
    num_rooms: int
    benches_per_room: int
    seating_type: str
    damaged_benches: List[List[int]] = []

@router.post("/", status_code=201)
async def create_exam_config(config: ExamConfigCreate):
    result = await exam_configs_collection.insert_one(config.model_dump())
    return {"id": str(result.inserted_id)}

@router.get("/")
async def get_configs():
    docs = await exam_configs_collection.find().to_list(length=None)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

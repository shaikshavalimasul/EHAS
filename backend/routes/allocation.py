from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from config.database import students_collection, seating_allocations_collection
from models.student import StudentOut
from services.seating_algorithm import allocate_seating

router = APIRouter()

class AllocateRequest(BaseModel):
    num_rooms: int = 2
    benches_per_room: int = 5
    seating_type: str = "double"
    damaged_benches: List[List[int]] = []

@router.post("/")
async def allocate(req: AllocateRequest):
    docs = await students_collection.find().to_list(length=None)
    student_list = []
    for doc in docs:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        student_list.append(StudentOut(**doc))

    config = {
        "hall_config": {
            "num_rooms": req.num_rooms,
            "benches_per_room": req.benches_per_room,
            "seating_type": req.seating_type,
            "damaged_benches": req.damaged_benches,
        }
    }

    result = allocate_seating(student_list, config)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    await seating_allocations_collection.insert_one({
        "layout": result["layout"],
        "placed": result["placed"],
        "total_present": result["total_present"],
    })
    return result

@router.get("/")
async def get_seating():
    latest = await seating_allocations_collection.find_one(sort=[("_id", -1)])
    if not latest:
        raise HTTPException(status_code=404, detail="No allocation yet")
    latest["_id"] = str(latest["_id"])
    return latest

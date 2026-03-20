from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config.database import students_collection
from models.student import StudentOut
from typing import List

router = APIRouter()

class BulkStudentEntry(BaseModel):
    name: str
    branch: str
    subject: str
    exam_type: str = "semester"
    attendance_status: str = "present"

class BulkStudentRequest(BaseModel):
    students: List[BulkStudentEntry]
    roll_prefix: str = "ROLL"
    start_number: int = 1

@router.post("/bulk", response_model=dict)
async def create_students_bulk(req: BulkStudentRequest):
    if not req.students:
        raise HTTPException(status_code=400, detail="No students provided")
    docs = []
    for i, s in enumerate(req.students):
        roll = f"{req.roll_prefix}{str(req.start_number + i).zfill(3)}"
        docs.append({
            "name": s.name,
            "roll_number": roll,
            "branch": s.branch,
            "subject": s.subject,
            "exam_type": s.exam_type,
            "attendance_status": s.attendance_status,
        })
    await students_collection.insert_many(docs)
    return {"inserted": len(docs), "roll_numbers": [d["roll_number"] for d in docs]}

@router.get("/", response_model=List[StudentOut])
async def get_students():
    docs = await students_collection.find().to_list(length=None)
    students = []
    for doc in docs:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        students.append(StudentOut(**doc))
    return students

@router.delete("/{roll_number}")
async def delete_student(roll_number: str):
    result = await students_collection.delete_one({"roll_number": roll_number})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"deleted": True}

@router.delete("/")
async def delete_all_students():
    result = await students_collection.delete_many({})
    return {"deleted": result.deleted_count}

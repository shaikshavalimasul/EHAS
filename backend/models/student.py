from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from enum import Enum

class ExamType(str, Enum):
    SEMESTER = "semester"
    MID = "mid"
    GROUP_DISCUSSION = "group_discussion"
    LAB = "lab"

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"

class Student(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str
    roll_number: str
    branch: str
    subject: str
    exam_type: ExamType
    attendance_status: AttendanceStatus = AttendanceStatus.PRESENT

class StudentCreate(Student):
    pass

class StudentOut(Student):
    id: Optional[str] = None

class HallConfig(BaseModel):
    num_rooms: int
    benches_per_room: int
    seating_type: str
    damaged_benches: List[List[int]] = []

class ExamConfig(BaseModel):
    exam_type: ExamType
    hall_config: HallConfig

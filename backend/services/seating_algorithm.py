import random
from typing import List, Optional, Tuple
from models.student import StudentOut, AttendanceStatus


def create_empty_grid(num_rooms, num_rows, seats_per_row):
    return [[[None] * seats_per_row for _ in range(num_rows)] for _ in range(num_rooms)]


def mark_damaged(grid, damaged_benches, seats_per_row):
    for dmg in damaged_benches:
        if len(dmg) < 3:
            continue
        room, row, seat = dmg[0], dmg[1], dmg[2]
        if 0 <= room < len(grid) and 0 <= row < len(grid[0]) and 0 <= seat < seats_per_row:
            grid[room][row][seat] = "DAMAGED"


def is_valid(grid, room, row, seat, branch, subject, info, seats_per_row):
    num_rows = len(grid[room])
    for dr, ds in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, ns = row + dr, seat + ds
        if 0 <= nr < num_rows and 0 <= ns < seats_per_row:
            neighbor = grid[room][nr][ns]
            if neighbor and neighbor != "DAMAGED":
                nb = info.get(neighbor, {})
                if nb.get("branch") == branch or nb.get("subject") == subject:
                    return False
    return True


def place_student(grid, roll, branch, subject, info, num_rows, seats_per_row):
    for r in range(len(grid)):
        for i in range(num_rows):
            for j in range(seats_per_row):
                if grid[r][i][j] is None and is_valid(grid, r, i, j, branch, subject, info, seats_per_row):
                    grid[r][i][j] = roll
                    return (r, i, j)
    return None


def allocate_seating(students: List[StudentOut], config: dict) -> dict:
    hc = config["hall_config"]
    num_rooms = hc["num_rooms"]
    num_rows = hc["benches_per_room"]
    seats_per_row = 2 if hc["seating_type"] == "double" else 1

    present = [s for s in students if s.attendance_status == AttendanceStatus.PRESENT]
    if not present:
        return {"layout": [], "placed": 0, "total_present": 0}

    random.shuffle(present)
    grid = create_empty_grid(num_rooms, num_rows, seats_per_row)
    mark_damaged(grid, hc["damaged_benches"], seats_per_row)
    info = {s.roll_number: {"branch": s.branch, "subject": s.subject} for s in present}

    placed = 0
    for s in present:
        if place_student(grid, s.roll_number, s.branch, s.subject, info, num_rows, seats_per_row) is None:
            return {"error": "Not enough seats or too many conflicts. Add more rooms or benches."}
        placed += 1

    return {"layout": grid, "placed": placed, "total_present": len(present)}

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import students, allocation, config, weather

app = FastAPI(title="Exam Hall Allocation System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router, prefix="/students", tags=["students"])
app.include_router(allocation.router, prefix="/allocate", tags=["allocation"])
app.include_router(config.router, prefix="/exam-config", tags=["config"])
app.include_router(weather.router, prefix="/weather", tags=["weather"])

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

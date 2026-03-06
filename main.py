from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from workout_routes import workout_router

app = FastAPI(title="Workout Planner App", version="1.0.0")


@app.get("/")
async def home():
    return FileResponse("./frontend/index.html")


app.include_router(workout_router, tags=["Workouts"], prefix="/workouts")

app.mount("/", StaticFiles(directory="frontend"), name="static")
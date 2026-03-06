from pydantic import BaseModel


class Workout(BaseModel):
    id: int
    day: str          
    title: str       
    notes: str       


class WorkoutRequest(BaseModel):
    day: str
    title: str
    notes: str
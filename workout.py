from pydantic import BaseModel


class Workout(BaseModel):
    id: int
    day: str
    title: str
    desc: str


class WorkoutRequest(BaseModel):
    day: str
    title: str
    desc: str
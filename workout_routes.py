from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, status

from workout import Workout, WorkoutRequest


workout_router = APIRouter()

workout_list: list[Workout] = []
global_id = 0


@workout_router.get("")
async def get_all_workouts() -> list[Workout]:
    return workout_list


@workout_router.get("/day/{day}")
async def get_workouts_by_day(day: str) -> list[Workout]:
    return [w for w in workout_list if w.day.lower().strip() == day.lower().strip()]


@workout_router.get("/{id}")
async def get_workout_by_id(id: Annotated[int, Path(gt=0, le=100000)]) -> Workout:
    for w in workout_list:
        if w.id == id:
            return w
    raise HTTPException(status_code=404, detail=f"Workout with ID={id} is not found.")


@workout_router.post("")
async def create_new_workout(workout: WorkoutRequest) -> Workout:
    global global_id
    global_id += 1

    new_workout = Workout(
        id=global_id,
        day=workout.day.strip(),
        title=workout.title.strip(),
        notes=workout.notes.strip(),
    )
    workout_list.append(new_workout)
    return new_workout


@workout_router.put("/{id}")
async def update_workout_by_id(
    id: Annotated[int, Path(gt=0, le=100000)],
    workout: WorkoutRequest,
) -> Workout:
    for i in range(len(workout_list)):
        if workout_list[i].id == id:
            updated = Workout(
                id=id,
                day=workout.day.strip(),
                title=workout.title.strip(),
                notes=workout.notes.strip(),
            )
            workout_list[i] = updated
            return updated

    raise HTTPException(status_code=404, detail=f"Workout with ID={id} is not found.")


@workout_router.delete("/{id}")
async def delete_workout_by_id(
    id: Annotated[
        int,
        Path(gt=0, le=100000, title="ID of the workout to delete"),
    ],
) -> dict:
    for i in range(len(workout_list)):
        if workout_list[i].id == id:
            workout_list.pop(i)
            return {"msg": f"Workout with ID={id} is deleted."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Workout with ID={id} is not found.",
    )
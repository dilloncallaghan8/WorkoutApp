from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, status

from workout import Workout, WorkoutRequest


workout_router = APIRouter()

workout_list = []
global_id = 0


@workout_router.get("")
async def get_all_workouts() -> list[Workout]:
    return workout_list


@workout_router.post("", status_code=201)
async def create_new_workout(workout: WorkoutRequest) -> Workout:
    global global_id
    global_id += 1

    new_workout = Workout(
        id=global_id,
        day=workout.day,
        title=workout.title,
        desc=workout.desc,
    )
    workout_list.append(new_workout)
    return new_workout


@workout_router.put("/{id}")
async def edit_workout_by_id(
    id: Annotated[int, Path(gt=0, le=1000)], workout: WorkoutRequest
) -> Workout:
    for x in workout_list:
        if x.id == id:
            x.day = workout.day
            x.title = workout.title
            x.desc = workout.desc
            return x

    raise HTTPException(
        status_code=404, detail=f"Workout with ID={id} is not found."
    )


@workout_router.get("/{id}")
async def get_workout_by_id(id: Annotated[int, Path(gt=0, le=1000)]) -> Workout:
    for workout in workout_list:
        if workout.id == id:
            return workout

    raise HTTPException(
        status_code=404, detail=f"Workout with ID={id} is not found."
    )


@workout_router.delete("/{id}")
async def delete_workout_by_id(
    id: Annotated[
        int,
        Path(
            gt=0,
            le=1000,
            title="This is the ID for the desired Workout Item to be deleted",
        ),
    ],
) -> dict:
    for i in range(len(workout_list)):
        workout = workout_list[i]
        if workout.id == id:
            workout_list.pop(i)
            return {"msg": f"The workout with ID={id} is deleted."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Workout with ID={id} is not found.",
    )
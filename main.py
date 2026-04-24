from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from beanie import Document, Indexed, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from workout_routes import workout_router

app = FastAPI(title="Workout Planner App", version="1.0.0")

MONGODB_URL = "mongodb+srv://dilloncallaghan_db_user:password123456789@authentication.hsmtp2p.mongodb.net/workout_app?appName=Authentication"


class User(Document):
    username: Indexed(str)
    email: Indexed(str)
    password: str

    class Settings:
        name = "users"


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


@app.on_event("startup")
async def start_database():
    # Motor creates the async connection to MongoDB.
    client = AsyncIOMotorClient(MONGODB_URL)

    # The database name comes from the MongoDB URL above.
    database = client.get_default_database()

    # Beanie connects the User document model to the MongoDB collection.
    await init_beanie(database=database, document_models=[User])


@app.get("/")
async def home():
    return FileResponse("./frontend/index.html")


@app.post("/register")
async def register_user(user_info: RegisterRequest):
    existing_username = await User.find_one(User.username == user_info.username)
    if existing_username:
        return {"message": "Username already exists"}

    existing_email = await User.find_one(User.email == user_info.email)
    if existing_email:
        return {"message": "Email already exists"}

    user = User(
        username=user_info.username,
        email=user_info.email,
        password=user_info.password,
    )
    await user.create()

    return {"message": "User registered successfully"}


@app.post("/login")
async def login_user(login_info: LoginRequest):
    user = await User.find_one(User.username == login_info.username)

    if user and user.password == login_info.password:
        return {"message": "Login successful"}

    return {"message": "Login failed"}


app.include_router(workout_router, tags=["Workouts"], prefix="/workouts")

# the router needs to be before the mount.
# otherwise, the routes cannot be found.
app.mount("/", StaticFiles(directory="frontend"), name="static")

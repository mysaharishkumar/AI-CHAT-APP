from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncIOMotorClient(
    os.getenv("MONGODB_URI"),
    serverSelectionTimeoutMS=8000,
    connectTimeoutMS=8000
)

db = client[os.getenv("DATABASE_NAME")]

messages = db["messages"]
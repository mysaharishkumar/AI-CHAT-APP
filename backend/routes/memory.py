from fastapi import APIRouter

from models.memory import MemoryCreate
from services.memory_service import (
    save_memory,
    get_memories
)

router = APIRouter(
    prefix="/memory",
    tags=["Memory"]
)


@router.post("/save")
async def create_memory(
    data: MemoryCreate
):

    await save_memory(
        data.user_id,
        data.key,
        data.value
    )

    return {
        "message": "Memory Saved"
    }


@router.get("/{user_id}")
async def fetch_memory(
    user_id: str
):
    return await get_memories(
        user_id
    )
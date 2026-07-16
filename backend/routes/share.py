from fastapi import APIRouter, HTTPException
from bson import ObjectId

from database.threads import threads
from database.messages import messages

router = APIRouter(
    prefix="/share",
    tags=["Share"]
)


@router.get("/{thread_id}")
async def get_shared_chat(
    thread_id: str
):

    try:
        thread = await threads.find_one(
            {"_id": ObjectId(thread_id)}
        )
    except Exception:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    if not thread:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    result = []

    async for message in messages.find(
        {"thread_id": thread_id}
    ):
        result.append({
            "user_message": message["user_message"],
            "ai_response": message["ai_response"]
        })

    return {
        "title": thread.get("title", "Shared Chat"),
        "messages": result
    }

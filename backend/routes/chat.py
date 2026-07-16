from fastapi import APIRouter, HTTPException
from models.message import ChatRequest

from services.gemini_service import ask_gemini
from services.memory_service import (
    get_memories,
    save_memory
)

from database.messages import messages
from database.threads import threads

router = APIRouter()


@router.post("/chat")
async def chat(req: ChatRequest):

    # A guest (logged-out) request has no user_id/thread_id.
    # We still answer via Gemini, just skip every DB write.
    is_guest = not req.user_id or not req.thread_id

    if not is_guest:

        message_lower = req.message.lower()

        # Save Name Memory

        if "my name is" in message_lower:

            name = (
                req.message.lower()
                .split("my name is")[-1]
                .strip()
                .title()
            )

            try:
                await save_memory(
                    req.user_id,
                    "name",
                    name
                )
            except Exception as e:
                print(f"[chat] save_memory failed: {e}")

        # Get Memories

        try:
            memories = await get_memories(
                req.user_id
            )
        except Exception as e:
            print(f"[chat] get_memories failed: {e}")
            memories = None

    else:

        memories = None

    # Gemini Response

    try:
        ai_response = await ask_gemini(
            req.message,
            memories
        )
    except Exception as e:
        print(f"[chat] Gemini call failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI response failed: {e}"
        )

    if is_guest:

        return {
            "reply": ai_response
        }

    # Save Message

    await messages.insert_one({
        "user_id": req.user_id,
        "thread_id": req.thread_id,
        "user_message": req.message,
        "ai_response": ai_response
    })

    # Auto Update Thread Title
    # Only for first message

    count = await messages.count_documents({
        "thread_id": req.thread_id
    })

    if count == 1:

        title = (
            req.message[:40]
            if len(req.message) > 40
            else req.message
        )

        await threads.update_one(
    {
        "_id": __import__("bson").ObjectId(
            req.thread_id
        )
    },
    {
        "$set": {
            "title": title,
            "empty": False
        }
    }
)

    return {
        "reply": ai_response
    }


@router.get(
    "/chat/history/{user_id}/{thread_id}"
)
async def chat_history(
    user_id: str,
    thread_id: str
):

    result = []

    async for message in messages.find({
        "user_id": user_id,
        "thread_id": thread_id
    }):

        result.append({
            "user_message":
            message["user_message"],

            "ai_response":
            message["ai_response"]
        })

    return result
from fastapi import APIRouter
from bson import ObjectId

from models.thread import ThreadCreate
from database.threads import threads
from database.messages import messages

router = APIRouter(
    tags=["Threads"]
)


@router.post("/thread/create")
async def create_thread(
    data: ThreadCreate
):

    thread = {
        "user_id": data.user_id,
        "title": "New Chat"
    }

    result = await threads.insert_one(
        thread
    )

    return {
        "id": str(
            result.inserted_id
        ),
        "title": "New Chat",
        "empty": True
    }


@router.get("/threads/{user_id}")
async def get_threads(
    user_id: str
):

    all_threads = []

    async for thread in threads.find(
        {
            "user_id": user_id
        }
    ):

        thread_id = str(
            thread["_id"]
        )

        message_count = await messages.count_documents(
            {"thread_id": thread_id}
        )

        all_threads.append(
            {
                "id": thread_id,
                "title": thread.get(
                    "title",
                    "New Chat"
                ),
                "empty": message_count == 0
            }
        )

    return all_threads


@router.put("/thread/{thread_id}")
async def update_thread(
    thread_id: str,
    data: dict
):

    await threads.update_one(
        {
            "_id": ObjectId(
                thread_id
            )
        },
        {
            "$set": {
                "title": data["title"]
            }
        }
    )

    return {
        "message": "Thread Updated"
    }


@router.delete(
    "/thread/{thread_id}"
)
async def delete_thread(
    thread_id: str
):

    await threads.delete_one(
        {
            "_id": ObjectId(
                thread_id
            )
        }
    )

    return {
        "message":
        "Thread Deleted"
    }

async def create_empty_thread(
    data: ThreadCreate
):
    thread = {
        "user_id": data.user_id,
        "title": "New Chat",
        "empty": True
    }

    result = await threads.insert_one(
        thread
    )

    return {
        "id": str(
            result.inserted_id
        ),
        "title": "New Chat"
    }
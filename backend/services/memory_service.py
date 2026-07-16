from database.memories import memories


async def save_memory(
    user_id: str,
    key: str,
    value: str
):

    await memories.update_one(
        {
            "user_id": user_id,
            "key": key
        },
        {
            "$set": {
                "value": value
            }
        },
        upsert=True
    )


async def get_memories(
    user_id: str
):

    result = {}

    async for memory in memories.find({
        "user_id": user_id
    }):

        result[memory["key"]] = memory["value"]

    return result
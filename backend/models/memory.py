from pydantic import BaseModel

class MemoryCreate(BaseModel):
    user_id: str
    key: str
    value: str
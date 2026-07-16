from pydantic import BaseModel
from typing import Optional


class ThreadCreate(BaseModel):
    user_id: str


class Thread(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
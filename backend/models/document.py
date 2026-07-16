from pydantic import BaseModel

class DocumentQuery(BaseModel):
    user_id: str
    question: str
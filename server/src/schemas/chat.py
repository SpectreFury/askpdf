import datetime

from pydantic import BaseModel

class AskQuestionData(BaseModel):
    question: str
    citations_only: bool = False

class Citation(BaseModel):
    page: int
    paragraph: int | None = None

class AnswerResponse(BaseModel):
    answer: str
    citations: list[Citation]

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    citations: list[Citation]
    created_at: datetime.datetime

class ClearMessagesResponse(BaseModel):
    message: str

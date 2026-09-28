import datetime

from pydantic import BaseModel

class AskQuestionData(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime.datetime

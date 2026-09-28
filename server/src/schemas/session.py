import datetime

from pydantic import BaseModel

class CreateSessionData(BaseModel):
    public_id: str
    filename: str | None = None

class CreateSessionResponse(BaseModel):
    session_id: str

class SessionResponse(BaseModel):
    session_id: str
    title: str
    document_id: str
    document_url: str

class SessionListItem(BaseModel):
    session_id: str
    title: str
    page_count: int | None = None
    created_at: datetime.datetime

from pydantic import BaseModel

class CreateSessionData(BaseModel):
    secure_url: str

class CreateSessionResponse(BaseModel):
    session_id: str

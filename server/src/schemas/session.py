from pydantic import BaseModel

class CreateSessionData(BaseModel):
    public_id: str

class CreateSessionResponse(BaseModel):
    session_id: str

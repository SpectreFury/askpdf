from pydantic import BaseModel

class PresignedURLResponse(BaseModel):
    url: str

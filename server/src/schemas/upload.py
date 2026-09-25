from pydantic import BaseModel


class PresignedURLResponse(BaseModel):
    signature: str
    timestamp: int
    folder: str
    api_key: str
    cloud_name: str

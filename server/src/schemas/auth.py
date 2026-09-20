from uuid import UUID

from pydantic import BaseModel


class LoginData(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    id: UUID
    access_token: str
    refresh_token: str

class SignUpData(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class SignUpResponse(BaseModel):
    id: UUID
    access_token: str
    refresh_token: str

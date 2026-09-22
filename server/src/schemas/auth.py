from uuid import UUID

from pydantic import BaseModel

class RefreshResponse(BaseModel):
    access_token: str

class UserResponse(BaseModel):
    id: UUID
    email: str
    first_name: str
    last_name: str

class LoginData(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    id: UUID
    access_token: str
    first_name: str
    last_name: str


class SignUpData(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class SignUpResponse(BaseModel):
    id: UUID
    access_token: str
    first_name: str
    last_name: str

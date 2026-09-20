from pydantic import BaseModel


class LoginData(BaseModel):
    email: str
    password: str


class SignUpData(BaseModel):
    name: str
    email: str
    password: str

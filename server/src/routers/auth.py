from fastapi import APIRouter
from ..types.auth import LoginData, SignUpData

router = APIRouter()


@router.post("/login")
async def login(login_data: LoginData):
    return login_data


@router.post("/signup")
async def signup(signup_data: LoginData):
    return {"ok": "ok"}

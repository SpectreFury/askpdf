import os
from typing import Annotated
from fastapi import APIRouter, Depends, Response, status, Header
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.auth_models import User
from src.dependencies.security import get_current_user, get_user_from_refresh_token
from src.schemas.api import APIResponse
from src.utils.jwt import encode_jwt
from ..services.auth_service import AuthService

from src.db.db import get_async_session
from ..schemas.auth import (
    LoginData,
    LoginResponse,
    SignUpData,
    SignUpResponse,
    UserResponse,
)

secure = os.getenv("ENV") == "production"

router = APIRouter()


@router.get(
    "/me", response_model=APIResponse[UserResponse], status_code=status.HTTP_200_OK
)
async def get_user_me(
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    user = await session.get_one(User, user_id)

    return APIResponse(success=True, data=user, error=None)


@router.post("/refresh")
async def refresh_token(refresh_token=Depends(get_user_from_refresh_token)):
    return {"refresh_token": refresh_token}


@router.post(
    "/login", response_model=APIResponse[LoginResponse], status_code=status.HTTP_200_OK
)
async def login(
    login_data: LoginData,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    service = AuthService(session)

    data = await service.login_user(login_data)

    refresh_token = encode_jwt(str(data.id), data.first_name, data.last_name, True)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=secure,  # True for prod
        samesite="lax",
    )

    return APIResponse(success=True, data=data, error="")


@router.post(
    "/signup",
    response_model=APIResponse[SignUpResponse],
)
async def signup(
    signup_data: SignUpData,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    service = AuthService(session)

    data = await service.register_user(signup_data)

    refresh_token = encode_jwt(str(data.id), data.first_name, data.last_name, True)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=secure,  # True for prod
        samesite="lax",
    )

    return APIResponse(success=True, data=data, error=None)

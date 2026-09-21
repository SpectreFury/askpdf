import os
from fastapi import APIRouter, Depends, Response, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.auth_models import User
from src.exceptions import NoBearerTokenException
from src.schemas.api import APIResponse
from src.utils.jwt import decode_jwt, encode_jwt
from ..services.auth_service import AuthService

from src.db.db import get_async_session
from ..schemas.auth import (
    LoginData,
    LoginResponse,
    SignUpData,
    SignUpResponse,
    UserResponse,
)

security = HTTPBearer()
secure = os.getenv("ENV") == "production"

router = APIRouter()


@router.get(
    "/me", response_model=APIResponse[UserResponse], status_code=status.HTTP_200_OK
)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_async_session),
):
    token = credentials.credentials
    data = decode_jwt(token)

    user = await session.get_one(User, data["sub"])

    return APIResponse(success=True, data=user, error=None)


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

    response.set_cookie("refresh_token", refresh_token)
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

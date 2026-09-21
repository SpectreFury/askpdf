from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas.api import APIResponse
from src.utils.jwt import encode_jwt
from ..services.auth_service import AuthService

from src.db.db import get_async_session
from ..schemas.auth import LoginData, LoginResponse, SignUpData, SignUpResponse

router = APIRouter()


@router.post(
    "/login", response_model=APIResponse[LoginResponse], status_code=status.HTTP_200_OK
)
async def login(
    login_data: LoginData, session: AsyncSession = Depends(get_async_session)
):
    service = AuthService(session)

    data = await service.login_user(login_data)
    return APIResponse(success=True, data=data, error="")


@router.post(
    "/signup",
    response_model=APIResponse[SignUpResponse],
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    response: Response,
    signup_data: SignUpData,
    session: AsyncSession = Depends(get_async_session),
):
    service = AuthService(session)

    data = await service.register_user(signup_data)

    refresh_token = encode_jwt(str(data.id), data.first_name, data.last_name, True)

    # Add httmonly, secure and samesite = lax
    response.set_cookie(key="refresh_token", value=refresh_token)
    return APIResponse(success=True, data=data, error=None)

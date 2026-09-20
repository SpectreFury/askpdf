from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas.api import APIResponse
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
    signup_data: SignUpData, session: AsyncSession = Depends(get_async_session)
):
    service = AuthService(session)

    data = await service.register_user(signup_data)
    return APIResponse(success=True, data=data, error=None)

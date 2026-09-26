from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.db import get_async_session
from src.db.models.auth_models import Session
from src.dependencies.security import get_current_user
from src.exceptions import NoDocumentURLException
from src.schemas.api import APIResponse
from src.schemas.session import CreateSessionData, CreateSessionResponse

router = APIRouter()


@router.post(
    "/",
    response_model=APIResponse[CreateSessionResponse],
    status_code=status.HTTP_200_OK,
)
async def create_session(
    body: CreateSessionData,
    session: AsyncSession = Depends(get_async_session),
    user_id: str = Depends(get_current_user),
):
    if not body.secure_url:
        raise NoDocumentURLException()

    new_item = Session(
        title="New Session",
        document_id=body.secure_url,
        user_id=user_id
    )

    session.add(new_item)

    await session.commit()
    await session.refresh(new_item)

    data = CreateSessionResponse(session_id=str(new_item.id))
    return APIResponse(success=True, data=data, error=None)

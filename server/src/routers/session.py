import asyncio
from pathlib import Path
from uuid import UUID

from chromadb.errors import NotFoundError
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.db import get_async_session
from src.db.models.auth_models import Session
from src.dependencies.security import get_current_user
from src.exceptions import (
    DocumentNotReadyException,
    NoDocumentURLException,
    SessionNotFoundException,
)
from src.schemas.api import APIResponse
from src.schemas.chat import (
    AnswerResponse,
    AskQuestionData,
    MessageResponse,
)
from src.schemas.session import (
    CreateSessionData,
    CreateSessionResponse,
    SessionListItem,
    SessionResponse,
)
from src.services.chat_service import ChatService
from ..rag_pipeline.answer import NO_CONTEXT_ANSWER, generate_answer
from ..rag_pipeline.retrieval import retrieve_blocks
from ..utils.celery_app import rag_pipeline
from ..utils.cloudinary import secure_download_url


router = APIRouter()

FALLBACK_TITLE = "New Session"


def title_from_filename(filename: str | None) -> str:
    """Provisional name shown until the worker replaces it with an AI title."""
    if not filename:
        return FALLBACK_TITLE

    return Path(filename).stem.strip()[:80] or FALLBACK_TITLE


async def require_owned_session(
    session: AsyncSession, session_id: UUID, user_id: str
) -> Session:
    """404 unless the session exists and belongs to the caller."""
    result = await session.execute(
        select(Session).where(
            Session.id == session_id, Session.user_id == UUID(user_id)
        )
    )

    item = result.scalar_one_or_none()

    if not item:
        raise SessionNotFoundException()

    return item


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
    if not body.public_id:
        raise NoDocumentURLException()


    new_item = Session(
        title=title_from_filename(body.filename),
        document_id=body.public_id,
        user_id=user_id
    )

    session.add(new_item)

    await session.commit()
    await session.refresh(new_item)

    # We have secure_url so it means we need to send request to injest the PDF

    rag_pipeline.delay(body.public_id, str(new_item.id))

    data = CreateSessionResponse(session_id=str(new_item.id))
    return APIResponse(success=True, data=data, error=None)


@router.get(
    "/",
    response_model=APIResponse[list[SessionListItem]],
    status_code=status.HTTP_200_OK,
)
async def list_sessions(
    session: AsyncSession = Depends(get_async_session),
    user_id: str = Depends(get_current_user),
):
    result = await session.execute(
        select(Session)
        .where(Session.user_id == UUID(user_id))
        .order_by(Session.created_at.desc())
    )

    items = [
        SessionListItem(
            session_id=str(item.id),
            title=item.title,
            page_count=item.page_count,
            created_at=item.created_at,
        )
        for item in result.scalars().all()
    ]

    return APIResponse(success=True, data=items, error=None)


@router.get(
    "/{session_id}",
    response_model=APIResponse[SessionResponse],
    status_code=status.HTTP_200_OK,
)
async def get_session(
    session_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    user_id: str = Depends(get_current_user),
):
    item = await require_owned_session(session, session_id, user_id)

    if not item.document_id:
        raise NoDocumentURLException()

    data = SessionResponse(
        session_id=str(item.id),
        title=item.title,
        document_id=item.document_id,
        document_url=secure_download_url(item.document_id, expires_in=3600),
    )

    return APIResponse(success=True, data=data, error=None)


@router.post(
    "/{session_id}/ask",
    response_model=APIResponse[AnswerResponse],
    status_code=status.HTTP_200_OK,
)
async def ask_question(
    session_id: UUID,
    body: AskQuestionData,
    session: AsyncSession = Depends(get_async_session),
    user_id: str = Depends(get_current_user),
):
    await require_owned_session(session, session_id, user_id)

    service = ChatService(session)

    try:
        # Chroma and the model are both blocking, so they stay off the event loop.
        # Each question is answered statelessly: no conversation history is
        # loaded or fed into retrieval or generation. Past turns are only
        # stored (see save_exchange below) and rendered by the frontend.
        blocks = await asyncio.to_thread(
            retrieve_blocks,
            str(session_id),
            body.question,
        )
    except NotFoundError:
        raise DocumentNotReadyException()

    if not blocks:
        answer = NO_CONTEXT_ANSWER
    else:
        answer = await asyncio.to_thread(generate_answer, body.question, blocks)

        if not answer.strip():
            answer = NO_CONTEXT_ANSWER

    await service.save_exchange(session_id, body.question, answer)

    data = AnswerResponse(answer=answer)

    return APIResponse(success=True, data=data, error=None)


@router.get(
    "/{session_id}/messages",
    response_model=APIResponse[list[MessageResponse]],
    status_code=status.HTTP_200_OK,
)
async def list_messages(
    session_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    user_id: str = Depends(get_current_user),
):
    await require_owned_session(session, session_id, user_id)

    items = await ChatService(session).list_messages(session_id)

    data = [
        MessageResponse(
            id=str(message.id),
            role=message.role,
            content=message.content,
            created_at=message.created_at,
        )
        for message in items
    ]

    return APIResponse(success=True, data=data, error=None)


@router.get(
    "/{session_id}/suggestions",
    response_model=APIResponse[list[str]],
    status_code=status.HTTP_200_OK,
)
async def list_suggestions(
    session_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    user_id: str = Depends(get_current_user),
):
    item = await require_owned_session(session, session_id, user_id)

    return APIResponse(success=True, data=item.suggested_questions or [], error=None)

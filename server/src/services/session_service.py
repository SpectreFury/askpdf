import asyncio
from uuid import UUID

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from src.db.db import DATABASE_URL
from src.db.models.auth_models import Session


def update_document_info(
    session_id: str, page_count: int, title: str | None = None
) -> None:
    """Persist the facts only the ingestion worker knows.

    `title` is omitted when the model is unavailable so the name the session was
    created with survives.

    Celery tasks are sync and `asyncio.run` closes its loop, so this deliberately
    builds its own throwaway engine instead of reusing the API's pooled one.
    """
    asyncio.run(_update_document_info(session_id, page_count, title))


async def _update_document_info(
    session_id: str, page_count: int, title: str | None
) -> None:
    values: dict[str, object] = {"page_count": page_count}

    if title:
        values["title"] = title

    engine = create_async_engine(DATABASE_URL, poolclass=NullPool)

    try:
        session_factory = async_sessionmaker(
            bind=engine, class_=AsyncSession, expire_on_commit=False
        )

        async with session_factory() as session:
            await session.execute(
                update(Session).where(Session.id == UUID(session_id)).values(**values)
            )
            await session.commit()
    finally:
        await engine.dispose()

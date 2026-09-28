from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.auth_models import Message, Session

# How many past question/answer pairs are handed to the model.
HISTORY_TURNS = 3

USER_ROLE = "user"
ASSISTANT_ROLE = "assistant"


class ChatService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def load_history(
        self, session_id: UUID, turns: int = HISTORY_TURNS
    ) -> list[tuple[str, str]]:
        """Most recent exchanges as (question, answer) pairs, oldest first."""
        result = await self.session.execute(
            select(Message)
            .where(Message.session_id == session_id)
            .order_by(Message.created_at.desc())
            .limit(turns * 2)
        )

        messages = list(result.scalars().all())
        messages.reverse()

        history: list[tuple[str, str]] = []
        pending_question: str | None = None

        for message in messages:
            if message.role == USER_ROLE:
                pending_question = message.content
            elif pending_question is not None:
                history.append((pending_question, message.content))
                pending_question = None

        return history

    async def save_exchange(
        self,
        session_id: UUID,
        question: str,
        answer: str,
        citations: list[dict],
    ) -> None:
        """Both rows land together, and only after the model actually answered."""
        self.session.add_all(
            [
                Message(
                    session_id=session_id, role=USER_ROLE, content=question
                ),
                Message(
                    session_id=session_id,
                    role=ASSISTANT_ROLE,
                    content=answer,
                    citations=citations or None,
                ),
            ]
        )

        await self.session.commit()

    async def list_messages(self, session_id: UUID) -> list[Message]:
        result = await self.session.execute(
            select(Message)
            .where(Message.session_id == session_id)
            .order_by(Message.created_at)
        )

        return list(result.scalars().all())

    async def delete_messages(self, session_id: UUID) -> None:
        await self.session.execute(
            delete(Message).where(Message.session_id == session_id)
        )

        await self.session.commit()

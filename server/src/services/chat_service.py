from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.auth_models import Message

USER_ROLE = "user"
ASSISTANT_ROLE = "assistant"


class ChatService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save_exchange(
        self,
        session_id: UUID,
        question: str,
        answer: str,
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

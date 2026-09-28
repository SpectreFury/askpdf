"""add page_count and created_at to sessions

Both columns are filled in by the ingestion worker, not by the API:
`title` is replaced with an AI generated one and `page_count` is only known
once the worker has parsed the document.

Revision ID: bdc5b0f60ba0
Revises: f780b74365ec
Create Date: 2026-09-28 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bdc5b0f60ba0'
down_revision: Union[str, Sequence[str], None] = 'f780b74365ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('sessions', sa.Column('page_count', sa.Integer(), nullable=True))
    op.add_column('sessions', sa.Column('created_at', sa.DateTime(timezone=True), nullable=True))
    # sessions predates this column, so the rows that already exist need a value
    # before the column can be made mandatory.
    op.execute('UPDATE sessions SET created_at = now() WHERE created_at IS NULL')
    op.alter_column('sessions', 'created_at', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('sessions', 'created_at')
    op.drop_column('sessions', 'page_count')

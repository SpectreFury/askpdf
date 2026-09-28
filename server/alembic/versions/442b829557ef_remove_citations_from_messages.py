"""remove citations from messages

Revision ID: 442b829557ef
Revises: 504eccdb79f5
Create Date: 2026-09-29 00:12:25.926324

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '442b829557ef'
down_revision: Union[str, Sequence[str], None] = '504eccdb79f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column('messages', 'citations')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('messages', sa.Column('citations', postgresql.JSONB(astext_type=sa.Text()), nullable=True))

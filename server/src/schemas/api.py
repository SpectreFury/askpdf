from typing import Any

from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    error: str | None

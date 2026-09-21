from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from src.exceptions import (
    ExpiredTokenException,
    InvalidBearerTokenException,
    NoBearerTokenException,
)
from src.utils.jwt import decode_jwt

security = HTTPBearer()

def get_current_user(credential: HTTPAuthorizationCredentials = Depends(security)):
    token = credential.credentials

    if not token:
        raise NoBearerTokenException()

    try:
        payload = decode_jwt(token)
        user_id: str | None = payload["sub"]

        if user_id is None:
            raise InvalidBearerTokenException()

        return user_id

    except jwt.ExpiredSignatureError:
        raise ExpiredTokenException()

    except jwt.PyJWTError:
        raise InvalidBearerTokenException()

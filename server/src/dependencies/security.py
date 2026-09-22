from typing import Annotated

from fastapi import Depends, Cookie
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from src.exceptions import (
    ExpiredTokenException,
    InvalidBearerTokenException,
    NoBearerTokenException,
    NoRefreshTokenException,
)
from src.utils.jwt import decode_jwt

security = HTTPBearer()


def get_user_from_refresh_token(refresh_token: Annotated[str | None, Cookie()] = None):
    print("RF token: ", refresh_token)

    if not refresh_token:
        raise NoRefreshTokenException()

    payload = decode_jwt(refresh_token)

    return payload

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

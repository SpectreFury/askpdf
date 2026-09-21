import jwt
import datetime
import os

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


def encode_jwt(sub: str, first_name: str, last_name: str, is_refresh: bool = False):
    expires_in = (
        datetime.timedelta(days=7) if is_refresh else datetime.timedelta(minutes=30)
    )

    payload = {
        "sub": sub,
        "name": first_name + " " + last_name,
        "exp": datetime.datetime.now(datetime.timezone.utc) + expires_in,
        "iat": datetime.datetime.now(datetime.timezone.utc),
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

    return token

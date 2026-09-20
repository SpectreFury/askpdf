import jwt
import datetime
import os

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


def encode_jwt(sub: str, first_name: str, last_name: str):
    payload = {
        "sub": sub,
        "name": first_name + " " + last_name,
        "exp": datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(minutes=30),
        "iat": datetime.datetime.now(datetime.timezone.utc),
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

    return token

import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.auth_models import User
from src.exceptions import (
    EmailOrPasswordMissingException,
    IncorrectPasswordException,
    UserAlreadyExistsException,
    UserNotExistsException,
)
from src.schemas.auth import LoginData, LoginResponse, SignUpData, SignUpResponse
from src.utils.jwt import encode_jwt


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def register_user(self, signup_data: SignUpData) -> SignUpResponse:
        email = signup_data.email.lower().strip()
        password = signup_data.password.strip()

        stmt = select(User).where(User.email == email)

        result = await self.session.execute(stmt)

        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise UserAlreadyExistsException()

        # Hash the password

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        new_item = User(
            first_name=signup_data.first_name,
            last_name=signup_data.last_name,
            email=email,
            password=hashed_password,
            is_google_account=False,
        )
        self.session.add(new_item)

        await self.session.commit()
        await self.session.refresh(new_item)

        # Create an access token

        access_token = encode_jwt(
            str(new_item.id), new_item.first_name, new_item.last_name
        )

        return SignUpResponse(
            id=new_item.id,
            access_token=access_token,
            first_name=new_item.first_name,
            last_name=new_item.last_name,
        )

    async def login_user(self, login_data: LoginData) -> LoginResponse:
        email = login_data.email.lower().strip()
        password = login_data.password.strip()

        if not email or not password:
            raise EmailOrPasswordMissingException()

        stmt = select(User).where(User.email == email)

        result = await self.session.execute(stmt)

        existing_user = result.scalar_one_or_none()

        if not existing_user:
            raise UserNotExistsException()

        is_password_correct = bcrypt.checkpw(
            password.encode("utf-8"), existing_user.password.encode("utf-8")
        )

        if not is_password_correct:
            raise IncorrectPasswordException()

        access_token = encode_jwt(
            str(existing_user.id), existing_user.first_name, existing_user.last_name
        )

        return LoginResponse(
            id=existing_user.id,
            access_token=access_token,
            first_name=existing_user.first_name,
            last_name=existing_user.last_name,
        )

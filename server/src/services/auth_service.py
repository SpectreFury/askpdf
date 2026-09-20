import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.auth_models import User
from src.exceptions import UserAlreadyExistsException
from src.schemas.auth import SignUpData, SignUpResponse
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

        # Create a access and refresh token

        access_token = encode_jwt(
            str(new_item.id), new_item.first_name + " " + new_item.last_name
        )

        return SignUpResponse(
            id=new_item.id, access_token=access_token, refresh_token=""
        )

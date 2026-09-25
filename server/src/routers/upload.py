from fastapi import APIRouter, Depends, status

from src.dependencies.security import get_current_user
from src.schemas.api import APIResponse
from src.schemas.upload import PresignedURLResponse
from ..utils.cloudinary import generate_presigned_link

router = APIRouter()


@router.post(
    "/generate-presigned-url",
    response_model=APIResponse[PresignedURLResponse],
    status_code=status.HTTP_200_OK,
)
async def generate_url(user_id: str = Depends(get_current_user)):
    options = await generate_presigned_link()

    return APIResponse(success=True, data=options, error=None)

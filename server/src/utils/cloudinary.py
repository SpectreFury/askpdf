import time

from dotenv import load_dotenv

from src.schemas.upload import PresignedURLResponse

load_dotenv()

import cloudinary
import cloudinary.uploader
import cloudinary.api

config: cloudinary.Config = cloudinary.config()


async def generate_presigned_link() -> PresignedURLResponse:
    if not config.api_key or not config.cloud_name: 
        raise ValueError("CLOUDINARY_URL required")

    timestamp = int(time.time())
    folder = "user_documents"
    params_to_sign = {
            "timestamp": timestamp,
            "folder": folder
            }

    signature = cloudinary.utils.api_sign_request(params_to_sign, config.api_secret)

    return PresignedURLResponse(
            signature=signature,
            timestamp=timestamp,
            folder=folder,
            api_key=config.api_key,
            cloud_name=config.cloud_name
            )


def secure_download_url(public_id: str, format: str = "pdf", expires_in: int = 600) -> str:
    """Time limited delivery url for a stored document."""
    if not config.api_key or not config.cloud_name:
        raise ValueError("CLOUDINARY_URL required")

    # public ids handed back by an upload can carry the file extension
    suffix = f".{format}"
    clean_public_id = (
        public_id[: -len(suffix)] if public_id.endswith(suffix) else public_id
    )

    return cloudinary.utils.private_download_url(
        public_id=clean_public_id,
        format=format,
        resource_type="image",
        type="upload",
        expires_at=int(time.time() + expires_in),
    )

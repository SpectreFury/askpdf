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
    params_to_sign = {"timestamp": timestamp, "folder": folder}

    signature = cloudinary.utils.api_sign_request(params_to_sign, config.api_secret)

    return PresignedURLResponse(
            signature=signature,
            timestamp=timestamp,
            folder=folder,
            api_key=config.api_key,
            cloud_name=config.cloud_name
            )

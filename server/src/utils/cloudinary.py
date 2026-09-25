import time

from dotenv import load_dotenv

load_dotenv()

import cloudinary
import cloudinary.uploader
import cloudinary.api

config = cloudinary.config()


async def generate_presigned_link():
    timestamp = int(time.time())
    params_to_sign = {"timestamp": timestamp, "folder": "user_documents"}

    signature = cloudinary.utils.api_sign_request(params_to_sign, config.api_secret)
    return signature

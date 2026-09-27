import os
import time
from celery import Celery
from dotenv import load_dotenv

from src.rag_pipeline.rag import download_file, injest_pdf

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise ValueError("Need REDIS_URL to work")

celery_app = Celery('tasks',
                    broker=REDIS_URL,
                    backend=REDIS_URL,
                    )

@celery_app.task(name = "rag_pipeline", bind = True)
def rag_pipeline(self, public_id: str, session_id: str):
    print("INCOMING TASK: rag_pipeline")

    output_path = download_file(public_id)
    
    injest_pdf(output_path, session_id)
    print("INJESTED")

    return {"status": "Completed"}



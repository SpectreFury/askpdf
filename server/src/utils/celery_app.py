import os
import time
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise ValueError("Need REDIS_URL to work")

celery_app = Celery('tasks',
                    broker=REDIS_URL,
                    backend=REDIS_URL,
                    )

@celery_app.task(name = "rag_pipeline")
def rag_pipeline(task_input: str):
    time.sleep(5)
    return {"status": "Completed"}



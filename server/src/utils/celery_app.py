import os
from celery import Celery
from dotenv import load_dotenv

from src.rag_pipeline.rag import download_file, injest_pdf
from src.rag_pipeline.suggestions import generate_suggestions
from src.rag_pipeline.title import generate_title
from src.services.session_service import update_document_info

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

    page_count, document_text = injest_pdf(output_path, session_id)

    title = generate_title(document_text)
    suggested_questions = generate_suggestions(document_text)

    update_document_info(
        session_id,
        page_count=page_count,
        title=title,
        suggested_questions=suggested_questions,
    )
    print(
        f"INJESTED: {page_count} pages, titled {title!r}, "
        f"{len(suggested_questions)} suggested questions"
    )

    return {"status": "Completed"}

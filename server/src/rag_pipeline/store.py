import os

from dotenv import load_dotenv

load_dotenv()

from langchain_chroma.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings

from .models import EMBEDDING_MODEL

# CWD relative: the API and the worker both have to run from `server/`.
PERSIST_DIRECTORY = "./chroma_db"

TOP_K = 12
MAX_BLOCKS = 8
# Cosine distance cutoff for retrieved chunks. Kept loose on purpose: we would
# rather answer from weakly related excerpts than refuse, so borderline chunks
# stay in and the prompt decides what to do with them.
SCORE_CUTOFF = 1.2

# Shared so ingestion and retrieval always agree on the vector space. Chroma's
# own default embedder is 384 dimensional and would not match what was written.
embeddings = OllamaEmbeddings(
    model=EMBEDDING_MODEL,
    base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
)


def collection_name(session_id) -> str:
    return f"session_{session_id}"


def open_collection(session_id, create_if_missing: bool = True) -> Chroma:
    return Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embeddings,
        collection_name=collection_name(session_id),
        create_collection_if_not_exists=create_if_missing,
    )

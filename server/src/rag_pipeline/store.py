from dotenv import load_dotenv

load_dotenv()

from langchain_chroma.vectorstores import Chroma
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings

from .models import EMBEDDING_MODEL

# CWD relative: the API and the worker both have to run from `server/`.
PERSIST_DIRECTORY = "./chroma_db"

TOP_K = 8
MAX_BLOCKS = 5
# Chunks beyond this cosine distance are off topic. Anything above ~1.0 shares
# almost no direction with the query.
SCORE_CUTOFF = 1.0

# Shared so ingestion and retrieval always agree on the vector space. Chroma's
# own default embedder is 384 dimensional and would not match what was written.
embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)


def collection_name(session_id) -> str:
    return f"session_{session_id}"


def open_collection(session_id, create_if_missing: bool = True) -> Chroma:
    return Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embeddings,
        collection_name=collection_name(session_id),
        create_collection_if_not_exists=create_if_missing,
    )

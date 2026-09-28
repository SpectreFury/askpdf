from dataclasses import dataclass

from .store import MAX_BLOCKS, SCORE_CUTOFF, TOP_K, open_collection


@dataclass
class ContextBlock:
    """A retrieved chunk, numbered so the model can cite it."""

    index: int
    text: str
    page: int


def build_search_query(history: list[tuple[str, str]], question: str) -> str:
    """Carry the previous question so follow ups like "and on GDP?" still retrieve.

    Cheaper than an extra model call to rewrite the question, and enough to
    resolve what "it" refers to.
    """
    if not history:
        return question

    return f"{history[-1][0]} {question}"


def retrieve_blocks(session_id: str, query: str) -> list[ContextBlock]:
    """Retrieve the chunks that could answer `query`.

    Raises `chromadb.errors.NotFoundError` when the session has no collection,
    which means ingestion has not finished yet.
    """
    vector_store = open_collection(session_id, create_if_missing=False)

    results = vector_store.similarity_search_with_score(query, k=TOP_K)

    blocks: list[ContextBlock] = []
    seen: set[tuple[int, str]] = set()

    for document, score in results:
        if score > SCORE_CUTOFF:
            continue

        page = page_number(document.metadata)
        text = document.page_content.strip()

        # Overlapping chunks from the same paragraph add tokens, not meaning.
        fingerprint = (page, text[:80].lower())
        if fingerprint in seen:
            continue

        seen.add(fingerprint)
        blocks.append(ContextBlock(index=len(blocks) + 1, text=text, page=page))

        if len(blocks) >= MAX_BLOCKS:
            break

    return blocks


def page_number(metadata: dict) -> int:
    """Chunks store a 0 indexed `page` plus a 1 indexed `page_label`."""
    label = metadata.get("page_label")

    if label is not None:
        return int(label)

    return int(metadata.get("page", 0)) + 1

from dataclasses import dataclass

from .store import MAX_BLOCKS, SCORE_CUTOFF, TOP_K, open_collection


@dataclass
class ContextBlock:
    text: str
    page: int


def retrieve_blocks(session_id: str, query: str) -> list[ContextBlock]:
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
        blocks.append(ContextBlock(text=text, page=page))

        if len(blocks) >= MAX_BLOCKS:
            break

    return blocks


def page_number(metadata: dict) -> int:
    label = metadata.get("page_label")

    if label is not None:
        return int(label)

    return int(metadata.get("page", 0)) + 1

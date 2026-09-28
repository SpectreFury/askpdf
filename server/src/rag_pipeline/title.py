import os

from langchain_ollama import ChatOllama

from .models import CHAT_MODEL

SAMPLE_LIMIT = 3000
MAX_TITLE_LENGTH = 80

PROMPT = (
    "You name uploaded documents so they can be found in a library later.\n"
    "Read the excerpt and reply with one descriptive title of 2 to 5 words that "
    "captures what the document is about.\n"
    "Reply with the title only: no quotes, no trailing period, no preamble.\n\n"
    "Excerpt:\n"
)


def generate_title(sample_text: str) -> str | None:
    prompt = PROMPT + sample_text[:SAMPLE_LIMIT]

    try:
        model = ChatOllama(
            model=CHAT_MODEL,
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            temperature=0,
        )

        content = model.invoke(prompt).content
        title = content if isinstance(content, str) else str(content)

        title = " ".join(title.strip().strip('"').split())

        return title[:MAX_TITLE_LENGTH] or None
    except Exception as exc:
        print(f"Skipping AI session title: {exc}")

        return None

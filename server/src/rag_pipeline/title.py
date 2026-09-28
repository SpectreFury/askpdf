from langchain_google_genai import ChatGoogleGenerativeAI

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
    """Name a document from its opening pages.

    Returns None when the model is unusable, which leaves the title the session
    was created with (the uploaded filename) in place.
    """
    prompt = PROMPT + sample_text[:SAMPLE_LIMIT]

    try:
        # Built lazily: the celery worker imports this module while registering
        # tasks and must stay importable without a usable API key. No temperature
        # is set because Gemini 3+ rejects custom sampling values.
        model = ChatGoogleGenerativeAI(model=CHAT_MODEL, thinking_level="low")

        content = model.invoke(prompt).content
        title = content if isinstance(content, str) else str(content)

        title = " ".join(title.strip().strip('"').split())

        return title[:MAX_TITLE_LENGTH] or None
    except Exception as exc:
        print(f"Skipping AI session title: {exc}")

        return None

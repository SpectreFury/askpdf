import re

from langchain_google_genai import ChatGoogleGenerativeAI

from .models import CHAT_MODEL

SAMPLE_LIMIT = 4000
SUGGESTION_COUNT = 4
MAX_QUESTION_LENGTH = 120

PROMPT = (
    "You suggest questions a reader might ask about the document below.\n"
    f"Reply with exactly {SUGGESTION_COUNT} questions, one per line, no numbering, "
    "no bullets, no preamble. Each question must be answerable from the document "
    "and must end with a question mark.\n\n"
    "Document:\n"
)

LEADING_MARKER = re.compile(r"^[-*\u2022\d.)\s]+")


def generate_suggestions(sample_text: str) -> list[str]:
    """Questions shown above the composer, generated once at ingestion time."""
    prompt = PROMPT + sample_text[:SAMPLE_LIMIT]

    try:
        # Built lazily so the worker stays importable without a usable API key.
        # No temperature: Gemini 3+ rejects custom sampling values.
        model = ChatGoogleGenerativeAI(model=CHAT_MODEL, thinking_level="low")

        content = model.invoke(prompt).content
        text = content if isinstance(content, str) else str(content)

        return parse_suggestions(text)
    except Exception as exc:
        print(f"Skipping suggested questions: {exc}")

        return []


def parse_suggestions(text: str) -> list[str]:
    questions: list[str] = []

    for line in text.splitlines():
        candidate = LEADING_MARKER.sub("", line.strip()).strip().strip('"')

        if not candidate.endswith("?") or len(candidate) > MAX_QUESTION_LENGTH:
            continue

        questions.append(candidate)

        if len(questions) >= SUGGESTION_COUNT:
            break

    return questions

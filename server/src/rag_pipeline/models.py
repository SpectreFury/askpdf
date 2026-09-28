# Single source of truth for model ids. Local Ollama models so the pipeline
# runs without a cloud API key. They live here rather than being repeated in
# each module.
CHAT_MODEL = "llama3.1:8b"

# 768 dimensional via Ollama's nomic-embed-text, and the vector space every
# stored collection is written with. Changing this invalidates every existing
# collection.
EMBEDDING_MODEL = "nomic-embed-text"

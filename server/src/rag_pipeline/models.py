# Single source of truth for model ids. Gemini 2.5 Flash is closed to new
# projects, 3.8 Flash keeps returning RESOURCE_EXHAUSTED on this key, and model
# names are the part of this pipeline that churns fastest, so they live here
# rather than being repeated in each module.
CHAT_MODEL = "gemini-3.5-flash"

# 3072 dimensional, and the vector space every stored collection was written
# with. Changing this invalidates every existing collection.
EMBEDDING_MODEL = "gemini-embedding-2"

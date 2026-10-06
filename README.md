# AskPDF

It's a simple application that highlights the usage of RAG with the power of workers in Python

## Running guide

web/ - This is the Next.js application
server/ - This is the FastAPI backend that also contains the celery worker

## Environment variables

### web/.env.local

```env
NEXT_PUBLIC_SERVER_URL=YOUR_SERVER_URL
```

### web/.env

```env
OLLAMA_BASE_URL=
REDIS_URL=
DATABASE_URL=
JWT_SECRET=
ENV=development
```

## How to run

For web, npm install and npm run dev
For server, uv sync to install packages and then uv run fastapi dev src/main.py
For worker, uv run celery -A src.utils.celery_app.celery_app worker --loglevel=info --pool=solo

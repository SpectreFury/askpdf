# AGENTS.md

## Layout

Two independent apps, no root workspace/orchestrator (no docker-compose, no CI, no root manifest):

- `server/` — FastAPI + SQLAlchemy (async) + Alembic + Celery, managed with `uv` (Python 3.14, `.venv/` already present).
- `web/` — Next.js 16 App Router + React 19 + Tailwind v4 + shadcn, npm.

## Commands

Run everything from the respective subdirectory (dotenv/alembic/chroma paths are CWD-relative).

```bash
# server
uv sync
uv run fastapi dev src/main.py          # or: uv run uvicorn src.main:app --reload
uv run celery -A src.utils.celery_app.celery_app worker --pool=solo   # separate terminal; --pool=solo is required on Windows
uv run alembic revision --autogenerate -m "msg"

# web
npm run dev            # :3000
npm run build
npm run lint           # eslint
npx tsc --noEmit       # there is NO typecheck script; this is it
```

Baseline: `npm run lint` currently fails with 12 errors / 13 warnings already committed, `npx tsc --noEmit` passes. Don't assume lint is green and don't opportunistically fix unrelated ones.

## Env

- `server/.env` (gitignored) requires: `DATABASE_URL` (asyncpg form `postgresql+asyncpg://...`), `JWT_SECRET`, `REDIS_URL`, `CLOUDINARY_URL`, `GOOGLE_API_KEY` (Gemini embeddings, worker side), and `ENV=production` to flip the refresh cookie to `secure`.
- `REDIS_URL` is needed at **import** time: `src/routers/session.py` imports `celery_app`, which raises without it — the API won't boot.
- `web/.env.local` needs `NEXT_PUBLIC_SERVER_URL`. Every endpoint URL is declared in `web/utils/env.ts`; add new ones there.
- `.env` files are gitignored but contain live Neon/Upstash/Cloudinary credentials — never commit or print them. `server/uv.lock` is gitignored too, so it isn't a shared source of truth.

## Auth flow

- Access token (30 min) comes back in the login/signup JSON body; web stores it in `localStorage.access_token` and sends `Authorization: Bearer`.
- Refresh token (7 days) is an HttpOnly cookie set by the server — never visible to JS.
- All authenticated web requests must use `fetchWithInterceptor` (`web/utils/fetch-interceptor.ts`). It detects a 401 whose body has `error === "token_expired"`, serializes refreshes through a single shared promise, and retries the original request once. Plain `fetch` bypasses refresh (used for the login/signup cards, which need no token).
- `web/proxy.ts` is the Next 16 route-protection middleware (exported name is `proxy`, not `middleware`). It calls `/auth/refresh` server-side on every matched request and redirects to `/login` on failure. **New public routes must be added to the `matcher` exclude list.**
- Every endpoint returns the `APIResponse[success, data, error]` envelope (`server/src/schemas/api.py`, mirrored in `web/types/api.ts`). Raise errors as `AppExceptions` subclasses in `server/src/exceptions.py`; `main.py` has the handler. The web interceptor depends on the exact string `token_expired`.

## Upload → ingestion pipeline

Three hops from the browser (`web/app/(main)/_api/workspace.ts`):

1. `POST /upload/generate-presigned-url` → signed Cloudinary params.
2. Browser POSTs the PDF straight to `https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload`.
3. `POST /session` with the returned `public_id`.

`POST /session` immediately calls `rag_pipeline.delay(...)` (`server/src/routers/session.py:43`), so a running Celery worker + reachable broker is required or uploads silently ingest nothing. The worker downloads the PDF from Cloudinary to `server/downloaded/<public_id>/file.pdf` and writes chunks into a per-session Chroma collection `session_{session_id}` under `server/chroma_db/`. Both dirs are gitignored local artifacts; the collection name (not a metadata filter) is what isolates one session's vectors.

Uploaded assets are **authenticated** in this Cloudinary account — a plain `cloudinary_url(...)` delivery link returns 401. Every consumer (worker download, browser renderer) must go through `secure_download_url(public_id, expires_in=...)` in `server/src/utils/cloudinary.py`, which returns a signed `api.cloudinary.com/v1_1/<cloud>/image/download` URL with `Access-Control-Allow-Origin: *` and HTTP range support, so react-pdf can fetch it from the browser. Give browser-facing URLs a long `expires_in` (the session route uses 3600) because pdf.js issues range requests over the life of the page.

The worker also owns two session columns, so they are `null`/"Processing" until a task finishes: `title` is replaced with an AI title from `src/rag_pipeline/title.py` (falls back to the uploaded filename stem, which `POST /session` sets from `CreateSessionData.filename`), and `page_count` comes from the parsed PDF. The write happens in `src/services/session_service.py`, which opens its own `NullPool` engine because the sync Celery task cannot share the API's event loop.

## Chat (UI done, backend not)

`ConversationAside` is fully wired to two endpoints that **do not exist yet** (expect 404 in the network tab):

- `POST /session/{session_id}/ask` — body `{question: str, citations_only: bool}` → `APIResponse[{answer: str, citations: [{page: int, paragraph: int | null}]}]`
- `GET /session/{session_id}/suggestions` → `APIResponse[str]`

Threads are client-only state (`useState` in `ConversationAside`) with an optimistic user message plus a pending assistant bubble; nothing is persisted, and Reset just clears local state. Types are in `web/types/chat.ts`, requests in `web/app/(main)/_api/chat.ts`, both behind `fetchWithInterceptor`. When the backend lands, add the routes + pydantic schemas in `server/src/routers/session.py` and nothing on the web side needs to change.

## Database gotcha

- There is exactly one migration and it contains **no `create_table`** — it ALTERs `users`/`sessions`, which no migration creates, and nothing calls `Base.metadata.create_all`. Those tables must already exist in the target DB or the app's startup `alembic upgrade head` fails. Verify against the real DB before assuming a fresh one works.
- Startup runs `alembic upgrade head` in a thread (`src/main.py` lifespan), so you rarely need to run it manually.
- Add migrations as new revisions; don't edit `f780b74365ec`, which is already applied.
- `Session` in `server/src/db/models/auth_models.py` is a **document/workspace** session (title, document_id, user_id) — not an auth session.

## Frontend conventions

- Route groups `app/(auth)` and `app/(main)`, each with co-located `_components/` and `_api/` (client fetch/mutation wrappers). Folders prefixed with `_` are not routable.
- Server data: TanStack Query, provider in `components/providers/tanstack-provider.tsx` wrapping the root layout. Mutations are defined in the `_api/` file and consumed via `useMutation`.
- Forms: `@tanstack/react-form-nextjs` with a zod schema in `validators.onSubmit` (see `app/(auth)/_components/SignInCard.tsx`).
- UI: shadcn style `base-nova` over `@base-ui/react` (`components.json`). Tailwind v4 tokens live in `app/globals.css`; the brand serif is the `font-display` utility.
- react-pdf: `public/pdf.worker.min.mjs` is **generated** by `scripts/copy-pdf-worker.mjs` on `postinstall` and is gitignored. If PDF rendering breaks (fresh clone, deleted file), run `npm run copy-pdf-worker`.
- **react-pdf cannot be imported by anything the server renders.** `react-pdf/dist/LinkService.js` pulls in `pdfjs-dist/web/pdf_viewer.mjs`, which touches `window`/`document` at module scope, so SSR throws `document is not defined` and the route 500s. Every react-pdf import lives in `_components/PdfViewer.tsx`, loaded by `DocumentRenderer.tsx` via `next/dynamic(..., { ssr: false })`. `ssr: false` is only legal inside a Client Component, so the page itself must stay a server component. Don't "simplify" the split back into one file.
- Page props: type pages with the Next 16 global `PageProps<"/route/[param]">`. `params` is a `Promise` of the **param map**, so `const sessionId = await params` yields `{ sessionId: "..." }` and stringifies to `[object Object]` in URLs — always destructure (`const { sessionId } = await params`).

## Commits

`feat: ...` / `add: ...` prefixes, imperative short summary, one logical change per commit.

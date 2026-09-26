from contextlib import asynccontextmanager
from pathlib import Path
import asyncio

from alembic import command
from alembic.config import Config
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.exceptions import AppExceptions
from src.routers import session
from src.schemas.api import APIResponse
from .routers import auth
from .routers import upload

ROOT_DIR = Path(__file__).resolve().parent.parent

@asynccontextmanager
async def lifespan(app: FastAPI):
    # alembic's async env calls asyncio.run(), so it needs its own loop
    await asyncio.to_thread(
        command.upgrade, Config(str(ROOT_DIR / "alembic.ini")), "head"
    )
    yield


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppExceptions)
async def app_exception_handler(request: Request, exc: AppExceptions):
    response_body = APIResponse[None](success=False, data=None, error=exc.message)

    return JSONResponse(
        status_code=exc.status_code, content=response_body.model_dump(mode="json")
    )


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(session.router, prefix="/session", tags=["session"])

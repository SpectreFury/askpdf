from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.exceptions import AppExceptions
from src.schemas.api import APIResponse
from .routers import auth
from .routers import upload
from .db.db import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
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

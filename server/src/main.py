from fastapi import FastAPI
from .routers import auth

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])


@app.get("/health")
async def root():
    return {"message": "The API is active"}

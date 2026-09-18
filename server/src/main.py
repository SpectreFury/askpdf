from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello"}

@app.get("/{id}")
async def get_id(id: str):
    return {"id": id}



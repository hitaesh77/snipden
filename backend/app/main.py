from fastapi import FastAPI
from app.routes import snippets

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"message": "pong"}

app.include_router(snippets.router, prefix="/api")

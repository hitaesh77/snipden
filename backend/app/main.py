from fastapi import FastAPI
from app.routes import snippets
from app.db.init_db import init_db

app = FastAPI() 

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/ping")
async def ping():
    return {"message": "pong"}

app.include_router(snippets.router, prefix="/api")

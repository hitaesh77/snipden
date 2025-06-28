from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import snippets
from app.db.init_db import init_db

app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/ping")
async def ping():
    return {"message": "pong"}

app.include_router(snippets.router, prefix="/api")

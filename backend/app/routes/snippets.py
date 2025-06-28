from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.schemas import SnippetCreate, SnippetBase, Snippet
from app.services import crud
from app.db import db, models

router = APIRouter()

@router.post("/snippets/add", response_model=Snippet)
def create_snippet(snippet: SnippetCreate, db: Session = Depends(db.get_db)):
    return crud.create_snippet(db=db, snippet=snippet)

@router.get("/snippets", response_model=list[Snippet])
def get_snippets(db: Session = Depends(db.get_db)):
    return db.query(models.Snippet).all()

'''
@router.post("/snippets/", response_model=Snippet)
def create_snippet(snippet: SnippetCreate, user_id: UUID, db: Session = Depends(db.get_db)):
    return crud.create_snippet(db=db, snippet=snippet, user_id=user_id)
'''
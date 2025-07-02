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

@router.put("/snippets/{snippet_id}", response_model=Snippet)
def update_snippet(snippet_id: UUID, snippet: SnippetCreate, db: Session = Depends(db.get_db)):
    db_snippet = db.query(models.Snippet).filter(models.Snippet.id == snippet_id).first()
    for key, value in snippet.dict().items():
        setattr(db_snippet, key, value)
    db.commit()
    db.refresh(db_snippet)
    return db_snippet

@router.delete("/snippets/{snippet_id}", response_model=bool)
def delete_snippet(snippet_id: UUID, db: Session = Depends(db.get_db)):
    db_snippet = db.query(models.Snippet).filter(models.Snippet.id == snippet_id).first()
    db.delete(db_snippet)
    db.commit()
    return True
    
'''
@router.post("/snippets/", response_model=Snippet)
def create_snippet(snippet: SnippetCreate, user_id: UUID, db: Session = Depends(db.get_db)):
    return crud.create_snippet(db=db, snippet=snippet, user_id=user_id)
'''
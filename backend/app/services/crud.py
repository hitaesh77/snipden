from sqlalchemy.orm import Session
from app.db import models
from app.schemas import schemas
from typing import List
from uuid import UUID

'''
def create_snippet(db: Session, snippet: schemas.SnippetCreate, user_id: UUID):
    db_snippet = models.Snippet(
        title=snippet.title,
        code=snippet.code,
        language=snippet.language,
        summary=snippet.summary,
        tags=snippet.tags,
        user_id=user_id
    )
    db.add(db_snippet)
    db.commit()
    db.refresh(db_snippet)
    return db_snippet
'''

def create_snippet(db: Session, snippet: schemas.SnippetCreate):
    db_snippet = models.Snippet(
        title=snippet.title,
        code=snippet.code,
        language=snippet.language,
        summary=snippet.summary,
        tags=snippet.tags,
    )
    db.add(db_snippet)
    db.commit()
    db.refresh(db_snippet)
    return db_snippet

def update_snippet(db: Session, snippet_id: UUID, snippet: schemas.SnippetBase):
    db_snippet = db.query(models.Snippet).filter(models.Snippet.id == snippet_id).first()
    db_snippet.title = snippet.title
    db_snippet.code = snippet.code
    db_snippet.language = snippet.language
    db_snippet.summary = snippet.summary
    db_snippet.tags = snippet.tags
    db.commit()
    db.refresh(db_snippet)
    return db_snippet

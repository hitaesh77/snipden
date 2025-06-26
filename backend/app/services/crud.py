from sqlalchemy.orm import Session
from app.db import models
from app.schemas import schemas
from typing import List
from uuid import UUID

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
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.schemas import SnippetCreate, SnippetBase, Snippet
from app.services import crud
from app.db import db, models
from fastapi import Query
from sqlalchemy import or_

router = APIRouter()

@router.post("/snippets/add", response_model=Snippet)
def create_snippet(snippet: SnippetCreate, db: Session = Depends(db.get_db)):
    return crud.create_snippet(db=db, snippet=snippet)

@router.post("/snippets/generate_tags_summary", response_model=dict)
def generate_tags_summary(request: dict):
    return crud.generate_tags_summary(request)

@router.get("/snippets", response_model=list[Snippet])
def get_snippets(
    language: Optional[List[str]] = Query(None, description="Filter by one or more languages (e.g. ?language=python&language=javascript)"),
    created_after: Optional[datetime] = Query(None, description="Only show snippets created after this date"),
    created_before: Optional[datetime] = Query(None, description="Only show snippets created before this date"),
    sort_order: Optional[str] = Query("newest", description="Sort by newest or oldest"),
    db: Session = Depends(db.get_db),
):
    """
    Get snippets filtered by language(s), date range, and sort order.
    Examples:
      - /snippets?language=python
      - /snippets?language=python&language=javascript
      - /snippets?created_after=2025-01-01
      - /snippets?created_before=2025-12-31
      - /snippets?sort_order=oldest
    """

    query = db.query(models.Snippet)

    # Filter by language(s) - support multiple languages with OR condition
    if language:
        # Create OR conditions for each language (case-insensitive)
        language_conditions = [
            models.Snippet.language.ilike(lang) for lang in language
        ]
        query = query.filter(or_(*language_conditions))

    # Filter by date range
    if created_after:
        query = query.filter(models.Snippet.created_at >= created_after)
    if created_before:
        query = query.filter(models.Snippet.created_at <= created_before)

    # Sort order
    if sort_order == "oldest":
        query = query.order_by(models.Snippet.created_at.asc())
    else:
        query = query.order_by(models.Snippet.created_at.desc())

    return query.all()

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

@router.post("/snippets/search", response_model=list[Snippet])
def search_snippets(
    query: str = Query(..., description="Natural language search query"),
    db: Session = Depends(db.get_db)
):
    return crud.search_snippets(db=db, query=query)
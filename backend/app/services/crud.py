from sqlalchemy.orm import Session
from app.db import models
from app.schemas import schemas
from typing import List
from uuid import UUID
from app.services.openai_utils import summarize_and_tag, generate_embedding, generate_query_embedding
from sqlalchemy import text, Float
from sqlalchemy.sql.expression import func, cast, literal
from pgvector.sqlalchemy import Vector

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
    'summary_tags = summarize_and_tag(snippet.code)'
    db_snippet = models.Snippet(
        title=snippet.title,
        code=snippet.code,
        language=snippet.language,
        summary=snippet.summary,
        tags=snippet.tags,
        embedding = generate_embedding(snippet.code, snippet.summary, snippet.tags)
    )
    db.add(db_snippet)
    db.commit()
    db.refresh(db_snippet)
    return db_snippet

def generate_tags_summary(request: dict):
    code = request.get("code", "")
    summary_tags = summarize_and_tag(code)
    return {
        "tags": summary_tags["tags"],
        "summary": summary_tags["summary"]
    }

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

def search_snippets(db: Session, query: str, limit: int = 5):
    query_embedding = generate_query_embedding(query)

    # similarity = func.cosine_similarity(models.Snippet.embedding, query_embedding).label("similarity")
    query_vector = cast(literal(query_embedding), Vector)

    distance = models.Snippet.embedding.op('<->', return_type=float)(query_vector)
    similarity = (1 - distance).label("similarity") 

    results = (
        db.query(models.Snippet, similarity)
        .filter(similarity > 0.7) # similarity threshold, need to tune
        .order_by(similarity.desc())
        .limit(limit)
        .all()
    )

    return [snippet for snippet, _ in results]

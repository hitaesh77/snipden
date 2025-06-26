from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
<<<<<<< HEAD
from app.schemas.schemas import SnippetCreate, Snippet
from app.services import crud
from app.db import db
=======
from app.schemas import SnippetCreate, Snippet
from app import crud, db
>>>>>>> a300ffd (added models, schemas, db connection, api route for creating snippet)

router = APIRouter()

@router.post("/snippets/", response_model=Snippet)
def create_snippet(snippet: SnippetCreate, user_id: UUID, db: Session = Depends(db.get_db)):
    return crud.create_snippet(db=db, snippet=snippet, user_id=user_id)
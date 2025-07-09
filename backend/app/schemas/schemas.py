from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# Shared base model
class SnippetBase(BaseModel):
    title: str
    code: str
    language: str
    summary: Optional[str] = None
    tags: list[str]

# client POST request, inherits from SnippetBase
# pass means it has the same fields as SnippetBase
# used for creating a new snippet
class SnippetCreate(SnippetBase):
    pass

# server response
class Snippet(SnippetBase):
    id: UUID
    #user_id: UUID
    created_at: datetime

    # This is used to return a list of snippets, allows ORM objects 
    class Config:
        from_attributes = True

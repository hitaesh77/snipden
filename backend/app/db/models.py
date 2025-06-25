from sqlalchemy import Column, String, DateTime, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Snippet(Base):
    __tablename__ = "snippets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    code = Column(String, nullable=False)
    language = Column(String, nullable=False)
    summary = Column(String)
    tags = Column(ARRAY(String), nullable=False)
    embedding = Column("embedding", String)  # pgvector would use: Vector(1536) with a custom type
    created_at = Column(DateTime(timezone=True), server_default=func.now())

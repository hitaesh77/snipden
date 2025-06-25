import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# connects to the database
engine = create_engine(DATABASE_URL)
# creates sessions for the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency for FastAPI routes
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
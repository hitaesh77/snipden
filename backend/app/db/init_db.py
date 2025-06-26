import os
from app.db.db import engine
from app.db import models
from sqlalchemy import create_engine

sync_db_url = os.getenv("DATABASE_URL_SYNC")

def init_db():
    sync_engine = create_engine(sync_db_url)

    try:
        models.Base.metadata.create_all(bind=sync_engine)
    except Exception as e:
        print(f"Error creating tables: {e}")
        raise
    finally:
        sync_engine.dispose()

def drop_db():
    sync_engine = create_engine(sync_db_url)
    try:
        models.Base.metadata.drop_all(bind=sync_engine)
    finally:
        sync_engine.dispose()

def reset_db():
    drop_db()
    init_db()

def startup_db():
    try:
        init_db()
    except Exception as e:
        print(f"Database initialization failed: {e}")
        raise
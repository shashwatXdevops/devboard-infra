import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient

# PostgreSQL Setup
PG_HOST = os.environ.get("PG_HOST", "localhost")
PG_PORT = os.environ.get("PG_PORT", "5432")
PG_USER = os.environ.get("PG_USER", "postgres")
PG_PASSWORD = os.environ.get("PG_PASSWORD", "postgres")
PG_DB = os.environ.get("PG_DB", "devboard")

PG_URL = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}"

try:
    engine = create_engine(PG_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"Warning: Failed to connect to PostgreSQL: {e}")
    SessionLocal = None

def get_pg_session():
    if not SessionLocal:
        raise Exception("PostgreSQL is not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB Setup
MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", "27017")
MONGO_DB = os.environ.get("MONGO_DB", "devboard")

MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

try:
    mongo_client = AsyncIOMotorClient(MONGO_URL)
    mongo_db = mongo_client[MONGO_DB]
except Exception as e:
    print(f"Warning: Failed to connect to MongoDB: {e}")
    mongo_db = None

def get_mongo_db():
    if mongo_db is None:
        raise Exception("MongoDB is not configured")
    return mongo_db

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_client = MongoDB()

async def connect_to_mongo():
    db_client.client = AsyncIOMotorClient(settings.mongo_database_uri)
    db_client.db = db_client.client[settings.MONGO_DB]
    print("Connected to MongoDB.")

async def close_mongo_connection():
    if db_client.client:
        db_client.client.close()
        print("Closed MongoDB connection.")

def get_mongo_db():
    """Dependency for providing a MongoDB database instance."""
    if db_client.db is None:
        raise Exception("MongoDB is not configured or connected")
    return db_client.db

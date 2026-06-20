from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DevBoard Core API"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Configuration
    DATABASE_URL: str = "postgresql://devboard_admin:secure_devboard_pass@localhost:5432/devboard_core"
    
    @property
    def sqlalchemy_database_uri(self) -> str:
        return self.DATABASE_URL
    
    # MongoDB Configuration
    MONGO_URL: str = "mongodb://devboard_admin:secure_devboard_pass@localhost:27017/?authSource=admin"
    MONGO_DB: str = "devboard_core"

    @property
    def mongo_database_uri(self) -> str:
        return self.MONGO_URL

    # JWT Configuration
    SECRET_KEY: str = "super_secret_devboard_key_123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Service Configuration
    AI_SERVICE_HOST: str = "localhost"
    AI_SERVICE_PORT: str = "50051"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

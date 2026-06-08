from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DevBoard Core API"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Configuration
    PG_HOST: str = "localhost"
    PG_PORT: str = "5432"
    PG_USER: str = "devboard_admin"
    PG_PASSWORD: str = "secure_devboard_pass"
    PG_DB: str = "devboard_core"
    
    @property
    def sqlalchemy_database_uri(self) -> str:
        return f"postgresql://{self.PG_USER}:{self.PG_PASSWORD}@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DB}"
    
    # MongoDB Configuration
    MONGO_HOST: str = "localhost"
    MONGO_PORT: str = "27017"
    MONGO_USER: str = "devboard_admin"
    MONGO_PASSWORD: str = "secure_devboard_pass"
    MONGO_DB: str = "devboard_core"

    @property
    def mongo_database_uri(self) -> str:
        return f"mongodb://{self.MONGO_USER}:{self.MONGO_PASSWORD}@{self.MONGO_HOST}:{self.MONGO_PORT}/?authSource=admin"

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

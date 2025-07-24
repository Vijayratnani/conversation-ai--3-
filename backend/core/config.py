from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()

# Debug log
print("DATABASE_URL loaded:", settings.DATABASE_URL)
print("Exists in env:", os.getenv("DATABASE_URL"))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.declarative import DeclarativeMeta
from typing import AsyncGenerator
from core.config import settings

DATABASE_URL = settings.DATABASE_URL

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Async sessionmaker
async_session = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Dependency override for FastAPI
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

# Base class for models
Base: DeclarativeMeta = declarative_base()

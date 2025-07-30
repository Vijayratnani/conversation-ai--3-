import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from db.base import Base
from core.config import settings

DATABASE_URL = settings.DATABASE_URL
print("DATABASE_URL loaded:", DATABASE_URL)

engine = create_async_engine(DATABASE_URL, echo=True)

# ✅ Drop and recreate tables
async def create_all():
    async with engine.begin() as conn:
        print("🗑️ Dropping all existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("✅ All tables dropped.")

        print("🛠️ Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ All tables created successfully.")

if __name__ == "__main__":
    asyncio.run(create_all())

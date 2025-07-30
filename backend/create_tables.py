import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from db.base import Base
from core.config import settings

from scripts.seed.seed_agents import seed_agents
from scripts.seed.seed_calls import seed_calls
from scripts.seed.seed_products import seed_products
from scripts.seed.seed_script_adherence import seed_script_adherence
from scripts.seed.seed_product_knowledge_score import seed_product_knowledge_score
from scripts.seed.seed_call_analysis_metadata import seed_call_analysis_metadata

# ✅ Database URL and engine setup
DATABASE_URL = settings.DATABASE_URL
print("DATABASE_URL loaded:", DATABASE_URL)

engine = create_async_engine(DATABASE_URL, echo=True)

# ✅ Session factory
async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)

# ✅ Drop and recreate tables
async def create_all():
    async with engine.begin() as conn:
        print("🗑️ Dropping all existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("✅ All tables dropped.")

        print("🛠️ Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ All tables created successfully.")

# ✅ Seed data
async def seed_all():
    async with async_session() as db:
        await seed_products(db)
        await seed_agents(db)

        calls = await seed_calls(db)  # ⬅️ Get seeded calls to pass to next
        await seed_script_adherence(db, calls=calls)

        await seed_product_knowledge_score(db)
        await seed_call_analysis_metadata(db)
        await db.commit()
    print("✅ All data seeded successfully.")

# ✅ Run
async def main():
    await create_all()
    await seed_all()

if __name__ == "__main__":
    asyncio.run(main())

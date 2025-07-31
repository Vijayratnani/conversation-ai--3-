from .seed_config import fake, NUM_PRODUCTS
from models.product import Product
import asyncio

async def seed_products(db):
    try:
        records = []

        
        for _ in range(NUM_PRODUCTS):
            record = Product(
                name=fake.unique.word().title(),
                category=fake.word().title()
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records
        # commit will be handled in seed_all.py

    except Exception as e:
        raise Exception(f"Error while seeding product: {e}") 
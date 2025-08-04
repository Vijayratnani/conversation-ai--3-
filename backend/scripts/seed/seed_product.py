from .seed_config import fake
from models.product import Product
import asyncio

DASHBOARD_PRODUCTS = [
    {"name": "Credit Cards", "category": "Banking"},
    {"name": "Personal Loans", "category": "Loans"},
    {"name": "Savings Accounts", "category": "Accounts"},
    {"name": "Mortgages", "category": "Loans"},
    {"name": "Investment Products", "category": "Investments"},
]

async def seed_products(db):
    try:
        records = []
        for item in DASHBOARD_PRODUCTS:
            record = Product(
                name=item["name"],
                category=item["category"]
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)  # Yield control to event loop
        return records  # Commit handled in seed_all.py

    except Exception as e:
        raise Exception(f"Error while seeding products: {e}")

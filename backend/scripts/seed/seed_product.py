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

        product_options = [
            ("Credit Cards", "Cards"),
            ("Personal Loans", "Loans"),
            ("Savings Account", "Accounts"),
            ("Investment Products", "Investments"),
            ("Mortgages", "Home Financing")
        ]

        for product_name, product_category in product_options:

            #From here the database tables entry starts(please hardcode data in variable above this )
            record = Product(
                name=product_name,
                category=product_category,
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)  # Yield control to event loop
        return records  # Commit handled in seed_all.py

    except Exception as e:
        raise Exception(f"Error while seeding products: {e}")

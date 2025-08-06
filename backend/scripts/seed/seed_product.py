from .seed_config import fake, NUM_PRODUCTS
from models.product import Product
import asyncio

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
        await asyncio.sleep(0)
        return records
        # commit will be handled in seed_all.py

    except Exception as e:
        raise Exception(f"Error while seeding product: {e}") 
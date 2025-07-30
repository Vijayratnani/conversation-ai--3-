# seed_customer.py

from .seed_config import fake, NUM_CUSTOMERS
from models.customer import Customer  # adjust the import path accordingly
import uuid
import asyncio

async def seed_customers(db):
    try:
        records = []

        for _ in range(NUM_CUSTOMERS):
            record = Customer(
                identifier=str(uuid.uuid4()),  # unique identifier as UUID string
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding customer: {e}") 
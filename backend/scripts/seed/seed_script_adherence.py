from .seed_config import fake, NUM_PRODUCTS, NUM_CALLS_PER_AGENT
from models.script_adherence import ScriptAdherence
import random
import asyncio

async def seed_script_adherence(db, call_ids, product_ids):
    try:
        """
        call_ids: list of existing call UUIDs from seeded calls
        product_ids: list of existing product IDs
        """
        records = []
        
        # Limit to min of actual IDs or configured max counts
        max_records = min(len(call_ids), len(product_ids), NUM_CALLS_PER_AGENT, NUM_PRODUCTS)

        for _ in range(max_records):
            record = ScriptAdherence(
                call_id=random.choice(call_ids),
                product_id=random.choice(product_ids),
                score=round(random.uniform(50, 100), 2),
                trend_from_previous=round(random.uniform(-10, 10), 2),
                top_missed_area=fake.sentence(nb_words=5),
                assessment_date=fake.date_between(start_date='-1y', end_date='today')
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records
        # commit will be handled in seed_all.py

    except Exception as e:
        raise Exception(f"Error while seeding script_adherence: {e}") 
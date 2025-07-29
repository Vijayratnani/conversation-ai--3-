from faker import Faker
from .seed_config import fake, NUM_CUSTOMERS  # Adjust NUM_CUSTOMERS or add relevant count if needed
from models.missed_script_point import MissedScriptPoint
import asyncio
import random

async def seed_missed_script_points(db, adherence_ids):
    try:
        records = []
        for _ in range(len(adherence_ids)):
            record = MissedScriptPoint(
                adherence_id=random.choice(adherence_ids),
                point_description=fake.sentence(nb_words=10),
                frequency=fake.random_int(min=1, max=5),
                impact=fake.paragraph(nb_sentences=2),
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding missed_script_points: {e}")
# seed_call_environment_factor.py

from .seed_config import fake, NUM_CALLS_PER_AGENT
from models.call_environment_factor import CallEnvironmentFactor  # adjust import path accordingly
import random
from uuid import uuid4
import asyncio

async def seed_call_environment_factor(db, call_ids):
    try:
        records = []
        noise_types = ["Background Music", "Echo", "Static", "Crowd Noise", "Silence"]

        for call_id in call_ids:
            record = CallEnvironmentFactor(
                call_id=call_id,  # Use actual call_id from seeded calls
                noise_type=random.choice(noise_types),
                detection_count=random.randint(1, 5),
                confidence_score=round(random.uniform(0.7, 1.0), 2)
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding call_environment_factor: {e}") 
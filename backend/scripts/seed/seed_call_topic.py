# seed_call_topic.py

from .seed_config import fake, NUM_CALLS_PER_AGENT
from models.call_topic import CallTopic  # adjust import path accordingly
import random
from uuid import uuid4
import asyncio

async def seed_call_topic(db, call_ids, topic_ids):
    try:
        records = []
        for call_id in call_ids:
            for topic_id in random.sample(topic_ids, k=min(3, len(topic_ids))):  # up to 3 topics per call
                record = CallTopic(
                    call_id=call_id,
                    topic_id=topic_id,
                    mention_count=random.randint(1, 10)
                )
                records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records
    except Exception as e:
        raise Exception(f"Error while seeding call_topic: {e}")
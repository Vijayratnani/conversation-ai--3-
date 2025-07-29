from .seed_config import fake, NUM_CALLS_PER_AGENT
from models.transcript import Transcript
import random
import asyncio

async def seed_transcripts(db, calls, num_records=100):
    try:
        records = []

        speakers = ['agent', 'customer']

        for _ in range(num_records):
            call = random.choice(calls)  # calls should be list of call objects

            record = Transcript(
                call_id=call.call_id,
                speaker=random.choice(speakers),
                speaker_name=fake.name(),
                timestamp_in_call_seconds=fake.random_int(min=0, max=call.duration_seconds or 3600),
                original_text=fake.paragraph(nb_sentences=3),
                translated_text=fake.sentence() if random.choice([True, False]) else None,
                is_sensitive=random.choice([True, False]),
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records # return seeded transcripts for use in other seed files

    except Exception as e:
        raise Exception(f"Error while seeding seed_transcripts: {e}") 
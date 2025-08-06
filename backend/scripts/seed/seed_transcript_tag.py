from .seed_config import fake, NUM_CALLS_PER_AGENT
from models.transcript_tag import TranscriptTag
import asyncio

async def seed_transcript_tags(db, transcripts_ids, num_records=50):  # Provide transcripts to link tags to
    try:
        records = []
        tag_types = ['keyword', 'entity', 'action', 'sentiment']
        variants = ['positive', 'negative', 'neutral', None]

        # For demo, generate tags linked to random transcripts
        for _ in range(num_records):
            transcript_id = fake.random_element(transcripts_ids)  # transcripts should be list of transcript objects or IDs

            #From here the database tables entry starts(please hardcode data in variable above this)
            record = TranscriptTag(
                transcript_id=transcript_id,
                type=fake.random_element(tag_types),
                text=fake.word(),
                variant=fake.random_element(variants),
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding transcript_tags: {e}") 
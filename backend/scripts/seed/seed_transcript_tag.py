from .seed_config import fake, NUM_CALLS_PER_AGENT
from models.transcript_tag import TranscriptTag
import asyncio

async def seed_transcript_tags(db, transcripts, num_records=50):  # Provide transcripts to link tags to
    try:
        records = []
        tag_types = ['keyword', 'entity', 'action', 'sentiment']
        variants = ['positive', 'negative', 'neutral', None]

        # For demo, generate tags linked to random transcripts
        for _ in range(num_records):
            transcript = fake.random_element(transcripts)  # transcripts should be list of transcript objects or IDs

            record = TranscriptTag(
                transcript_id=transcript,
                type=fake.random_element(tag_types),
                text=fake.word(),
                variant=fake.random_element(variants),
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding call_environment_factor: {e}") 
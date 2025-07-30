# seed_call.py

from .seed_config import fake, NUM_CALLS_PER_AGENT, NUM_AGENTS, NUM_CUSTOMERS
from models.call import Call  # adjust import path
import random
from uuid import uuid4
import asyncio

async def seed_calls(db):
    try:
        records = []

        agent_ids = list(range(1, NUM_AGENTS + 1))
        customer_ids = list(range(1, NUM_CUSTOMERS + 1))
        
        for _ in range(NUM_CALLS_PER_AGENT * NUM_AGENTS):
            call_time = fake.date_time_between(start_date='-1y', end_date='now')
            duration = random.randint(30, 3600)  # seconds between 30 sec and 1 hour
            direction = random.choice(['inbound', 'outbound'])
            outcome = random.choice(['resolved', 'unresolved', 'escalated', 'no answer'])
            customer_sentiment_choices = ['positive', 'neutral', 'negative', 'mixed']
            agent_sentiment_choices = ['positive', 'neutral', 'negative', 'mixed']
            flagged = fake.boolean(chance_of_getting_true=10)
            sensitive_info = fake.boolean(chance_of_getting_true=5)
            transcript_available = fake.boolean(chance_of_getting_true=80)

            record = Call(
                call_id=uuid4(),
                agent_id=random.choice(agent_ids),
                customer_id=random.choice(customer_ids),
                call_timestamp=call_time,
                duration_seconds=duration,
                direction=direction,
                outcome=outcome,
                customer_sentiment=random.choice(customer_sentiment_choices),
                agent_sentiment=random.choice(agent_sentiment_choices),
                flagged_for_review=flagged,
                summary=fake.text(max_nb_chars=200),
                next_action=fake.text(max_nb_chars=100),
                contains_sensitive_info=sensitive_info,
                transcript_available=transcript_available,
                agent_talk_time_seconds=random.randint(10, duration),
                customer_talk_time_seconds=random.randint(10, duration),
                silence_duration_seconds=random.randint(0, 300),
                interruptions=random.randint(0, 5),
                compliance_score=round(random.uniform(0, 100), 2),
                audio_recording_url=fake.url(),
                analysis_metadata=None,
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding call_environment_factor: {e}") 
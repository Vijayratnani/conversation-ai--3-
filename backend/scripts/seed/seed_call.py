from .seed_config import fake, NUM_CALLS_PER_AGENT, NUM_AGENTS, NUM_CUSTOMERS
from models.call import Call
from uuid import uuid4
import random
import asyncio

# Mapping outcome to associated keywords (used in 'keywords' column)
OUTCOME_KEYWORDS = {
    "Resolved": "Billing, Service Upgrade, Discount",
    "Escalated": "Service Complaint, Refund Request, Manager Escalation",
    "Dropped": "Technical Issue, Connection Problem, Troubleshooting"
}

CUSTOMER_SENTIMENT_CHOICES = ["Positive", "Negative", "Neutral"]
AGENT_SENTIMENT_CHOICES = ["Empathetic", "Frustrated", "Professional"]
DIRECTIONS = ["inbound", "outbound"]
OUTCOMES = list(OUTCOME_KEYWORDS.keys())

from datetime import datetime, timedelta, timezone

now = datetime.now(timezone.utc)
two_months_ago = now - timedelta(days=60)  # approx. 2 months


async def seed_calls(db, agent_ids, customer_ids):
    try:
        records = []

        for _ in range(NUM_CALLS_PER_AGENT * NUM_AGENTS):
            # Random call data generation
            call_time = fake.date_time_between(start_date=two_months_ago, end_date=now)
            duration = random.randint(30, 3600)

            outcome = random.choice(OUTCOMES)
            direction = random.choice(DIRECTIONS)
            keywords = OUTCOME_KEYWORDS[outcome]

            # Generate record
            record = Call(
                call_id=uuid4(),
                agent_id=random.choice(agent_ids),
                customer_id=random.choice(customer_ids),
                call_timestamp=call_time,
                duration_seconds=duration,
                direction=direction,
                outcome=outcome,
                customer_sentiment=random.choice(CUSTOMER_SENTIMENT_CHOICES),
                agent_sentiment=random.choice(AGENT_SENTIMENT_CHOICES),
                flagged_for_review=fake.boolean(chance_of_getting_true=10),
                summary=fake.text(max_nb_chars=200),
                next_action=fake.text(max_nb_chars=100),
                contains_sensitive_info=fake.boolean(chance_of_getting_true=5),
                transcript_available=fake.boolean(chance_of_getting_true=80),
                agent_talk_time_seconds=random.randint(10, duration),
                customer_talk_time_seconds=random.randint(10, duration),
                silence_duration_seconds=random.randint(0, 300),
                interruptions=random.randint(0, 5),
                compliance_score=round(random.uniform(0, 100), 2),
                audio_recording_url=fake.url(),
                keywords=keywords,
            )

            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)  # Yield to event loop
        return records

    except Exception as e:
        raise Exception(f"Error while seeding calls: {e}")

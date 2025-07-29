# seed_call_analysis_metadata.py

from .seed_config import fake, NUM_CALLS_PER_AGENT
from models.call_analysis_metadata import CallAnalysisMetadata  # adjust import path accordingly
import random
import asyncio

async def seed_call_analysis_metadata(db):
    try:
        records = []
        for _ in range(NUM_CALLS_PER_AGENT):
            record = CallAnalysisMetadata(
                sentiment=random.choice(["positive", "neutral", "negative"]),
                emotions=[random.choice(["happy", "angry", "sad", "surprised"]) for _ in range(random.randint(1,3))],
                intent=[random.choice(["inquire", "complain", "purchase", "feedback"]) for _ in range(random.randint(1,3))],
                threat=random.choice([True, False]),
                churn_risk=random.choice(["low", "medium", "high"]),
                entities=[fake.word() for _ in range(random.randint(1,3))],
                opportunity_detected=random.choice([True, False]),
                agent_responded=random.choice([True, False]),
                agent_response_score=round(random.uniform(0, 10), 2),
                compliance_score=round(random.uniform(0, 10), 2),
                customer_behavior={"tone": random.choice(["polite", "angry", "calm"])},
                product_mentions={"products": [fake.word() for _ in range(random.randint(1,3))]},
                service_mentions={"services": [fake.word() for _ in range(random.randint(1,3))]},
                agent_mentions={"agents": [fake.name() for _ in range(random.randint(1,2))]},
                customer_wishes={"wishes": [fake.sentence() for _ in range(random.randint(1,2))]},
                raw_json={"full_analysis": fake.text()}
            )
        
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records
    
    except Exception as e:
        raise Exception(f"Error while seeding call_analysis_metadata: {e}") 

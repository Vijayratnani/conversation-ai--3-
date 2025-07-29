from faker import Faker
from datetime import date, timedelta
from .seed_config import fake, NUM_AGENTS, NUM_PRODUCTS
from models.product_knowledge_score import ProductKnowledgeScore
import asyncio
import itertools

async def seed_product_knowledge_scores(db, agent_ids, product_ids):
    try:
        records = []
        for agent_id, product_id in itertools.product(agent_ids, product_ids):
            random_days_ago = fake.random_int(min=0, max=30)
            assessment_date = date.today() - timedelta(days=random_days_ago)
            record = ProductKnowledgeScore(
                agent_id=agent_id,
                product_id=product_id,
                score=round(fake.pyfloat(left_digits=2, right_digits=2, min_value=0, max_value=100), 2),
                issues_noted=fake.sentence(nb_words=12),
                assessment_date=assessment_date
            )
            records.append(record)
        db.add_all(records)
        await asyncio.sleep(0)
        return records
    except Exception as e:
        raise Exception(f"Error while seeding product_knowledge_scores: {e}")
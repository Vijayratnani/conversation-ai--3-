from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import random
from models.product_knowledge_score import ProductKnowledgeScore

today = datetime.today()
start_this_month = today.replace(day=1)
start_last_month = start_this_month - relativedelta(months=1)
start_two_months_ago = start_this_month - relativedelta(months=2)

async def seed_product_knowledge_score(db):
    scores = []

    for agent_id in range(1, 4):
        for product_id in range(1, 4):
            for month_start in [start_two_months_ago, start_last_month, start_this_month]:
                scores.append(ProductKnowledgeScore(
                    agent_id=agent_id,
                    product_id=product_id,
                    score=random.randint(60, 100),
                    assessment_date=month_start + timedelta(days=agent_id)
                ))

    db.add_all(scores)
    await db.commit()

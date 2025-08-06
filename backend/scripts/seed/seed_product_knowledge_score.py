from faker import Faker
from datetime import date, timedelta
from .seed_config import fake, NUM_AGENTS, NUM_PRODUCTS
from models.product_knowledge_score import ProductKnowledgeScore
import asyncio
import itertools
import random

async def seed_product_knowledge_scores(db, agent_ids, product_ids):
    try:
        records = []

        #HardCoded Code Starts Here
        today = date.today()
        # start_of_month = today.replace(day=1)
        # days_range = (today - start_of_month).days + 1  # Include today

        # ✅ Hardcoded issues per product_id
        product_issues_map = {
            1: "Minor hesitation on premium features",              # <--- product_id 1
            2: "Incomplete information on eligibility criteria",             # <--- product_id 2
            3: "Minor delay in explaining minimum balance requirement",            # <--- product_id 3
            4: "Significant knowledge gaps on returns calculation",              # <--- product_id 4
            5: "Slight hesitation on fixed vs. variable rate options",          # <--- product_id 5
        }

        # # ✅ Custom score ranges or fixed values per product_id
        # product_score_map = {
        #     1: (90, 95),  # Credit Cards
        #     2: (80, 88),  # Personal Loans
        #     3: (90, 95),  # Savings Accounts
        #     4: (45, 65),  # Investments
        #     5: (85, 92),  # Mortgages
        # }

         # ✅ Score ranges for current and previous months
        product_score_map_by_month = {
            "current": {
                1: (90, 95), # Credit Cards
                2: (80, 88), # Personal Loans
                3: (90, 95), # Savings Accounts
                4: (45, 65), # Investments
                5: (85, 92), # Mortgages
            },
            "previous": {
                1: (85, 92),
                2: (75, 83),
                3: (85, 92),
                4: (40, 60),
                5: (80, 88),
            },
        }

        # ✅ Calculate the first day of current and previous months
        first_of_current_month = today.replace(day=1)
        first_of_previous_month = (first_of_current_month - timedelta(days=1)).replace(day=1)

        for agent_id, product_id in zip(agent_ids, product_ids):
            if product_id not in product_issues_map:
             raise ValueError(f"No issue defined for product_id {product_id}")

            for month_key, assessment_date in [("current", first_of_current_month), ("previous", first_of_previous_month)]:
                score_range = product_score_map_by_month[month_key][product_id]
                score = round(random.uniform(*score_range), 2)  # <--- generate score within range
                issue = product_issues_map[product_id]
            
                #From here the database tables entry starts(please hardcode data in variable above this)
                record = ProductKnowledgeScore(
                    agent_id=agent_id,
                    product_id=product_id,
                    score=score,
                    issues_noted=issue,
                    assessment_date=assessment_date
                )
                records.append(record)
        db.add_all(records)
        await asyncio.sleep(0)
        return records
    except Exception as e:
        raise Exception(f"Error while seeding product_knowledge_scores: {e}")
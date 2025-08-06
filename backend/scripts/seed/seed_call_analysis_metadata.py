# seed_call_analysis_metadata.py

from .seed_config import fake
from models.call_analysis_metadata import CallAnalysisMetadata
from datetime import datetime, timedelta, timezone
import random

PRODUCT_STATS_CONFIG = [
    {
        "product": "Credit Cards",
        "share_percent": 42,
        "top_issue": "Transaction disputes",
        "recent_count": 84,
        "past_count": 78,
    },
    {
        "product": "Personal Loans",
        "share_percent": 35,
        "top_issue": "Application delays",
        "recent_count": 70,
        "past_count": 67,
    },
    {
        "product": "Savings Accounts",
        "share_percent": 28,
        "top_issue": "Interest rate concerns",
        "recent_count": 56,
        "past_count": 58,
    },
    {
        "product": "Mortgages",
        "share_percent": 22,
        "top_issue": "Refinancing questions",
        "recent_count": 44,
        "past_count": 43,
    },
    {
        "product": "Investment Products",
        "share_percent": 18,
        "top_issue": "Performance concerns",
        "recent_count": 36,
        "past_count": 34,
    },
]


def generate_call(product_name, issue, created_at, call_id, force_valid=True):
    """
    force_valid ensures the call will be counted in dashboard queries.
    """
    # If force_valid is True, these fields are fixed to ensure dashboard match.
    if force_valid:
        issue_detected = True
        intent = ["complaint"]
    else:
        issue_detected = random.choice([True, False])
        intent = random.choices(["complaint", "inquiry", "feedback"], weights=[0.7, 0.2, 0.1], k=1)

    return CallAnalysisMetadata(
        call_id=call_id,
        sentiment=random.choice(["negative", "neutral"]),
        emotions=[random.choice(["angry", "frustrated", "sad"])],
        intent=intent,
        threat=random.choice([False, False, True]),
        churn_risk=random.choice(["medium", "high"]),
        entities=["fee", "wait time"],
        opportunity_detected=False,
        agent_responded=True,
        agent_response_score=round(random.uniform(3.0, 6.0), 2),
        compliance_score=round(random.uniform(70.0, 90.0), 2),
        customer_behavior={"tone": "angry"},
        product_mentions=[
            {
                "product": product_name,
                "issue_detected": issue_detected,
                "problem_keywords": [issue, fake.word()]
            }
        ],
        service_mentions={"services": [fake.word()]},
        agent_mentions={"agents": [fake.name()]},
        customer_wishes={"wishes": [fake.sentence()]},
        raw_json={"full_analysis": fake.text()},
        created_at=created_at
    )


async def seed_call_analysis_metadata(db, call_ids):
    try:
        records = []
        call_id_index = 0

        for stat in PRODUCT_STATS_CONFIG:
            product = stat["product"]
            issue = stat["top_issue"]
            recent_count = stat["recent_count"]
            past_count = stat["past_count"]

            # Seed recent (last 30 days)
            for i in range(recent_count):
                if call_id_index >= len(call_ids):
                    print(f"[WARN] Ran out of call_ids while seeding {product}")
                    break

                force_valid = (i == 0)  # Ensure at least one valid complaint per product
                record = generate_call(
                    product,
                    issue,
                    datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30)),
                    call_ids[call_id_index],
                    force_valid=force_valid
                )
                records.append(record)
                call_id_index += 1

            # Seed past (30–60 days ago)
            for _ in range(past_count):
                if call_id_index >= len(call_ids):
                    print(f"[WARN] Ran out of call_ids while seeding {product}")
                    break

                record = generate_call(
                    product,
                    issue,
                    datetime.now(timezone.utc) - timedelta(days=random.randint(31, 60)),
                    call_ids[call_id_index],
                    force_valid=False  # Past doesn't affect current dashboard stats
                )
                records.append(record)
                call_id_index += 1

        db.add_all(records)
        await db.commit()
        return records

    except Exception as e:
        await db.rollback()
        raise Exception(f"Error while seeding call_analysis_metadata: {e}")

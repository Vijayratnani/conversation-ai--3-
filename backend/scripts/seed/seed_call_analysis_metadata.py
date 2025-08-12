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


def generate_call_metadata(
    product_name,
    issue,
    created_at,
    call_id,
    sentiment="negative",
    force_valid=True,
    opportunity_detected=False,
    agent_responded=True,
    cross_sell=False,
    cross_sell_success=False,
    missed_keywords=None,
):
    issue_detected = True if force_valid else random.choice([True, False])
    intent = ["complaint"] if force_valid else [random.choice(["complaint", "inquiry", "feedback"])]

    product_mentions = [
        {
            "product": product_name,
            "keywords": [issue],
            "sentiment": sentiment,
            "emotions": [random.choice(["anger", "frustration", "sadness"])],
            "problem_keywords": [issue],
            "opportunity_keywords": [],
            "issue_detected": issue_detected,
            "opportunity_detected": opportunity_detected,
        }
    ]

    if cross_sell:
        product_mentions.append({
            "product": f"Upsell {product_name}",
            "converted": cross_sell_success
        })

    customer_wishes_json = [
        {
            "wish": f"faster {issue.lower()} resolution",
            "category": product_name,
            "detected_keywords": [issue, "delay"],
            "sentiment": sentiment,
            "urgency": random.choice(["medium", "high"]),
        }
    ]

    raw_json = {
        "call_id": str(call_id),
        "sentiment": sentiment,
        "emotions": [random.choice(["anger", "frustration"])],
        "intent": intent,
        "threat": random.choice([True, False]),
        "churn_risk": random.choice(["medium", "high"]),
        "entities": ["fee", "wait time", issue],
        "opportunity_detected": opportunity_detected,
        "agent_responded": agent_responded,
        "agent_response_score": round(random.uniform(0.6, 1.0), 2),
        "compliance_score": round(random.uniform(70.0, 90.0), 2),
        "product_mentions": product_mentions,
        "service_mentions": [
            {
                "service": "customer support",
                "keywords": ["delay"],
                "sentiment": "negative",
                "emotions": ["anger"],
                "problem_keywords": ["delay"],
                "opportunity_keywords": [],
                "issue_detected": True,
                "opportunity_detected": False
            }
        ],
        "agent_mentions": [
            {
                "aspect": "responsiveness",
                "keywords": ["did not respond", "delay"],
                "sentiment": "negative",
                "emotions": ["anger", "frustration"],
                "problem_keywords": ["did not respond", "delay"],
                "opportunity_keywords": [],
                "issue_detected": True,
                "coaching_opportunity": True
            }
        ],
        "customer_behavior": {
            "traits": ["frustrated", "demanding"],
            "emotions": ["anger", "frustration"],
            "sentiment": "negative",
            "detected_keywords": [issue, "delay"]
        },
        "customer_wishes": customer_wishes_json
    }

    return CallAnalysisMetadata(
        call_id=call_id,
        sentiment=sentiment,
        emotions=raw_json["emotions"],
        intent=intent,
        threat=raw_json["threat"],
        churn_risk=raw_json["churn_risk"],
        entities=raw_json["entities"],
        opportunity_detected=opportunity_detected,
        agent_responded=agent_responded,
        agent_response_score=raw_json["agent_response_score"],
        compliance_score=raw_json["compliance_score"],
        customer_behavior=raw_json["customer_behavior"],
        product_mentions=product_mentions,
        service_mentions={"services": ["online application"]},
        agent_mentions={"agents": ["John Smith"]},
        customer_wishes={"wishes": [w["wish"] for w in customer_wishes_json]},
        raw_json=raw_json,
        created_at=created_at,
    )


async def seed_call_analysis_metadata(db, call_ids):
    try:
        records = []
        call_id_index = 0

        # ✅ Prepend 3 sales effectiveness test records
        test_sales_records = [
            generate_call_metadata(
                "Credit Cards",
                "Transaction disputes",
                datetime.now(timezone.utc),
                call_ids[0],
                opportunity_detected=True,
                agent_responded=True,
                cross_sell=True,
                cross_sell_success=True,
            ),
            generate_call_metadata(
                "Personal Loans",
                "Application delays",
                datetime.now(timezone.utc),
                call_ids[1],
                opportunity_detected=True,
                agent_responded=False,
                cross_sell=False,
                missed_keywords=["lower interest", "faster approval"],
            ),
            generate_call_metadata(
                "Savings Accounts",
                "Interest rate concerns",
                datetime.now(timezone.utc),
                call_ids[2],
                opportunity_detected=True,
                agent_responded=True,
                cross_sell=True,
                cross_sell_success=False,
            ),
        ]

        records.extend(test_sales_records)
        call_id_index = 3  # reserve first 3 for testing

        # 🔁 Continue regular product stats seeding
        for stat in PRODUCT_STATS_CONFIG:
            product = stat["product"]
            issue = stat["top_issue"]
            recent_count = stat["recent_count"]
            past_count = stat["past_count"]

            # Recent (last 30 days)
            for i in range(recent_count):
                if call_id_index >= len(call_ids):
                    print(f"[WARN] Ran out of call_ids while seeding {product}")
                    break
                force_valid = i == 0
                record = generate_call_metadata(
                    product,
                    issue,
                    datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30)),
                    call_ids[call_id_index],
                    force_valid=force_valid
                )
                records.append(record)
                call_id_index += 1

            # Past (30–60 days ago)
            for _ in range(past_count):
                if call_id_index >= len(call_ids):
                    print(f"[WARN] Ran out of call_ids while seeding {product}")
                    break
                record = generate_call_metadata(
                    product,
                    issue,
                    datetime.now(timezone.utc) - timedelta(days=random.randint(31, 60)),
                    call_ids[call_id_index],
                    force_valid=False
                )
                records.append(record)
                call_id_index += 1

        db.add_all(records)
        await db.commit()
        return records

    except Exception as e:
        await db.rollback()
        raise Exception(f"Error while seeding call_analysis_metadata: {e}")

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import random
from models.call_analysis_metadata import CallAnalysisMetadata

today = datetime.today()
start_this_month = today.replace(day=1)
start_last_month = start_this_month - relativedelta(months=1)
start_two_months_ago = start_this_month - relativedelta(months=2)

async def seed_call_analysis_metadata(db):
    rows = []
    product_names = ["VocaCRM", "CallTrackPro", "SalesBuddy"]
    keywords = [["slow", "buggy"], ["delay", "timeout"], ["error", "crash"]]

    for month_start in [start_two_months_ago, start_last_month, start_this_month]:
        for i in range(10):  # 10 entries per month
            idx = i % 3
            rows.append(CallAnalysisMetadata(
                created_at=month_start + timedelta(days=i),
                intent=["complaint"],
                product_mentions=[
                    {
                        "product": product_names[idx],
                        "issue_detected": True,
                        "problem_keywords": keywords[idx]
                    }
                ],
                opportunity_detected=bool(i % 2),
                agent_responded=True,
                agent_response_score=round(random.uniform(0.4, 1.0), 2),
            ))

    db.add_all(rows)
    await db.commit()

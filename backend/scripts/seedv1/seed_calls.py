from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import random
import uuid
from models.call import Call
from sqlalchemy.ext.asyncio import AsyncSession

today = datetime.today()
start_this_month = today.replace(day=1)
start_last_month = start_this_month - relativedelta(months=1)
start_two_months_ago = start_this_month - relativedelta(months=2)

async def seed_calls(db: AsyncSession):
    calls = []

    for month_start in [start_two_months_ago, start_last_month, start_this_month]:
        for i in range(10):  # 10 calls per month
            calls.append(Call(
                call_id=uuid.uuid4(),  # ✅ explicitly assign UUID
                call_timestamp=month_start + timedelta(days=i),
                duration_seconds=random.randint(200, 800),
                direction="inbound",
                outcome="resolved",
                customer_sentiment=random.choice(["positive", "neutral", "negative"]),
                agent_sentiment=random.choice(["positive", "neutral", "negative"]),
                flagged_for_review=False,
                summary="Call summary",
                next_action="Follow-up",
                transcript_available=True,
                agent_talk_time_seconds=random.randint(100, 400),
                customer_talk_time_seconds=random.randint(100, 400),
                silence_duration_seconds=random.randint(5, 25),
                interruptions=random.randint(0, 2),
                compliance_score=round(random.uniform(3.0, 5.0), 2),
            ))

    db.add_all(calls)
    await db.flush()  # ✅ makes call_id available for foreign keys
    return calls       # ✅ return the list of seeded calls

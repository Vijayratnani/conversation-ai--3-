from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from models import CallEnvironmentFactor, CallAnalysisMetadata # CallTopic, Topic,
from models import Agent, Call # , ProductKnowledgeScore
# from schemas.strategic_insights import GrowthOpportunity
# from typing import List
from datetime import datetime, timedelta, timezone
# from sqlalchemy import case
from services.risk_rules import risk_rules

now = datetime.now(timezone.utc)
last_30_days = now - timedelta(days=30)
last_60_days = now - timedelta(days=60)

async def get_strategic_insights_data(db: AsyncSession) -> dict:
    # ========== 2. Agent Avg. Quality Score ==========
    agent_score_query = select(func.avg(CallAnalysisMetadata.agent_response_score))
    agent_score_result = await db.execute(agent_score_query)
    agent_avg_score = round(agent_score_result.scalar() or 0, 2)

    # ========== 2b. Top Agent ==========
    top_agent_query = (
        select(
            Agent.name,
            func.avg(CallAnalysisMetadata.agent_response_score).label("avg_score")
        )
        .select_from(CallAnalysisMetadata)
        .join(Call, Call.call_id == CallAnalysisMetadata.call_id)
        .join(Agent, Agent.agent_id == Call.agent_id)
        .group_by(Agent.name)
        .order_by(func.avg(CallAnalysisMetadata.agent_response_score).desc())
        .limit(1)
    )
    top_agent_result = await db.execute(top_agent_query)
    top_agent = top_agent_result.first()
    top_agent_name = top_agent[0] if top_agent else "Unknown"
    top_agent_score = round(top_agent[1], 2) if top_agent else 0

    # ========== 2c. Count of Low Performers ==========
    low_performers_query = (
        select(Agent.name)
        .select_from(CallAnalysisMetadata)
        .join(Call, Call.call_id == CallAnalysisMetadata.call_id)
        .join(Agent, Agent.agent_id == Call.agent_id)
        .group_by(Agent.name)
        .having(func.avg(CallAnalysisMetadata.agent_response_score) < 60)
    )
    low_performers_result = await db.execute(low_performers_query)
    needs_coaching_count = len(low_performers_result.all())

    # ========== 3. Risk Indicators ==========
    risk_indicators = []
    for rule in risk_rules:
        result = await rule(db)
        if result:
            risk_indicators.append(result)

    # ========== 4. Call Environment Stats ==========
    env_query = (
        select(CallEnvironmentFactor.noise_type, func.count().label("count"))
        .group_by(CallEnvironmentFactor.noise_type)
        .order_by(desc("count"))
    )
    env_data = await db.execute(env_query)
    environment_stats = [
        {
            "type": noise,
            "label": str(noise).replace("_", " ").title(),
            "detail": f"Detected in {count} calls",
        }
        for noise, count in env_data.all()
    ]

    # ========== 5. Avg. Hold Time ==========
    # Current month
    avg_hold_query = select(func.avg(Call.hold_time_seconds))
    avg_hold_result = await db.execute(avg_hold_query)
    current_avg = avg_hold_result.scalar() or 0

    # Last month
    from datetime import datetime, timedelta
    from dateutil.relativedelta import relativedelta

    today = datetime.today()
    start_this_month = today.replace(day=1)
    start_last_month = start_this_month - relativedelta(months=1)
    end_last_month = start_this_month - timedelta(days=1)

    last_month_query = (
        select(func.avg(Call.hold_time_seconds))
        .where(Call.call_timestamp >= start_last_month)
        .where(Call.call_timestamp < start_this_month)
    )
    last_month_result = await db.execute(last_month_query)
    last_avg = last_month_result.scalar() or 0

    diff_seconds = int(current_avg - last_avg)
    is_improved = diff_seconds < 0

    def format_seconds(sec: float) -> str:
        sec = int(sec)
        minutes, seconds = divmod(sec, 60)
        return f"{minutes}m {seconds}s" if minutes else f"{seconds}s"

    avg_hold_time_stats = {
        "currentAvgHoldTime": format_seconds(current_avg),
        "diffFromLastMonth": f"{'↓' if is_improved else '↑'} {abs(diff_seconds)}s",
        "isImproved": is_improved,
    }

    return {
        # "growthOpportunities": growth_opportunities,
        "agentPerformance": {
            "avgScore": agent_avg_score,
            "topAgent": {
                "name": top_agent_name,
                "score": top_agent_score,
            },
            "needsCoachingCount": needs_coaching_count,
        },
        "riskIndicators": risk_indicators,
        "callEnvironmentStats": environment_stats[:2],
        "avgHoldTimeStats": avg_hold_time_stats,
    }

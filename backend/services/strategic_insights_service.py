from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from models import CallTopic, Topic, CallEnvironmentFactor, CallAnalysisMetadata
from models import Agent, Call, ProductKnowledgeScore
from schemas.strategic_insights import GrowthOpportunity
from typing import List
from datetime import datetime, timedelta, timezone
from sqlalchemy import case

now = datetime.now(timezone.utc)
last_30_days = now - timedelta(days=30)
last_60_days = now - timedelta(days=60)

async def get_strategic_insights_data(db: AsyncSession) -> dict:
    # ========== 1. Growth Opportunities ==========
    topic_query = (
        select(CallTopic.topic_id, func.sum(CallTopic.mention_count).label("mentions"))
        .group_by(CallTopic.topic_id)
        .order_by(desc("mentions"))
        .limit(5)
    )
    topic_rows = await db.execute(topic_query)
    topic_counts = topic_rows.all()

    topic_ids = [tid for tid, _ in topic_counts]
    topics_query = select(Topic).where(Topic.topic_id.in_(topic_ids))
    topics_data = await db.execute(topics_query)
    topic_map = {
        t.topic_id: (str(t.name_en or "Unknown"), str(t.name_ur or "Unknown"))
        for t in topics_data.scalars().all()
    }

    growth_opportunities: List[GrowthOpportunity] = [
        GrowthOpportunity(
            id=str(tid),
            topic=topic_map.get(tid, ("Unknown", ""))[0],
            topicUrdu=topic_map.get(tid, ("", "Unknown"))[1],
            mentions=mentions,
        )
        for tid, mentions in topic_counts
    ]

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
    # Current month low compliance calls
    low_compliance_this_month = (
        select(func.count())
        .select_from(Call)
        .where(Call.call_timestamp >= last_30_days)
        .where(Call.compliance_score < 0.6)
    )
    total_calls_this_month = (
        select(func.count())
        .select_from(Call)
        .where(Call.call_timestamp >= last_30_days)
    )

    # Last month low compliance calls
    low_compliance_last_month = (
        select(func.count())
        .select_from(Call)
        .where(Call.call_timestamp >= last_60_days)
        .where(Call.call_timestamp < last_30_days)
        .where(Call.compliance_score < 0.6)
    )
    total_calls_last_month = (
        select(func.count())
        .select_from(Call)
        .where(Call.call_timestamp >= last_60_days)
        .where(Call.call_timestamp < last_30_days)
    )

    low_this = (await db.execute(low_compliance_this_month)).scalar() or 0
    total_this = (await db.execute(total_calls_this_month)).scalar() or 1
    low_last = (await db.execute(low_compliance_last_month)).scalar() or 0
    total_last = (await db.execute(total_calls_last_month)).scalar() or 1

    rate_this = round(100 * low_this / total_this, 1)
    rate_last = round(100 * low_last / total_last, 1)
    diff = round(rate_this - rate_last, 1)

    risk_indicators.append({
        "title": "Compliance Risk",
        "description": f"{rate_this}% of calls scored < 0.6",
        "trend": f"{'↑' if diff > 0 else '↓'} {abs(diff)}% from last month",
        "color": "text-red-600" if rate_this > 15 else "text-yellow-600" if rate_this > 8 else "text-green-600",
    })

    churn_this_month = (
        select(func.count())
        .select_from(CallAnalysisMetadata)
        .where(CallAnalysisMetadata.created_at >= last_30_days)
        .where(CallAnalysisMetadata.churn_risk == "high")
    )
    total_churn_checks = (
        select(func.count())
        .select_from(CallAnalysisMetadata)
        .where(CallAnalysisMetadata.created_at >= last_30_days)
    )

    churn_count = (await db.execute(churn_this_month)).scalar() or 0
    churn_total = (await db.execute(total_churn_checks)).scalar() or 1
    churn_percent = round(100 * churn_count / churn_total, 1)

    risk_indicators.append({
    "title": "Customer Churn Risk",
    "description": f"{churn_percent}% high-risk interactions",
    "trend": "More churn signs in recent calls" if churn_percent > 10 else "Stable churn signals",
    "color": "text-amber-600" if churn_percent > 10 else "text-green-600"
    })

    low_knowledge_query = (
        select(func.count())
        .select_from(ProductKnowledgeScore)
        .where(ProductKnowledgeScore.assessment_date >= last_30_days)
        .where(ProductKnowledgeScore.score < 50)
    )
    low_knowledge_count = (await db.execute(low_knowledge_query)).scalar() or 0

    risk_indicators.append({
    "title": "Knowledge Gap Risk",
    "description": f"{low_knowledge_count} low scores this month",
    "trend": "Product training needed" if low_knowledge_count > 10 else "Improving scores",
    "color": "text-red-500" if low_knowledge_count > 15 else "text-yellow-600" if low_knowledge_count > 5 else "text-green-600"
    })


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
        "growthOpportunities": growth_opportunities,
        "agentPerformance": {
            "avgScore": agent_avg_score,
            "topAgent": {
                "name": top_agent_name,
                "score": top_agent_score,
            },
            "needsCoachingCount": needs_coaching_count,
        },
        "riskIndicators": risk_indicators,
        "callEnvironmentStats": environment_stats,
        "avgHoldTimeStats": avg_hold_time_stats,
    }

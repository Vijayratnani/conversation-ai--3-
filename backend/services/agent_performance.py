from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from decimal import Decimal
from models.call import Call
from models.script_adherence import ScriptAdherence
from models.product_knowledge_score import ProductKnowledgeScore
from models.agent import Agent
from models.product import Product
from schemas.agent_performance import (
    AgentPerformanceResponse,
    AgentStat,
    TopAgent,
    KnowledgeDistribution,
)

def to_percent(n: float) -> str:
    return f"{round(n or 0, 2)}%"

async def get_agent_performance_data(db: AsyncSession) -> AgentPerformanceResponse:
    today = date.today()
    current_period_start = today - timedelta(days=30)
    previous_period_start = today - timedelta(days=60)
    previous_period_end = today - timedelta(days=30)

    # ────────────── Active Agent Count ──────────────
    active_agents_count = (await db.execute(
        select(func.count()).select_from(Agent).where(Agent.is_active == True)
    )).scalar() or 0


    # ────────────── 1. Avg. Call Quality ──────────────
    current_call_quality = (await db.execute(
        select(func.avg(Call.compliance_score)).where(Call.call_timestamp >= current_period_start)
    )).scalar() or 0

    previous_call_quality = (await db.execute(
        select(func.avg(Call.compliance_score)).where(
            Call.call_timestamp >= previous_period_start,
            Call.call_timestamp < previous_period_end
        )
    )).scalar() or 0

    call_quality_change = current_call_quality - previous_call_quality

    # ────────────── 2. Script Adherence ──────────────
    current_adherence = (await db.execute(
        select(func.avg(ScriptAdherence.score)).where(ScriptAdherence.assessment_date >= current_period_start)
    )).scalar() or 0

    previous_adherence = (await db.execute(
        select(func.avg(ScriptAdherence.score)).where(
            ScriptAdherence.assessment_date >= previous_period_start,
            ScriptAdherence.assessment_date < previous_period_end
        )
    )).scalar() or 0

    adherence_change = current_adherence - previous_adherence

    # ────────────── 3. Avg. Handle Time ──────────────
    current_duration = (await db.execute(
        select(func.avg(Call.duration_seconds)).where(Call.call_timestamp >= current_period_start)
    )).scalar() or 0

    previous_duration = (await db.execute(
        select(func.avg(Call.duration_seconds)).where(
            Call.call_timestamp >= previous_period_start,
            Call.call_timestamp < previous_period_end
        )
    )).scalar() or 0

    duration_change = current_duration - previous_duration

    # ────────────── 4. Customer Satisfaction ──────────────
    current_satisfaction = (await db.execute(
        select(func.avg(Call.compliance_score)).where(Call.call_timestamp >= current_period_start)
    )).scalar() or 0

    previous_satisfaction = (await db.execute(
        select(func.avg(Call.compliance_score)).where(
            Call.call_timestamp >= previous_period_start,
            Call.call_timestamp < previous_period_end
        )
    )).scalar() or 0

    satisfaction_change = current_satisfaction - previous_satisfaction

    # ────────────── Agent KPIs Summary ──────────────
    agent_stats = [
        AgentStat(
            title="Avg. Call Quality",
            value=to_percent(current_call_quality),
            change=to_percent(call_quality_change),
            trend="up" if call_quality_change >= 0 else "down",
        ),
        AgentStat(
            title="Script Adherence",
            value=to_percent(current_adherence),
            change=to_percent(adherence_change),
            trend="up" if adherence_change >= 0 else "down",
        ),
        AgentStat(
            title="Avg. Handle Time",
            value=f"{int(current_duration//60)}:{int(current_duration%60):02}",
            change=f"{'+' if duration_change >= 0 else '-'}{abs(int(duration_change))}s",
            trend="down" if duration_change >= 0 else "up",
        ),
        AgentStat(
            title="Customer Satisfaction",
            value=f"{round(current_satisfaction, 1)}/5",
            change=f"{'+' if satisfaction_change >= 0 else ''}{round(satisfaction_change, 1)} from last period",
            trend="up" if satisfaction_change >= 0 else "down",
        ),
    ]

    # ────────────── Knowledge Distribution ──────────────
    knowledge_q = await db.execute(
        select(
            func.count().filter(ProductKnowledgeScore.score >= 90),
            func.count().filter(ProductKnowledgeScore.score.between(75, 89.99)),
            func.count().filter(ProductKnowledgeScore.score < 75),
            func.avg(ProductKnowledgeScore.score),
        ).where(ProductKnowledgeScore.assessment_date >= current_period_start)
    )
    row = knowledge_q.fetchone()
    excellent, good, needs_improvement, avg_score = row if row else (0, 0, 0, 0)

    previous_knowledge_q = await db.execute(
        select(
            func.count().filter(ProductKnowledgeScore.score >= 90),
            func.count().filter(ProductKnowledgeScore.score.between(75, 89.99)),
            func.count().filter(ProductKnowledgeScore.score < 75),
            func.avg(ProductKnowledgeScore.score),
        ).where(
            ProductKnowledgeScore.assessment_date >= previous_period_start,
            ProductKnowledgeScore.assessment_date < previous_period_end
        )
    )
    prev_row = previous_knowledge_q.fetchone()
    prev_excellent, prev_good, prev_needs_improvement, prev_avg_score = prev_row if prev_row else (0, 0, 0, 0)
    avg_score_trend = (avg_score or Decimal("0.0")) - (prev_avg_score or Decimal("0.0"))
    trend_str = f"{'+' if avg_score_trend >= 0 else ''}{round(avg_score_trend, 1)}%"

    knowledge_distribution = KnowledgeDistribution(
        excellent=excellent or 0,
        good=good or 0,
        needs_improvement=needs_improvement or 0,
        average_score=int(avg_score or 0),
        trend=trend_str,
        excellent_change=(excellent or 0) - (prev_excellent or 0),
        good_change=(good or 0) - (prev_good or 0),
        needs_improvement_change=(needs_improvement or 0) - (prev_needs_improvement or 0),
    )

    # ────────────── Top Performing Agents ──────────────
    top_agents_q = await db.execute(
        select(
            Agent.agent_id,
            Agent.name,
            ProductKnowledgeScore.score,
            Product.name.label("product"),
            Product.product_id
        ).join(ProductKnowledgeScore, ProductKnowledgeScore.agent_id == Agent.agent_id)
        .join(Product, Product.product_id == ProductKnowledgeScore.product_id)
        .where(ProductKnowledgeScore.assessment_date >= current_period_start)
        .order_by(ProductKnowledgeScore.score.desc())
        .limit(3)
    )
    current_rows = top_agents_q.fetchall() or []
    top_agents = []

    for row in current_rows:
        last_score_q = await db.execute(
            select(ProductKnowledgeScore.score).where(
                ProductKnowledgeScore.agent_id == row.agent_id,
                ProductKnowledgeScore.product_id == row.product_id,
                ProductKnowledgeScore.assessment_date >= previous_period_start,
                ProductKnowledgeScore.assessment_date < previous_period_end,
            ).order_by(ProductKnowledgeScore.assessment_date.desc()).limit(1)
        )
        last_score = last_score_q.scalar()
        score_diff = (row.score - last_score) if last_score is not None else 0
        improvement = f"{'+' if score_diff >= 0 else ''}{round(score_diff, 1)}"

        top_agents.append(
            TopAgent(
                name=row.name,
                score=int(row.score),
                product=row.product,
                improvement=improvement + "%",
            )
        )

    return AgentPerformanceResponse(
        agent_stats=agent_stats,
        knowledge_distribution=knowledge_distribution,
        top_agents=top_agents,
        agent_count=active_agents_count,
    )

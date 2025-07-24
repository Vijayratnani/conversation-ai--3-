from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from models.call import Call
from models.agent import Agent
from schemas.call import CallCreate, Call as CallSchema
from .base import CRUDBase


class CRUDCall(CRUDBase[Call, CallCreate, CallCreate]):

    async def get_dashboard_stats(self, db: AsyncSession):
        # Total calls
        total_calls_result = await db.execute(select(func.count(Call.call_id)))
        total_calls = total_calls_result.scalar_one()

        # Average duration
        avg_duration_result = await db.execute(select(func.avg(Call.duration_seconds)))
        avg_duration = avg_duration_result.scalar_one() or 0

        # Sentiment distribution (sample logic: based on sentiment_score if you have it)
        positive_calls = (await db.execute(
            select(func.count(Call.call_id)).where(Call.customer_sentiment == 'positive')
        )).scalar_one()

        negative_calls = (await db.execute(
            select(func.count(Call.call_id)).where(Call.customer_sentiment == 'negative')
        )).scalar_one()

        neutral_calls = total_calls - positive_calls - negative_calls

        # Top performing agents
        agent_performance_query = (
            select(
                Agent.agent_id,
                Agent.name,
                func.count(Call.call_id).label("total_calls"),
                func.avg(Call.duration_seconds).label("average_duration_seconds"),
                func.avg(Call.compliance_score).label("average_compliance_score"),
            )
            .join(Call, Call.agent_id == Agent.agent_id)
            .group_by(Agent.agent_id, Agent.name)
            .order_by(func.avg(Call.compliance_score).desc())
            .limit(5)
        )

        result = await db.execute(agent_performance_query)
        top_agents = result.all()

        # Placeholder growth data — could be extracted from metadata later
        growth_opportunities = {
            "Product Knowledge Gap": 15,
            "Pricing Objections": 25,
            "Competitor Mentions": 18,
        }

        return {
            "total_calls": total_calls,
            "average_call_duration": round(avg_duration, 2),
            "sentiment_distribution": {
                "positive": positive_calls,
                "neutral": neutral_calls,
                "negative": negative_calls,
            },
            "top_performing_agents": [
                {
                    "agent_id": row.agent_id,
                    "agent_name": row.name,
                    "total_calls": row.total_calls,
                    "average_duration_seconds": round(row.average_duration_seconds or 0, 2),
                    "average_compliance_score": round(row.average_compliance_score or 0, 2),
                }
                for row in top_agents
            ],
            "growth_opportunities": growth_opportunities,
        }


# Instance
call = CRUDCall(Call)

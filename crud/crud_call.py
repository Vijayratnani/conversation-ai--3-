from .base import CRUDBase
from models.call import Call
from schemas.call import CallCreate, Call as CallSchema
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from models.agent import Agent

class CRUDCall(CRUDBase[Call, CallCreate, CallCreate]):
    async def get_dashboard_stats(self, db: AsyncSession):
        # Total calls
        total_calls_result = await db.execute(select(func.count(Call.id)))
        total_calls = total_calls_result.scalar_one()

        # Average call duration
        avg_duration_result = await db.execute(select(func.avg(Call.duration_seconds)))
        avg_duration = avg_duration_result.scalar_one() or 0

        # Sentiment distribution
        positive_calls = (await db.execute(select(func.count(Call.id)).where(Call.sentiment_score > 0.5))).scalar_one()
        negative_calls = (await db.execute(select(func.count(Call.id)).where(Call.sentiment_score < -0.5))).scalar_one()
        neutral_calls = total_calls - positive_calls - negative_calls

        # Top performing agents
        agent_performance_query = (
            select(
                Agent.id,
                Agent.name,
                func.count(Call.id).label("total_calls"),
                func.avg(Call.duration_seconds).label("average_duration_seconds"),
                func.avg(Call.sentiment_score).label("average_sentiment"),
            )
            .join(Agent, Call.agent_id == Agent.id)
            .group_by(Agent.id, Agent.name)
            .order_by(func.avg(Call.sentiment_score).desc())
            .limit(5)
        )
        agent_performance_result = await db.execute(agent_performance_query)
        top_agents = agent_performance_result.all()

        # This is a placeholder. In a real app, you'd extract this from analysis_metadata
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
                    "agent_id": agent.id,
                    "agent_name": agent.name,
                    "total_calls": agent.total_calls,
                    "average_duration_seconds": round(agent.average_duration_seconds or 0, 2),
                    "average_sentiment": round(agent.average_sentiment or 0, 2),
                }
                for agent in top_agents
            ],
            "growth_opportunities": growth_opportunities,
        }

call = CRUDCall(Call)

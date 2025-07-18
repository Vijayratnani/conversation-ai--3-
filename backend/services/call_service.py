from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from crud.crud_call import call as crud_call
from models.call import Call
from schemas.dashboard import DashboardStats, SentimentData, GrowthOpportunity

class CallService:
    async def get_dashboard_stats(self, db: AsyncSession) -> DashboardStats:
        """
        Generates aggregated statistics for the main dashboard.
        """
        # Total calls
        total_calls_stmt = select(func.count(Call.id))
        total_calls_res = await db.execute(total_calls_stmt)
        total_calls = total_calls_res.scalar_one()

        # Average duration
        avg_duration_stmt = select(func.avg(Call.duration_seconds))
        avg_duration_res = await db.execute(avg_duration_stmt)
        avg_duration = avg_duration_res.scalar_one() or 0.0

        # Sentiment distribution
        sentiment_stmt = select(
            Call.customer_sentiment, func.count(Call.id)
        ).group_by(Call.customer_sentiment)
        sentiment_res = await db.execute(sentiment_stmt)
        sentiments = {s[0]: s[1] for s in sentiment_res.all() if s[0]}
        
        sentiment_data = SentimentData(
            positive=sentiments.get("Positive", 0),
            neutral=sentiments.get("Neutral", 0),
            negative=sentiments.get("Negative", 0),
        )

        # Mocked growth opportunities for demonstration
        growth_opportunities = [
            GrowthOpportunity(topic="Pricing Inquiry", mentions=152),
            GrowthOpportunity(topic="Feature Request", mentions=98),
            GrowthOpportunity(topic="Cancellation Mention", mentions=45),
        ]

        return DashboardStats(
            total_calls=total_calls,
            average_call_duration=round(avg_duration, 2),
            sentiment_distribution=sentiment_data,
            growth_opportunities=growth_opportunities,
        )

    async def get_dashboard_data(self, db: AsyncSession):
        """
        Orchestrates fetching all data required for the dashboard.
        """
        stats = await self.get_dashboard_stats(db)
        return stats

call_service = CallService()

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from models import CallTopic, Topic, Call, Agent, Customer
from datetime import datetime, timedelta, timezone
from typing import Dict

async def get_growth_opportunities(db: AsyncSession) -> Dict:
    now = datetime.now(timezone.utc)
    last_30_days = now - timedelta(days=30)

    # Step 1: Get top 5 topics by total mentions
    topic_stmt = (
        select(
            Topic.topic_id,
            Topic.name_en,
            Topic.name_ur,
            func.sum(CallTopic.mention_count).label("mention_total")
        )
        .join(CallTopic, Topic.topic_id == CallTopic.topic_id)
        .join(Call, Call.call_id == CallTopic.call_id)
        .where(Call.call_timestamp >= last_30_days)
        .group_by(Topic.topic_id, Topic.name_en, Topic.name_ur)
        .order_by(desc("mention_total"))
        .limit(5)
    )

    topic_results = await db.execute(topic_stmt)
    top_topics = topic_results.all()

    growth_opportunities = []
    mock_mentions_data = {}

    for topic_id, topic_en, topic_ur, mention_total in top_topics:
        topic_id_str = topic_en.lower().replace(" ", "-")

        # Trend is simulated for now
        trend = f"+{min(mention_total, 20)}%"

        growth_opportunities.append({
            "id": topic_id_str,
            "topic": topic_en,
            "topicUrdu": topic_ur,
            "mentions": mention_total,
            "trend": trend,
        })

        # Step 2: Get call-level details for this topic
        mention_stmt = (
            select(
                Call.call_id,
                Call.call_timestamp,
                Agent.name.label("agent_name"),
                Customer.identifier.label("customer_identifier"),
                CallTopic.mention_snippet
            )
            .join(Call, Call.call_id == CallTopic.call_id)
            .join(Agent, Agent.agent_id == Call.agent_id)
            .join(Customer, Customer.customer_id == Call.customer_id)
            .where(CallTopic.topic_id == topic_id)
            .order_by(Call.call_timestamp.desc())
            .limit(mention_total)  # limit to total mentions
        )

        mention_results = await db.execute(mention_stmt)
        mention_rows = mention_results.all()

        mentions = []
        for call_id, call_timestamp, agent_name, customer_identifier, snippet in mention_rows:
            mentions.append({
                "callId": str(call_id),
                "callDate": call_timestamp.strftime("%Y-%m-%d"),
                "agentName": agent_name,
                "customerIdentifier": customer_identifier,
                "mentionSnippet": snippet or "...",  # fallback if null
            })

        mock_mentions_data[topic_en] = mentions

    return {
        "growthOpportunities": growth_opportunities,
        "mockMentionsData": mock_mentions_data,
    }

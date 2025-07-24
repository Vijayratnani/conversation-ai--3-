from sqlalchemy import select, func, cast, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import AsyncSession
from models.call_analysis_metadata import CallAnalysisMetadata
from schemas.drilldown import DrillDownDetails, RootCause, HistoricalPerformanceItem, KeyMetric

async def get_drilldown_details(product_id: int, db: AsyncSession) -> DrillDownDetails:
    # Total calls involving this product
    total_calls_query = select(func.count()).where(
        CallAnalysisMetadata.product_mentions.contains([product_id])
    )
    total_calls_result = await db.execute(total_calls_query)
    total_calls = total_calls_result.scalar() or 1  # Avoid divide by zero

    # Complaint count
    complaints_query = select(func.count()).where(
        CallAnalysisMetadata.product_mentions.contains([product_id]),
        CallAnalysisMetadata.intent.contains(['complaint'])
    )
    complaints_result = await db.execute(complaints_query)
    complaint_count = complaints_result.scalar() or 0

    # Escalated count (via raw_json["escalated"]: true)
    escalation_query = select(func.count()).where(
        CallAnalysisMetadata.product_mentions.contains([product_id]),
        cast(CallAnalysisMetadata.raw_json["escalated"], Boolean) == True
    )
    escalation_result = await db.execute(escalation_query)
    escalated_count = escalation_result.scalar() or 0

    # Sentiment distribution from raw_json["sentiment"]
    sentiment_query = select(
        CallAnalysisMetadata.raw_json["sentiment"].astext.label("sentiment"),
        func.count().label("count")
    ).where(
        CallAnalysisMetadata.product_mentions.contains([product_id])
    ).group_by(
        CallAnalysisMetadata.raw_json["sentiment"].astext
    )
    sentiment_result = await db.execute(sentiment_query)
    sentiment_data = dict(sentiment_result.fetchall())

    # Key metric calculations
    complaint_rate = round((complaint_count / total_calls) * 100, 2)
    escalation_rate = round((escalated_count / total_calls) * 100, 2)
    sentiment_positive = sentiment_data.get("positive", 0)
    sentiment_neutral = sentiment_data.get("neutral", 0)
    sentiment_negative = sentiment_data.get("negative", 0)

    key_metrics = [
        KeyMetric(
            metric="Complaint Rate",
            value=f"{complaint_rate}%",
            benchmark="Target: <7%",
            status="critical" if complaint_rate > 7 else "warning"
        ),
        KeyMetric(
            metric="Escalation Rate",
            value=f"{escalation_rate}%",
            benchmark="Target: <10%",
            status="critical" if escalation_rate > 10 else "warning"
        ),
        KeyMetric(
            metric="Positive Sentiment",
            value=str(sentiment_positive),
            benchmark=None,
            status="success"
        ),
        KeyMetric(
            metric="Neutral Sentiment",
            value=str(sentiment_neutral),
            benchmark=None,
            status="default"
        ),
        KeyMetric(
            metric="Negative Sentiment",
            value=str(sentiment_negative),
            benchmark=None,
            status="critical" if sentiment_negative > sentiment_positive else "warning"
        ),
    ]

    # Root cause example
    root_causes = [
        RootCause(
            cause="Top customer frustration source",
            impact="Based on NLP tagging and escalation data.",
            dataPoint=f"{escalated_count} escalated cases this month.",
            severity="High" if escalated_count > 10 else "Medium"
        ),
    ]

    # Historical (placeholder)
    historical = [
        HistoricalPerformanceItem(period="Current Month", value=f"{complaint_rate}%"),
        HistoricalPerformanceItem(period="Last Month", value="33%", change="+Xpp"),
    ]

    # Recommended actions (static for now)
    recommended = [
        "Analyze escalation flows and improve FAQ/self-service handling.",
        "Train agents on top complaint intents and de-escalation scripts.",
    ]

    return DrillDownDetails(
        rootCauses=root_causes,
        historicalPerformance=historical,
        keyMetrics=key_metrics,
        recommendedActions=recommended
    )

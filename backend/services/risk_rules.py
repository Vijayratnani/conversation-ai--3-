from typing import List, Optional, Callable, Awaitable
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone

from models import Call, CallAnalysisMetadata, ProductKnowledgeScore, ScriptAdherence

# ==== Type alias for dynamic rules ====
RiskRule = Callable[[AsyncSession], Awaitable[Optional[dict]]]

now = datetime.now(timezone.utc)
last_30_days = now - timedelta(days=30)
last_60_days = now - timedelta(days=60)

# ==== 1. Compliance Risk ====
async def compliance_risk(db: AsyncSession) -> Optional[dict]:
    low_compliance_this_month = (
        select(func.count()).select_from(Call)
        .where(Call.call_timestamp >= last_30_days)
        .where(Call.compliance_score < 0.6)
    )
    total_calls_this_month = (
        select(func.count()).select_from(Call)
        .where(Call.call_timestamp >= last_30_days)
    )
    low_compliance_last_month = (
        select(func.count()).select_from(Call)
        .where(Call.call_timestamp >= last_60_days)
        .where(Call.call_timestamp < last_30_days)
        .where(Call.compliance_score < 0.6)
    )
    total_calls_last_month = (
        select(func.count()).select_from(Call)
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

    return {
        "title": "Compliance Risk",
        "description": f"{rate_this}% of calls scored < 0.6",
        "trend": f"{'↑' if diff > 0 else '↓'} {abs(diff)}% from last month",
        "color": "text-red-600" if rate_this > 15 else "text-yellow-600" if rate_this > 8 else "text-green-600",
    }

# ==== 2. Churn Risk ====
async def churn_risk(db: AsyncSession) -> Optional[dict]:
    churn_this_month = (
        select(func.count()).select_from(CallAnalysisMetadata)
        .where(CallAnalysisMetadata.created_at >= last_30_days)
        .where(CallAnalysisMetadata.churn_risk == "high")
    )
    total_churn_checks = (
        select(func.count()).select_from(CallAnalysisMetadata)
        .where(CallAnalysisMetadata.created_at >= last_30_days)
    )

    churn_count = (await db.execute(churn_this_month)).scalar() or 0
    churn_total = (await db.execute(total_churn_checks)).scalar() or 1
    churn_percent = round(100 * churn_count / churn_total, 1)

    return {
        "title": "Customer Churn Risk",
        "description": f"{churn_percent}% high-risk interactions",
        "trend": "More churn signs in recent calls" if churn_percent > 10 else "Stable churn signals",
        "color": "text-amber-600" if churn_percent > 10 else "text-green-600"
    }

# ==== 3. Knowledge Gap Risk ====
async def knowledge_gap_risk(db: AsyncSession) -> Optional[dict]:
    low_knowledge_query = (
        select(func.count()).select_from(ProductKnowledgeScore)
        .where(ProductKnowledgeScore.assessment_date >= last_30_days)
        .where(ProductKnowledgeScore.score < 50)
    )
    low_knowledge_count = (await db.execute(low_knowledge_query)).scalar() or 0

    if low_knowledge_count == 0:
        return None

    return {
        "title": "Knowledge Gap Risk",
        "description": f"{low_knowledge_count} low scores this month",
        "trend": "Product training needed" if low_knowledge_count > 10 else "Improving scores",
        "color": "text-red-500" if low_knowledge_count > 15 else "text-yellow-600" if low_knowledge_count > 5 else "text-green-600"
    }

# ==== 4. Script Adherence Risk ====
async def script_adherence_risk(db: AsyncSession) -> Optional[dict]:
    query = (
        select(func.count()).select_from(ScriptAdherence)
        .where(ScriptAdherence.assessment_date >= last_30_days)
        .where(ScriptAdherence.score < 60)
    )
    count = (await db.execute(query)).scalar() or 0

    if count == 0:
        return None

    return {
        "title": "Script Adherence Risk",
        "description": f"{count} calls scored < 60 on adherence",
        "trend": "Check for consistency gaps in scripts",
        "color": "text-red-500" if count > 15 else "text-yellow-600" if count > 5 else "text-green-600",
    }

# ==== 5. Threat Detection Risk ====
async def threat_risk(db: AsyncSession) -> Optional[dict]:
    threat_query = (
        select(func.count()).select_from(CallAnalysisMetadata)
        .where(CallAnalysisMetadata.created_at >= last_30_days)
        .where(CallAnalysisMetadata.threat == True)
    )
    count = (await db.execute(threat_query)).scalar() or 0

    if count == 0:
        return None

    return {
        "title": "Threat Detection Risk",
        "description": f"{count} calls marked with threat signals",
        "trend": "Possible aggression or escalation signs",
        "color": "text-red-700" if count > 5 else "text-yellow-600"
    }

# ==== 6. Sensitive Info Risk ====
async def sensitive_info_risk(db: AsyncSession) -> Optional[dict]:
    sensitive_query = (
        select(func.count()).select_from(Call)
        .where(Call.call_timestamp >= last_30_days)
        .where(Call.contains_sensitive_info == True)
    )
    count = (await db.execute(sensitive_query)).scalar() or 0

    if count == 0:
        return None

    return {
        "title": "Sensitive Content Risk",
        "description": f"{count} calls with sensitive information",
        "trend": "Ensure masking & privacy compliance",
        "color": "text-amber-600" if count > 10 else "text-green-600"
    }

# ==== List of All Active Risk Rules ====
risk_rules: List[RiskRule] = [
    compliance_risk,
    churn_risk,
    knowledge_gap_risk,
    script_adherence_risk,
    threat_risk,
    sensitive_info_risk,
    # Add future rules here
]

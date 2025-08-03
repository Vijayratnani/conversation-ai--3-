# api/v1/endpoints/sales_effectiveness.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.session import get_db
from models.call_analysis_metadata import CallAnalysisMetadata
from typing import List
from collections import Counter

router = APIRouter()

@router.get("/sales-effectiveness", response_model=dict)
async def get_sales_effectiveness(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CallAnalysisMetadata.raw_json))
    rows = result.scalars().all()

    total_calls = len(rows)
    successful_sales = 0
    cross_sell_pairs = []
    missed_keywords = []
    missed_opportunities = 0

    for row in rows:
        data = row or {}

        # Count successful sales
        if data.get("opportunity_detected") and data.get("agent_responded"):
            score = data.get("agent_response_score", 0)
            if score >= 0.7:  # threshold for 'successful'
                successful_sales += 1

        # Cross-sell tracking
        product_mentions = data.get("product_mentions", [])
        for i in range(len(product_mentions) - 1):
            from_product = product_mentions[i].get("product_name", "")
            to_product = product_mentions[i + 1].get("product_name", "")
            success = product_mentions[i + 1].get("converted", False)
            if from_product and to_product:
                cross_sell_pairs.append((from_product, to_product, success))

        # Missed opportunities
        if data.get("opportunity_detected") and not data.get("agent_responded"):
            missed_opportunities += 1
            for wish in data.get("customer_wishes", []):
                missed_keywords.append(wish.get("phrase", ""))

    # Aggregate cross-sell
    pair_stats = {}
    for from_p, to_p, success in cross_sell_pairs:
        key = (from_p, to_p)
        if key not in pair_stats:
            pair_stats[key] = {"success": 0, "total": 0}
        pair_stats[key]["total"] += 1
        if success:
            pair_stats[key]["success"] += 1

    cross_sell_success_percent = (
        100 * sum(v["success"] for v in pair_stats.values()) / max(sum(v["total"] for v in pair_stats.values()), 1)
    )

    top_cross = max(pair_stats.items(), key=lambda x: x[1]["success"] / x[1]["total"], default=(("N/A", "N/A"), {"success": 0, "total": 1}))
    low_cross = min(pair_stats.items(), key=lambda x: x[1]["success"] / x[1]["total"], default=(("N/A", "N/A"), {"success": 0, "total": 1}))

    top_keywords = Counter(missed_keywords).most_common(5)

    return {
        "successfulSalesPercent": round((successful_sales / total_calls) * 100, 2) if total_calls else 0,
        "successfulSalesCount": successful_sales,
        "totalCalls": total_calls,
        "crossSellSuccessPercent": round(cross_sell_success_percent, 2),
        "topCrossSell": {
            "from": top_cross[0][0],
            "to": top_cross[0][1],
            "successPercent": round((top_cross[1]["success"] / top_cross[1]["total"]) * 100, 2),
        },
        "lowestCrossSell": {
            "from": low_cross[0][0],
            "to": low_cross[0][1],
            "successPercent": round((low_cross[1]["success"] / low_cross[1]["total"]) * 100, 2),
        },
        "missedOpportunitiesCount": missed_opportunities,
        "topMissedKeywords": [{"phrase": kw, "count": count} for kw, count in top_keywords],
    }

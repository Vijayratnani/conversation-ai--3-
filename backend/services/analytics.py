from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models.call import Call
from models.product import Product
from models.script_adherence import ScriptAdherence
from models.call_analysis_metadata import CallAnalysisMetadata


# -------------------------------
# Sentiment Analysis per Product
# -------------------------------
async def get_sentiment_analysis(db: AsyncSession):
    result = await db.execute(
        select(
            Product.name,
            Call.customer_sentiment,
            func.count().label("count")
        )
        .join(ScriptAdherence, ScriptAdherence.call_id == Call.call_id)
        .join(Product, Product.product_id == ScriptAdherence.product_id)
        .group_by(Product.name, Call.customer_sentiment)
    )

    raw_data = result.all()

    # Reshape to product-level summaries
    product_map = {}
    for product_name, sentiment, count in raw_data:
        if product_name not in product_map:
            product_map[product_name] = {
                "product": product_name,
                "positive": 0,
                "neutral": 0,
                "negative": 0,
                "warning": False,
                "causes": [],  # optionally fill later
            }

        if sentiment == "positive":
            product_map[product_name]["positive"] += count
        elif sentiment == "neutral":
            product_map[product_name]["neutral"] += count
        elif sentiment == "negative":
            product_map[product_name]["negative"] += count

    # Flag products with > 40% negative sentiment
    for product in product_map.values():
        total = product["positive"] + product["neutral"] + product["negative"]
        if total and (product["negative"] / total) > 0.4:
            product["warning"] = True

    return list(product_map.values())


# -------------------------------
# Sales Effectiveness Overview
# -------------------------------
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from collections import Counter
from models.call_analysis_metadata import CallAnalysisMetadata

async def get_sales_effectiveness(db: AsyncSession):
    result = await db.execute(
        select(
            CallAnalysisMetadata.opportunity_detected,
            CallAnalysisMetadata.agent_responded,
            CallAnalysisMetadata.product_mentions,
            CallAnalysisMetadata.customer_wishes
        )
    )
    rows = result.fetchall()

    total_calls = len(rows)
    successful_sales_count = 0
    missed_opportunities_count = 0
    cross_sell_pairs = []
    missed_keywords = []

    for row in rows:
        opportunity = row.opportunity_detected
        responded = row.agent_responded
        product_mentions = row.product_mentions or []
        customer_wishes = row.customer_wishes or []

        if opportunity and responded:
            successful_sales_count += 1

            product_names = [
                p.get("product")
                for p in product_mentions
                if isinstance(p, dict) and "product" in p
            ]
            unique_products = list(set(product_names))
            if len(unique_products) > 1:
                for i in range(len(unique_products)):
                    for j in range(i + 1, len(unique_products)):
                        cross_sell_pairs.append((unique_products[i], unique_products[j]))

        elif opportunity and not responded:
            missed_opportunities_count += 1

        for wish in customer_wishes:
            phrase = (
                wish.get("phrase")
                or wish.get("text")
                or wish.get("keyword")
            )
            if phrase:
                missed_keywords.append(phrase.strip().lower())

    successful_sales_percent = (
        (successful_sales_count / total_calls) * 100 if total_calls else 0
    )
    cross_sell_success_percent = (
        (len(cross_sell_pairs) / successful_sales_count) * 100 if successful_sales_count else 0
    )

    cross_sell_counter = Counter(cross_sell_pairs)
    if cross_sell_counter:
        top_pair, top_count = cross_sell_counter.most_common(1)[0]
        lowest_pair, lowest_count = cross_sell_counter.most_common()[-1]
        top_cross_sell = {
            "from": top_pair[0],
            "to": top_pair[1],
            "successPercent": round((top_count / len(cross_sell_pairs)) * 100, 2)
        }
        lowest_cross_sell = {
            "from": lowest_pair[0],
            "to": lowest_pair[1],
            "successPercent": round((lowest_count / len(cross_sell_pairs)) * 100, 2)
        }
    else:
        top_cross_sell = {"from": "", "to": "", "successPercent": 0}
        lowest_cross_sell = {"from": "", "to": "", "successPercent": 0}

    missed_keyword_counter = Counter(missed_keywords)
    top_missed_keywords = [
        {"phrase": phrase, "count": count}
        for phrase, count in missed_keyword_counter.most_common(5)
    ]

    trend = "up" if successful_sales_percent >= 50 else "down"

    return {
        "successfulSalesPercent": round(successful_sales_percent, 2),
        "successfulSalesCount": successful_sales_count,
        "totalCalls": total_calls,
        "crossSellSuccessPercent": round(cross_sell_success_percent, 2),
        "topCrossSell": top_cross_sell,
        "lowestCrossSell": lowest_cross_sell,
        "missedOpportunitiesCount": missed_opportunities_count,
        "topMissedKeywords": top_missed_keywords,
        "trend": trend,
    }

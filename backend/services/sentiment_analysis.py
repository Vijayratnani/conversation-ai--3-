from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models.call import Call
from models.product import Product
from models.script_adherence import ScriptAdherence
from models.call_analysis_metadata import CallAnalysisMetadata

import json
from datetime import datetime, timedelta, timezone
from collections import defaultdict


async def get_sentiment_analysis(db: AsyncSession):
    # ⏳ Time filter: only include last 30 days
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

    # Step 1: Get sentiment counts per product
    result = await db.execute(
        select(
            Product.name,
            func.lower(Call.customer_sentiment).label("sentiment"),
            func.count().label("count")
        )
        .join(ScriptAdherence, ScriptAdherence.call_id == Call.call_id)
        .join(Product, Product.product_id == ScriptAdherence.product_id)
        .where(Call.call_timestamp >= thirty_days_ago)
        .group_by(Product.name, "sentiment")
    )

    raw_data = result.all()

    # Step 2: Aggregate sentiment counts
    product_map = {}
    for product_name, sentiment, count in raw_data:
        if product_name not in product_map:
            product_map[product_name] = {
                "product": product_name,
                "positive": 0,
                "neutral": 0,
                "negative": 0,
                "warning": False,
                "causes": []
            }

        if sentiment == "positive":
            product_map[product_name]["positive"] += count
        elif sentiment == "neutral":
            product_map[product_name]["neutral"] += count
        elif sentiment == "negative":
            product_map[product_name]["negative"] += count

    # Step 3: Fetch call analysis metadata only for recent calls
    metadata_result = await db.execute(
        select(CallAnalysisMetadata.raw_json)
        .join(Call, Call.call_id == CallAnalysisMetadata.call_id)
        .where(Call.call_timestamp >= thirty_days_ago)
    )
    metadata_rows = metadata_result.scalars().all()

    # Step 4: Extract causes
    product_causes = defaultdict(set)

    for raw_json in metadata_rows:
        data = raw_json if isinstance(raw_json, dict) else json.loads(raw_json)
        product_mentions = data.get("product_mentions", [])
        customer_wishes = data.get("customer_wishes", [])
        agent_mentions = data.get("agent_mentions", [])
        customer_behavior = data.get("customer_behavior", {})

        for mention in product_mentions:
            product = mention.get("product")
            if mention.get("sentiment") == "negative":
                for keyword in mention.get("problem_keywords", []):
                    product_causes[product].add(keyword)

        for wish in customer_wishes:
            product = wish.get("category")
            wish_text = wish.get("wish")
            if wish_text:
                product_causes[product].add(f"Wish: {wish_text}")

        for agent_issue in agent_mentions:
            for keyword in agent_issue.get("problem_keywords", []):
                product_causes["Agent Issues"].add(keyword)

        for keyword in customer_behavior.get("detected_keywords", []):
            product_causes["General"].add(keyword)

    # Step 5: Add warnings and causes
    for product in product_map.values():
        total = product["positive"] + product["neutral"] + product["negative"]
        if total > 0 and (product["negative"] / total) > 0.4:
            product["warning"] = True

        product_name = product["product"]
        causes = product_causes.get(product_name, set())
        general_causes = product_causes.get("General", set())
        agent_issues = product_causes.get("Agent Issues", set())

        product["causes"] = list(causes.union(general_causes, agent_issues))

    return list(product_map.values())

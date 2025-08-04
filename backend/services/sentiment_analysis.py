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

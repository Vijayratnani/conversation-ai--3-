from sqlalchemy import select, func, extract
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from models.call import Call
from models.script_adherence import ScriptAdherence
from models.product_knowledge_score import ProductKnowledgeScore
from models.product import Product
from typing import List
from datetime import datetime, timedelta

async def get_product_knowledge_level(db: AsyncSession) -> List[Dict]:
    today = datetime.utcnow().date()
    first_day_this_month = today.replace(day=1)
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)

    # Current month scores across all agents
    current_scores_stmt = (
        select(
            Product.name.label("product_name"),
            func.avg(ProductKnowledgeScore.score).label("avg_score"),
            func.string_agg(ProductKnowledgeScore.issues_noted, '; ').label("issues")
        )
        .join(Product, Product.product_id == ProductKnowledgeScore.product_id)
        .where(ProductKnowledgeScore.assessment_date == first_day_this_month)
        .group_by(Product.name)
    )
    current_scores = (await db.execute(current_scores_stmt)).all()

    # Last month scores across all agents
    last_scores_stmt = (
        select(
            Product.name.label("product_name"),
            func.avg(ProductKnowledgeScore.score).label("avg_score")
        )
        .join(Product, Product.product_id == ProductKnowledgeScore.product_id)
        .where(
            ProductKnowledgeScore.assessment_date == first_day_last_month
            #ProductKnowledgeScore.assessment_date < first_day_this_month
        )
        .group_by(Product.name)
    )
    last_scores = (await db.execute(last_scores_stmt)).all()
    last_score_map = {row.product_name: float(row.avg_score or 0) for row in last_scores}

    # Helper for color
    def score_to_color(score):
        if score >= 85:
            return "bg-green-500"
        elif score >= 70:
            return "bg-amber-500"
        else:
            return "bg-red-500"

    data = []

    for row in current_scores:
        product = row.product_name
        score = float(row.avg_score or 0)
        issues = row.issues or "No major issues"

        # Simulated content
        examples = [
            f"Example issue for {product} #1.",
            f"Example issue for {product} #2.",
        ]
        trainings = [
            { "title": f"{product} Masterclass", "link": "#" },
            { "title": f"Handling {product} FAQs", "link": "#" }
        ]
        steps = [
            f"Review {product} documentation.",
            f"Schedule 1:1 with a senior agent on {product}."
        ]

        # Trend logic
        last_score = last_score_map.get(product, 0)
        if last_score:
            change = round(score - last_score, 2)
            direction = "up" if change >= 0 else "down"
            trend = {
                "period": "last month",
                "change": f"{'+' if change >= 0 else ''}{change}%",
                "direction": direction
            }
        else:
            trend = {
                "period": "last month",
                "change": "N/A",
                "direction": "up"
            }

        data.append({
            "product": product,
            "score": round(score, 2),
            "issues": issues,
            "color": score_to_color(score),
            "specificExamples": examples,
            "recommendedTraining": trainings,
            "scoreTrend": trend,
            "actionableSteps": steps
        })

    return data
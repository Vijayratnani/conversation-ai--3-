from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, cast, String
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date
from dateutil.relativedelta import relativedelta
from typing import List, Dict, Any

from models.call import Call  # assuming your ORM model is here


class ProductComplaintInsightsService:

    async def get_category_share(self, db: AsyncSession) -> List[Dict[str, Any]]:
        # Get total complaints count
        total_stmt = select(func.count()).where(Call.intent.contains(["complaint"]))
        total_count = (await db.execute(total_stmt)).scalar_one()

        if total_count == 0:
            return []

        # Group by product_mentions->>'product'
        stmt = (
            select(
                Call.product_mentions["product"].astext.label("product"),
                func.count().label("count")
            )
            .where(Call.intent.contains(["complaint"]))
            .group_by(Call.product_mentions["product"].astext)
        )

        result = await db.execute(stmt)
        rows = result.all()

        return [
            {
                "product": row.product,
                "percentage": round((row.count / total_count) * 100, 2)
            }
            for row in rows
        ]

    async def get_month_over_month_change(self, db: AsyncSession, product: str) -> float:
        today = date.today()
        start_of_this_month = today.replace(day=1)
        start_of_last_month = start_of_this_month - relativedelta(months=1)
        end_of_last_month = start_of_this_month - relativedelta(days=1)

        # Current month count
        current_stmt = (
            select(func.count())
            .where(
                Call.intent.contains(["complaint"]),
                Call.product_mentions["product"].astext == product,
                Call.call_date.between(start_of_this_month, today)
            )
        )
        current_count = (await db.execute(current_stmt)).scalar_one()

        # Last month count
        last_stmt = (
            select(func.count())
            .where(
                Call.intent.contains(["complaint"]),
                Call.product_mentions["product"].astext == product,
                Call.call_date.between(start_of_last_month, end_of_last_month)
            )
        )
        last_count = (await db.execute(last_stmt)).scalar_one()

        if last_count == 0:
            return 100.0 if current_count > 0 else 0.0

        percent_change = ((current_count - last_count) / last_count) * 100
        return round(percent_change, 2)

    async def get_top_issue(self, db: AsyncSession, product: str) -> str:
        # This is trickier since jsonb_array_elements_text needs to be emulated

        stmt = (
            select(
                func.jsonb_array_elements_text(Call.product_mentions["problem_keywords"]).label("keyword"),
                func.count().label("count")
            )
            .where(Call.product_mentions["product"].astext == product)
            .group_by("keyword")
            .order_by(func.count().desc())
            .limit(1)
        )

        result = await db.execute(stmt)
        row = result.first()
        return row.keyword if row else "N/A"


product_insights_service = ProductComplaintInsightsService()

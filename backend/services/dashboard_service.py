from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from models.product import Product
from models.call_analysis_metadata import CallAnalysisMetadata
from datetime import date
from dateutil.relativedelta import relativedelta


async def get_dashboard_product_stats(db: AsyncSession):
    today = date.today()
    start_of_this_month = today.replace(day=1)
    start_of_last_month = start_of_this_month - relativedelta(months=1)
    end_of_last_month = start_of_this_month - relativedelta(days=1)

    # Total complaints this month (used for share%)
    total_complaints_result = await db.execute(
        select(func.count())
        .select_from(CallAnalysisMetadata)
        .filter(
            CallAnalysisMetadata.intent.contains(['complaint']),
            CallAnalysisMetadata.created_at >= start_of_this_month,
            CallAnalysisMetadata.created_at < today,
        )
    )
    total_complaints = total_complaints_result.scalar() or 1  # avoid division by 0

    # Get all products
    products_result = await db.execute(select(Product))
    products = products_result.scalars().all()

    result = []

    for product in products:
        product_name = product.name

        # Complaint count for current month
        current_stmt = text("""
            SELECT COUNT(*) FROM call_analysis_metadata,
            LATERAL jsonb_array_elements(
                CASE 
                    WHEN jsonb_typeof(product_mentions) = 'array' 
                    THEN product_mentions 
                    ELSE '[]'::jsonb 
                END
            ) AS pm
            WHERE pm->>'product' = :product_name
              AND (pm->>'issue_detected')::boolean = true
              AND 'complaint' = ANY(intent)
              AND created_at >= :start_date AND created_at < :end_date
        """)
        current_result = await db.execute(
            current_stmt,
            {
                "product_name": product_name,
                "start_date": start_of_this_month,
                "end_date": today
            }
        )
        current_count = current_result.scalar() or 0

        # Complaint count for last month
        last_stmt = text("""
            SELECT COUNT(*) FROM call_analysis_metadata,
            LATERAL jsonb_array_elements(
                CASE 
                    WHEN jsonb_typeof(product_mentions) = 'array' 
                    THEN product_mentions 
                    ELSE '[]'::jsonb 
                END
            ) AS pm
            WHERE pm->>'product' = :product_name
              AND (pm->>'issue_detected')::boolean = true
              AND 'complaint' = ANY(intent)
              AND created_at >= :start_date AND created_at <= :end_date
        """)
        last_result = await db.execute(
            last_stmt,
            {
                "product_name": product_name,
                "start_date": start_of_last_month,
                "end_date": end_of_last_month
            }
        )
        last_count = last_result.scalar() or 0

        # Share % and trend %
        share_percent = round((current_count / total_complaints) * 100, 1)
        change_percent = round(((current_count - last_count) / last_count) * 100, 1) if last_count else 0.0

        # Top issue keyword this month
        top_issue_stmt = text("""
            SELECT kw AS keyword, COUNT(*) FROM call_analysis_metadata,
            LATERAL jsonb_array_elements(
                CASE 
                    WHEN jsonb_typeof(product_mentions) = 'array' 
                    THEN product_mentions 
                    ELSE '[]'::jsonb 
                END
            ) AS pm,
            LATERAL jsonb_array_elements_text(pm->'problem_keywords') AS kw
            WHERE pm->>'product' = :product_name
              AND (pm->>'issue_detected')::boolean = true
              AND 'complaint' = ANY(intent)
              AND created_at >= :start_date AND created_at < :end_date
            GROUP BY keyword
            ORDER BY COUNT(*) DESC
            LIMIT 1
        """)
        top_issue_result = await db.execute(
            top_issue_stmt,
            {
                "product_name": product_name,
                "start_date": start_of_this_month,
                "end_date": today
            }
        )
        top_issue_row = top_issue_result.first()
        top_issue = top_issue_row.keyword if top_issue_row else "N/A"

        result.append({
            "product_id": product.product_id,
            "product_name": product_name,
            "value": share_percent,
            "trend": change_percent,
            "top_issue": top_issue
        })

    # ✅ Sort by share percentage (value) descending and return top 5
    top_5 = sorted(result, key=lambda x: x["value"], reverse=True)[:5]
    return top_5

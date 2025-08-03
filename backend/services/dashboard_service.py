from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from models.product import Product
from models.call_analysis_metadata import CallAnalysisMetadata
from datetime import date, timedelta

async def get_dashboard_product_stats(db: AsyncSession):
    today = date.today()
    start_30_days_ago = today - timedelta(days=30)

    # Total complaints in last 30 days
    total_complaints_result = await db.execute(
        select(func.count())
        .select_from(CallAnalysisMetadata)
        .filter(
            CallAnalysisMetadata.intent.contains(['complaint']),
            CallAnalysisMetadata.created_at >= start_30_days_ago
        )
    )
    total_complaints = total_complaints_result.scalar() or 1  # prevent division by 0

    # Get all products
    products_result = await db.execute(select(Product))
    products = products_result.scalars().all()

    result = []

    for product in products:
        product_name = product.name

        # Complaint count in last 30 days
        current_stmt = text("""
            SELECT COUNT(*) FROM call_analysis_metadata cam,
            LATERAL jsonb_array_elements(
                CASE 
                    WHEN jsonb_typeof(cam.product_mentions) = 'array' 
                    THEN cam.product_mentions 
                    ELSE '[]'::jsonb 
                END
            ) AS pm
            WHERE LOWER(pm->>'product') = LOWER(:product_name)
              AND (pm->>'issue_detected')::boolean = true
              AND 'complaint' = ANY(cam.intent)
              AND cam.created_at >= :start_date
        """)
        current_result = await db.execute(
            current_stmt,
            {
                "product_name": product_name,
                "start_date": start_30_days_ago,
            }
        )
        current_count = current_result.scalar() or 0

        # Complaint count in the previous 30–60 day window (for trend)
        last_period_start = start_30_days_ago - timedelta(days=30)
        last_period_end = start_30_days_ago

        last_stmt = text("""
            SELECT COUNT(*) FROM call_analysis_metadata cam,
            LATERAL jsonb_array_elements(
                CASE 
                    WHEN jsonb_typeof(cam.product_mentions) = 'array' 
                    THEN cam.product_mentions 
                    ELSE '[]'::jsonb 
                END
            ) AS pm
            WHERE LOWER(pm->>'product') = LOWER(:product_name)
              AND (pm->>'issue_detected')::boolean = true
              AND 'complaint' = ANY(cam.intent)
              AND cam.created_at >= :start_date AND cam.created_at < :end_date
        """)
        last_result = await db.execute(
            last_stmt,
            {
                "product_name": product_name,
                "start_date": last_period_start,
                "end_date": last_period_end
            }
        )
        last_count = last_result.scalar() or 0

        share_percent = round((current_count / total_complaints) * 100, 1)
        change_percent = round(((current_count - last_count) / last_count) * 100, 1) if last_count else 0.0

        # Top keyword this month
        top_issue_stmt = text("""
            SELECT kw AS keyword, COUNT(*) FROM call_analysis_metadata cam,
            LATERAL jsonb_array_elements(
                CASE 
                    WHEN jsonb_typeof(cam.product_mentions) = 'array' 
                    THEN cam.product_mentions 
                    ELSE '[]'::jsonb 
                END
            ) AS pm,
            LATERAL jsonb_array_elements_text(pm->'problem_keywords') AS kw
            WHERE LOWER(pm->>'product') = LOWER(:product_name)
              AND (pm->>'issue_detected')::boolean = true
              AND 'complaint' = ANY(cam.intent)
              AND cam.created_at >= :start_date
            GROUP BY keyword
            ORDER BY COUNT(*) DESC
            LIMIT 1
        """)
        top_issue_result = await db.execute(
            top_issue_stmt,
            {
                "product_name": product_name,
                "start_date": start_30_days_ago,
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

    # Sort by value (share %) descending
    top_5 = sorted(result, key=lambda x: x["value"], reverse=True)[:5]
    return top_5

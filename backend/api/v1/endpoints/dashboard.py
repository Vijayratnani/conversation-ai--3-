from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.dashboard import DashboardStats, DashboardProductStats, DrillDownDetails
from services.call_service import call_service
from services.dashboard_service import get_dashboard_product_stats
from services.drilldown_service import get_drilldown_details

from db.session import get_db

router = APIRouter()

@router.get("/", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve aggregated statistics for the main dashboard.
    """
    stats = await call_service.get_dashboard_data(db)
    return stats

@router.get("/product-stats", response_model=DashboardProductStats)
async def product_stats(db: AsyncSession = Depends(get_db)):
    return await get_dashboard_product_stats(db)

# # api/v1/endpoints/dashboard.py
# @router.get("/product/{product_id}/drilldown", response_model=DrillDownDetails)
# async def get_drilldown(product_id: int, db: AsyncSession = Depends(get_db)):
#     return await get_drilldown_details(product_id, db)

# api/v1/routes/analytics.py

from services.analytics import get_sentiment_analysis, get_sales_effectiveness

@router.get("/sentiment")
async def sentiment_data(db: AsyncSession = Depends(get_db)):
    return await get_sentiment_analysis(db)

@router.get("/sales-effectiveness")
async def sales_data(db: AsyncSession = Depends(get_db)):
    return await get_sales_effectiveness(db)

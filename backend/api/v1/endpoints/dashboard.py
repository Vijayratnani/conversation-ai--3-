from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.dashboard import DashboardStats
from services.call_service import call_service
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

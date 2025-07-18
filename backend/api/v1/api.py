from fastapi import APIRouter
from .endpoints import calls, dashboard, drill_down, product_stats

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(calls.router, prefix="/calls", tags=["calls"])
api_router.include_router(drill_down.router)
api_router.include_router(product_stats.router)

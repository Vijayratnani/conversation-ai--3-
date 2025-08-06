from fastapi import APIRouter
from .endpoints import calls, dashboard, dashboard_insights, location  # Ensure this import works correctly
from .endpoints.Dashboard import product_specific_agent_performance_endpoint

api_router = APIRouter()

api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(calls.router, prefix="/calls", tags=["calls"])
# api_router.include_router(dashboard_insights.router, prefix="/dashboard-insights", tags=["dashboard-insights"])
# api_router.include_router(location.router, prefix="/location", tags=["location"])
api_router.include_router(product_specific_agent_performance_endpoint.router,  prefix="/dashboard", tags=["Product-Specific Agent Performance"])

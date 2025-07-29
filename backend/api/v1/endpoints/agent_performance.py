# api/v1/routes/agent_performance.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from services.agent_performance import get_agent_performance_data
from schemas.agent_performance import AgentPerformanceResponse

router = APIRouter()

@router.get("/agent-performance", response_model=AgentPerformanceResponse)
async def agent_performance(db: AsyncSession = Depends(get_db)):
    return await get_agent_performance_data(db)

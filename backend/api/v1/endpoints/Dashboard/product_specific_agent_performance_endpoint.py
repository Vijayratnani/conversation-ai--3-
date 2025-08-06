from fastapi import APIRouter, Depends
from typing import List, Dict
from db.session import get_db
from services.Dashboard.product_specific_agent_performance_service import (
    get_product_knowledge_level  # <--- your new function
)
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/product-knowledge-level", response_model=List[Dict])  # or create a Pydantic schema and use it here
async def get_product_knowledge_level_route(db: AsyncSession = Depends(get_db)):
    return await get_product_knowledge_level(db)
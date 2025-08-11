from fastapi import APIRouter, Depends
from typing import List, Dict
from db.session import get_db
from services.Dashboard.product_specific_agent_performance_service import (
    get_product_knowledge_level,
    get_average_handling_time_by_product_type,
    get_script_adherence_by_product      # <--- your new function
)
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/product-knowledge-level", response_model=List[Dict])  # or create a Pydantic schema and use it here
async def get_product_knowledge_level_route(db: AsyncSession = Depends(get_db)):
    return await get_product_knowledge_level(db)

@router.get("/average-handling-time-by-product", response_model=List[Dict])  # <--- new route added
async def get_average_handling_time_route(db: AsyncSession = Depends(get_db)):
    return await get_average_handling_time_by_product_type(db)  # <--- calling your method

@router.get("/script-adherence-by-product", response_model=List[Dict])  # <--- new route added
async def get_script_adherence_by_product_route(db: AsyncSession = Depends(get_db)):
    return await get_script_adherence_by_product(db)
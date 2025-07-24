from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud.crud_call as crud
from schemas.call import Call, CallCreate
from db.session import get_db
from services.ComplaintInsightService import ProductComplaintInsightsService

router = APIRouter()

@router.get("/dashboard/complaint-cards")
async def get_complaint_cards(db: AsyncSession = Depends(get_db)):
    today = date.today()
    current_start = date(today.year, today.month, 1)
    current_end = date(today.year, today.month, 31)
    last_start = date(today.year, today.month - 1, 1)
    last_end = date(today.year, today.month - 1, 30)
    
    return await ProductComplaintInsightsService().get_complaint_insight_cards(
        db, current_start, current_end, last_start, last_end
    )

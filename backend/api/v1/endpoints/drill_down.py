from fastapi import APIRouter, HTTPException
from typing import List
from models.drill_down import DrillDownDetails, RootCause, HistoricalPerformance, KeyMetric
from data.store import DRILL_DOWN_DATA

router = APIRouter(prefix="/api/drill-down", tags=["Drill Down"])

@router.get("/{category}", response_model=DrillDownDetails)
async def get_details(category: str):
    if category not in DRILL_DOWN_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    return DRILL_DOWN_DATA[category]

@router.get("/{category}/root-causes", response_model=List[RootCause])
async def get_root_causes(category: str):
    if category not in DRILL_DOWN_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    return DRILL_DOWN_DATA[category].rootCauses

@router.get("/{category}/historical-performance", response_model=List[HistoricalPerformance])
async def get_historical_performance(category: str):
    if category not in DRILL_DOWN_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    return DRILL_DOWN_DATA[category].historicalPerformance

@router.get("/{category}/key-metrics", response_model=List[KeyMetric])
async def get_key_metrics(category: str):
    if category not in DRILL_DOWN_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    return DRILL_DOWN_DATA[category].keyMetrics

@router.get("/{category}/recommended-actions", response_model=List[str])
async def get_recommended_actions(category: str):
    if category not in DRILL_DOWN_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    return DRILL_DOWN_DATA[category].recommendedActions

@router.post("/{category}", response_model=DrillDownDetails)
async def create_or_update(category: str, data: DrillDownDetails):
    DRILL_DOWN_DATA[category] = data
    return data

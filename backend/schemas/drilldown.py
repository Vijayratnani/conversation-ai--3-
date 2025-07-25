# schemas/drilldown.py
from pydantic import BaseModel
from typing import List, Optional

class RootCause(BaseModel):
    cause: str
    impact: str
    dataPoint: Optional[str]
    severity: str

class HistoricalPerformanceItem(BaseModel):
    period: str
    value: str
    change: Optional[str] = None

class KeyMetric(BaseModel):
    metric: str
    value: str
    benchmark: Optional[str]
    status: str

class DrillDownDetails(BaseModel):
    rootCauses: List[RootCause]
    historicalPerformance: List[HistoricalPerformanceItem]
    keyMetrics: List[KeyMetric]
    recommendedActions: List[str]

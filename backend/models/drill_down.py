from pydantic import BaseModel
from typing import List, Optional

# Pydantic models for type validation
class RootCause(BaseModel):
    cause: str
    impact: str
    dataPoint: Optional[str] = None
    severity: str

class HistoricalPerformance(BaseModel):
    period: str
    value: str
    change: Optional[str] = None

class KeyMetric(BaseModel):
    metric: str
    value: str
    benchmark: str
    status: str

class DrillDownDetails(BaseModel):
    rootCauses: List[RootCause]
    historicalPerformance: List[HistoricalPerformance]
    keyMetrics: List[KeyMetric]
    recommendedActions: List[str]
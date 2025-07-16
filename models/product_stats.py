from pydantic import BaseModel
from typing import List, Optional, Literal

class Trend(BaseModel):
    direction: Literal["up", "down"]
    change: str
    color: str

class RootCause(BaseModel):
    cause: str
    impact: str
    dataPoint: Optional[str] = None
    severity: Literal["High", "Medium", "Low"]

class PerformanceItem(BaseModel):
    period: str
    value: str
    change: Optional[str] = None
    benchmark: Optional[str] = None

class KeyMetric(BaseModel):
    metric: str
    value: str
    benchmark: Optional[str] = None
    status: Literal["critical", "warning", "ok"]

class DrillDownDetails(BaseModel):
    rootCauses: List[RootCause]
    historicalPerformance: List[PerformanceItem]
    keyMetrics: List[KeyMetric]
    recommendedActions: List[str]

class ProductStatItem(BaseModel):
    id: str
    title: str
    value: str
    trend: Trend
    topIssue: str
    iconName: str  # Send icon name like "FileText"
    iconContainerClass: str
    iconClass: str
    headerClass: str
    drillDownDetails: DrillDownDetails

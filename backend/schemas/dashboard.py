from pydantic import BaseModel
from typing import List, Dict

class SentimentData(BaseModel):
    positive: int
    neutral: int
    negative: int

class AgentPerformance(BaseModel):
    agent_id: int
    agent_name: str
    total_calls: int
    average_duration_seconds: float
    average_sentiment: float

class DashboardStats(BaseModel):
    total_calls: int
    average_call_duration: float
    sentiment_distribution: SentimentData
    top_performing_agents: List[AgentPerformance]
    growth_opportunities: Dict[str, int]

class GrowthOpportunity(BaseModel):
    product_id: int
    product_name: str
    share_percent: float
    change_percent: float
    top_issue: str

from pydantic import BaseModel, RootModel
from typing import List

class SingleProductStat(BaseModel):
    product_id: int
    product_name: str
    value: float
    trend: float
    top_issue: str

class DashboardProductStats(RootModel[List[SingleProductStat]]):
    pass

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


from pydantic import BaseModel
from typing import List


class GrowthOpportunity(BaseModel):
    id: str
    topic: str
    topicUrdu: str
    mentions: int


class TopAgent(BaseModel):
    name: str
    score: float


class AgentPerformance(BaseModel):
    avgScore: float
    topAgent: TopAgent
    needsCoachingCount: int


class RiskIndicator(BaseModel):
    title: str
    description: str
    trend: str
    color: str


class CallEnvironmentStat(BaseModel):
    type: str
    label: str
    detail: str


class AvgHoldTimeStats(BaseModel):
    currentAvgHoldTime: str
    diffFromLastMonth: str
    isImproved: bool


class StrategicInsightsResponse(BaseModel):
    growthOpportunities: List[GrowthOpportunity]
    agentPerformance: AgentPerformance
    riskIndicators: List[RiskIndicator]
    callEnvironmentStats: List[CallEnvironmentStat]
    avgHoldTimeStats: AvgHoldTimeStats  # ✅ new field added

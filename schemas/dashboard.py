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

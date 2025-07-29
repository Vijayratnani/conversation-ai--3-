from pydantic import BaseModel
from typing import List, Literal

class AgentStat(BaseModel):
    title: str
    value: str
    change: str
    trend: Literal["up", "down"]

class TopAgent(BaseModel):
    name: str
    score: int
    product: str
    improvement: str

class KnowledgeDistribution(BaseModel):
    excellent: int
    good: int
    needs_improvement: int
    average_score: int
    trend: str
    excellent_change: int
    good_change: int
    needs_improvement_change: int


class AgentPerformanceResponse(BaseModel):
    agent_stats: List[AgentStat]
    knowledge_distribution: KnowledgeDistribution
    top_agents: List[TopAgent]

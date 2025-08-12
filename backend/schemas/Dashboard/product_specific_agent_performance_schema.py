from typing import List, Optional, Literal
from pydantic import BaseModel, Field


# ------------------------------
# 1. Product Knowledge Level Schema
# ------------------------------

class ScoreTrend(BaseModel):
    period: str
    change: str
    direction: Literal["up", "down"]


class RecommendedTrainingItem(BaseModel):
    title: str
    link: str


class ProductKnowledgeLevelSchema(BaseModel):
    product: str
    score: float = Field(..., ge=0, le=100)
    issues: str
    color: str  # CSS class string, e.g. "bg-green-500"
    specificExamples: List[str]
    recommendedTraining: List[RecommendedTrainingItem]
    scoreTrend: ScoreTrend
    actionableSteps: List[str]


# ------------------------------
# 2. Average Handling Time Schema
# ------------------------------

class AverageHandlingTimeSchema(BaseModel):
    product: str
    time: str  # format mm:ss
    trend: Literal["up", "down"]
    percent: str  # e.g. "10%"


# ------------------------------
# 3. Script Adherence Schema
# ------------------------------

class KeyMissedPoint(BaseModel):
    point: str
    frequency: str  # e.g. "15%"
    impact: Optional[str] = ""
    examples: List[str]


class KeyStrength(BaseModel):
    point: str
    examples: Optional[List[str]] = None


class ImpactOfNonAdherenceItem(BaseModel):
    area: str
    description: str
    severity: str  # e.g. "High", "Medium", "Low"


class TrendDetails(BaseModel):
    direction: Literal["up", "down", "stable"]
    change: str  # e.g. "+5% MoM"
    color: str  # CSS class string, e.g. "text-green-500"


class DrillDownDetails(BaseModel):
    keyMissedPoints: List[KeyMissedPoint]
    keyStrengths: List[KeyStrength]
    commonAgentFeedback: List[str]
    impactOfNonAdherence: List[ImpactOfNonAdherenceItem]
    recommendedScriptUpdates: List[str]
    trainingFocusAreas: List[str]


class ScriptAdherenceSchema(BaseModel):
    id: str  # adherence id like "credit-cards-adherence"
    product: str
    adherenceScore: int = Field(..., ge=0, le=100)
    trend: TrendDetails
    topMissedArea: str
    drillDownDetails: DrillDownDetails
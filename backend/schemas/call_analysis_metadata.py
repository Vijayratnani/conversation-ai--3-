from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


# ===============================
# Base Schema
# ===============================

class CallAnalysisMetadataBase(BaseModel):
    call_id: UUID
    sentiment: Optional[str]
    emotions: Optional[List[str]] = []
    intent: Optional[List[str]] = []
    threat: Optional[bool] = False
    churn_risk: Optional[str]
    entities: Optional[List[str]] = []
    opportunity_detected: Optional[bool] = False
    agent_responded: Optional[bool] = False
    agent_response_score: Optional[float]
    compliance_score: Optional[float]

    # JSONB sections
    customer_behavior: Optional[Dict[str, Any]] = None
    product_mentions: Optional[Dict[str, Any]] = None
    service_mentions: Optional[Dict[str, Any]] = None
    agent_mentions: Optional[Dict[str, Any]] = None
    customer_wishes: Optional[Dict[str, Any]] = None
    raw_json: Optional[Dict[str, Any]] = None


# ===============================
# Create Schema
# ===============================

class CallAnalysisMetadataCreate(CallAnalysisMetadataBase):
    pass


# ===============================
# Read Schema
# ===============================

class CallAnalysisMetadata(CallAnalysisMetadataBase):
    model_config = ConfigDict(from_attributes=True)

    analysis_id: int
    created_at: datetime

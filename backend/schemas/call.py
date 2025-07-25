from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID

# ===============================
# Base Call Schema
# ===============================

class CallBase(BaseModel):
    agent_id: int
    customer_id: int
    call_timestamp: datetime
    duration_seconds: int
    direction: Optional[str] = None
    outcome: Optional[str] = None
    customer_sentiment: Optional[str] = None
    agent_sentiment: Optional[str] = None
    flagged_for_review: Optional[bool] = False
    summary: Optional[str] = None
    next_action: Optional[str] = None
    contains_sensitive_info: Optional[bool] = False
    transcript_available: Optional[bool] = False
    agent_talk_time_seconds: Optional[int] = None
    customer_talk_time_seconds: Optional[int] = None
    silence_duration_seconds: Optional[int] = None
    interruptions: Optional[int] = None
    compliance_score: Optional[float] = None
    audio_recording_url: Optional[str] = None
    analysis_metadata: Optional[dict[str, Any]] = None


# ===============================
# Schema for Creating a Call
# ===============================

class CallCreate(CallBase):
    pass  # All fields are inherited from CallBase


# ===============================
# Schema for Reading a Call
# ===============================

class Call(CallBase):
    model_config = ConfigDict(from_attributes=True)

    call_id: UUID
    created_at: datetime

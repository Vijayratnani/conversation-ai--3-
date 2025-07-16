from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from models.call import CallStatus

# Base schema with common attributes
class CallBase(BaseModel):
    agent_id: int
    # customer_phone_number: str
    recording_url: Optional[str] = None
    analysis_metadata: Optional[dict[str, Any]] = None

# Schema for creating a new call
class CallCreate(CallBase):
    start_time: datetime
    end_time: datetime
    sentiment_score: float
    status: CallStatus

# Schema for reading/returning call data
class Call(CallBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    start_time: datetime
    end_time: datetime
    duration_seconds: int
    sentiment_score: float
    status: CallStatus

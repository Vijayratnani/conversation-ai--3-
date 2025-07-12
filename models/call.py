import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base, JSONB_GENERIC
import enum

class CallStatus(str, enum.Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in_progress"
    FAILED = "failed"

class Call(Base):
    __tablename__ = 'calls'
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey('agents.id'), nullable=False)
    customer_phone_number = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True))
    duration_seconds = Column(Integer)
    sentiment_score = Column(Float)
    status = Column(Enum(CallStatus), nullable=False, default=CallStatus.COMPLETED)
    recording_url = Column(String)
    analysis_metadata = Column(JSONB_GENERIC) # The JSONB field

    agent = relationship("Agent")
    transcripts = relationship("Transcript", back_populates="call", cascade="all, delete-orphan")

import datetime
import uuid
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Float,
    Boolean,
    Text,
    UUID as PG_UUID,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from db.base_class import Base

class Call(Base):
    __tablename__ = 'calls'

    call_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # agent_id = Column(Integer, ForeignKey('agents.agent_id'), nullable=False)
    # customer_id = Column(Integer, ForeignKey('customers.customer_id'), nullable=False)
    
    call_timestamp = Column(DateTime(timezone=True), nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    direction = Column(String(10))
    outcome = Column(String(50))
    customer_sentiment = Column(String(50))
    agent_sentiment = Column(String(50))
    flagged_for_review = Column(Boolean, default=False)
    summary = Column(Text)
    next_action = Column(Text)
    contains_sensitive_info = Column(Boolean, default=False)
    transcript_available = Column(Boolean, default=False)
    agent_talk_time_seconds = Column(Integer)
    customer_talk_time_seconds = Column(Integer)
    silence_duration_seconds = Column(Integer)
    interruptions = Column(Integer)
    compliance_score = Column(Float(precision=2))
    audio_recording_url = Column(Text)
    analysis_metadata = Column(JSONB)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    # agent = relationship("Agent", back_populates="calls")
    # customer = relationship("Customer", back_populates="calls")
    # transcripts = relationship("Transcript", back_populates="call", cascade="all, delete-orphan")
    # call_topics = relationship("CallTopic", back_populates="call", cascade="all, delete-orphan")
    # analysis = relationship("CallAnalysisMetadata", back_populates="call", uselist=False)


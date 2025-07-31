from models.customer import Customer
import datetime
import uuid
from sqlalchemy import Column, String, Integer, CheckConstraint, Boolean, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB,UUID,ENUM
from sqlalchemy.sql import func
from db.base_class import Base
from sqlalchemy import CheckConstraint


class Call(Base):
    __tablename__ = 'calls'

    call_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    agent_id = Column(Integer, ForeignKey('agents.agent_id'))
    customer_id = Column(Integer, ForeignKey('customers.customer_id'))
    call_timestamp = Column(DateTime(timezone=True), nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    direction = Column(String(10), nullable=False)  # <--- this line
    __table_args__ = (
        CheckConstraint("direction IN ('inbound', 'outbound')", name="check_call_direction"),  # <--- this line
    )
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
    compliance_score = Column(Numeric(5, 2))
    audio_recording_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    agent = relationship("Agent", back_populates="calls")
    customer = relationship("Customer", back_populates="calls")
    transcripts = relationship("Transcript", back_populates="call")
    script_adherences = relationship("ScriptAdherence", back_populates="call")
    environment_factors = relationship("CallEnvironmentFactor", back_populates="call")
    topics = relationship("CallTopic", back_populates="call")
    call_analysis_metadata = relationship("CallAnalysisMetadata", back_populates="call", uselist=False)

from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base

class CallAnalysisMetadata(Base):
    __tablename__ = 'call_analysis_metadata'

    call_analysis_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey('calls.call_id'), nullable=False,unique=True)

    sentiment = Column(String(50))
    emotions = Column(ARRAY(String))
    intent = Column(ARRAY(String))
    threat = Column(Boolean,default=False)
    churn_risk = Column(String(50))
    entities = Column(ARRAY(String))
    opportunity_detected = Column(Boolean,default=False)
    agent_responded = Column(Boolean,default=False)
    agent_response_score = Column(Numeric(3, 2))
    compliance_score = Column(Numeric(5, 2))

    customer_behavior = Column(JSONB)
    product_mentions = Column(JSONB)
    service_mentions = Column(JSONB)
    agent_mentions = Column(JSONB)
    customer_wishes = Column(JSONB)

    raw_json = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    call = relationship("Call", back_populates="call_analysis_metadata", uselist=False)


    # Relationships
    call = relationship("Call", back_populates="analysis_metadata", uselist=False)
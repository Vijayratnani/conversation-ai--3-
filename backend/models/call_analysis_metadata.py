import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base
import uuid


class CallAnalysisMetadata(Base):
    __tablename__ = "call_analysis_metadata"

    analysis_id = Column(Integer, primary_key=True, index=True)
    # call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id"), nullable=False, unique=True)

    sentiment = Column(String(50))
    emotions = Column(ARRAY(Text))
    intent = Column(ARRAY(Text))
    threat = Column(Boolean, default=False)
    churn_risk = Column(String(50))
    entities = Column(ARRAY(Text))
    opportunity_detected = Column(Boolean, default=False)
    agent_responded = Column(Boolean, default=False)
    agent_response_score = Column(Float(precision=2))
    compliance_score = Column(Float(precision=2))

    customer_behavior = Column(JSONB)
    product_mentions = Column(JSONB)
    service_mentions = Column(JSONB)
    agent_mentions = Column(JSONB)
    customer_wishes = Column(JSONB)

    raw_json = Column(JSONB)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to call (if needed)
    # call = relationship("Call", back_populates="analysis", uselist=False)

import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base  
import uuid


class CallAnalysisMetadata(Base):
    __tablename__ = "call_analysis_metadata"

    analysis_id = Column(Integer, primary_key=True, index=True)
    # call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id"), nullable=False, unique=True)

    sentiment = Column(String(50))
    emotions = Column(ARRAY(Text))
    intent = Column(ARRAY(Text))
    threat = Column(Boolean, default=False)
    churn_risk = Column(String(50))
    entities = Column(ARRAY(Text))
    opportunity_detected = Column(Boolean, default=False)
    agent_responded = Column(Boolean, default=False)
    agent_response_score = Column(Float(precision=2))
    compliance_score = Column(Float(precision=2))

    customer_behavior = Column(JSONB)
    product_mentions = Column(JSONB)
    service_mentions = Column(JSONB)
    agent_mentions = Column(JSONB)
    customer_wishes = Column(JSONB)

    raw_json = Column(JSONB)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to call (if needed)
    # call = relationship("Call", back_populates="analysis", uselist=False)

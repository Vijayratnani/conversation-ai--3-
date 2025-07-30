from sqlalchemy import Column, Integer, ForeignKey, String, Numeric
from sqlalchemy.orm import relationship
from db.base_class import Base
from sqlalchemy.dialects.postgresql import UUID

class CallEnvironmentFactor(Base):
    __tablename__ = 'call_environment_factors'

    factor_id = Column(Integer, primary_key=True, index=True)
    #call_id = Column(ForeignKey("calls.call_id"), nullable=False)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id", ondelete="CASCADE"), nullable=False)
    noise_type = Column(String(100), nullable=False)
    detection_count = Column(Integer, default=1)
    confidence_score = Column(Numeric(3, 2))

    # Relationships
    call = relationship("Call", back_populates="environment_factors")

from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from db.base_class import Base
from sqlalchemy.orm import relationship

class CallEnvironmentFactor(Base):
    __tablename__ = "call_environment_factors"

    factor_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id", ondelete="CASCADE"), nullable=False)
    noise_type = Column(String(100), nullable=False)
    detection_count = Column(Integer, default=1)
    confidence_score = Column(Numeric(3, 2))

    # Relationships
    call = relationship("Call", back_populates="environment_factors")
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from db.base_class import Base

class CallEnvironmentFactor(Base):
    __tablename__ = "call_environment_factors"

    factor_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id", ondelete="CASCADE"), nullable=False)
    noise_type = Column(String(100), nullable=False)
    detection_count = Column(Integer, default=1)
    confidence_score = Column(Numeric(3, 2))

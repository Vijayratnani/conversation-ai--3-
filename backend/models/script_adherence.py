from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from db.base_class import Base
from sqlalchemy.orm import relationship

class ScriptAdherence(Base):
    __tablename__ = "script_adherence"

    adherence_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"))
    score = Column(Numeric(5, 2), nullable=False)
    trend_from_previous = Column(Numeric(5, 2))
    top_missed_area = Column(Text)
    assessment_date = Column(Date, server_default=func.current_date())

# Relationships
    call = relationship("Call", back_populates="script_adherences")
    product = relationship("Product", back_populates="script_adherences")
    missed_points = relationship("MissedScriptPoint", back_populates="adherence")
 
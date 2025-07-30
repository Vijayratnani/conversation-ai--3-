from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, Date
from sqlalchemy.orm import relationship
from db.base_class import Base

class ScriptAdherence(Base):
    __tablename__ = 'script_adherence'

    adherence_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(ForeignKey("calls.call_id"), nullable=False)
    product_id = Column(ForeignKey("products.product_id"), nullable=False)
    score = Column(Numeric(5, 2), nullable=False)
    trend_from_previous = Column(Numeric(5, 2))
    top_missed_area = Column(Text)
    assessment_date = Column(Date, server_default="current_date")

    # Relationships
    call = relationship("Call", back_populates="script_adherences")
    product = relationship("Product", back_populates="script_adherences")
    missed_points = relationship("MissedScriptPoint", back_populates="adherence")

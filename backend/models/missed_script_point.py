from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base_class import Base

class MissedScriptPoint(Base):
    __tablename__ = 'missed_script_points'

    missed_point_id = Column(Integer, primary_key=True, index=True)
    adherence_id = Column(Integer, ForeignKey("script_adherence.adherence_id"), nullable=False)
    point_description = Column(Text, nullable=False)
    frequency = Column(Integer)
    impact = Column(Text)

    # Relationships
    adherence = relationship("ScriptAdherence", back_populates="missed_points")

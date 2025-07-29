from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base

class ScriptAdherence(Base):
    __tablename__ = "script_adherence"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.agent_id"), nullable=False)
    score = Column(Float, nullable=False)
    assessment_date = Column(Date, nullable=False)

    agent = relationship("Agent", back_populates="script_adherence_scores")

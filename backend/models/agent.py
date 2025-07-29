from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base

class Agent(Base):
    __tablename__ = 'agents'
    agent_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    script_adherence_scores = relationship("ScriptAdherence", back_populates="agent", cascade="all, delete-orphan")
    product_knowledge_scores = relationship("ProductKnowledgeScores", back_populates="agent", cascade="all, delete-orphan")

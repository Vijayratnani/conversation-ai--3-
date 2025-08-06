from sqlalchemy import Column, String, Integer, Date, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base
from sqlalchemy.orm import relationship


class Agent(Base):
    __tablename__ = 'agents'

    agent_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    team = Column(String(100))
    hire_date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    calls = relationship("Call", back_populates="agent")
    knowledge_scores = relationship("ProductKnowledgeScore", back_populates="agent")
    script_adherences = relationship("ScriptAdherence", back_populates="agent")
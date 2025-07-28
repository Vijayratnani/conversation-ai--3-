from sqlalchemy import Column, Integer, String, DateTime,Boolean,Date
from sqlalchemy.sql import func
from db.base_class import Base

class Agent(Base):
    __tablename__ = 'agents'
    #id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, primary_key=True, index=True)
    #name = Column(String, nullable=False)
    name = Column(String(255), nullable=False)
    #email = Column(String, unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    team = Column(String(100)) #column added
    hire_date = Column(Date) #column added
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

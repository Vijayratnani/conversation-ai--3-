from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base

class Transcript(Base):
    __tablename__ = 'transcripts'
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey('calls.id'), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    speaker = Column(String, nullable=False) # e.g., "Agent" or "Customer"
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    call = relationship("Call", back_populates="transcripts")

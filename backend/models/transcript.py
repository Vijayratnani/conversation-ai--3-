import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String, Text, Integer,BigInteger,Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base

class Transcript(Base):
    __tablename__ = 'transcripts'

    #transcript_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    transcript_id = Column(BigInteger, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id", ondelete="CASCADE"), nullable=False)
    #call_id = Column(UUID(as_uuid=True), ForeignKey('calls.call_id'), nullable=False)
    
    #speaker = Column(String(10), nullable=False)  # "Agent" or "Customer"
    speaker = Column(String(10))
    speaker_name = Column(String(255))
    timestamp_in_call_seconds = Column(Integer, nullable=False)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text)
    #is_sensitive = Column(String, default=False)
    is_sensitive = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Uncomment when needed
    # call = relationship("Call", back_populates="transcripts")

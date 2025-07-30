import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base

class Transcript(Base):
    __tablename__ = 'transcripts'

    transcript_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey('calls.call_id'), nullable=False)
    speaker = Column(String(10), nullable=False)
    speaker_name = Column(String(255))
    timestamp_in_call_seconds = Column(Integer, nullable=False)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text)
    is_sensitive = Column(String, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    call = relationship("Call", back_populates="transcripts")
    tags = relationship("TranscriptTag", back_populates="transcript")

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base_class import Base

class TranscriptTag(Base):
    __tablename__ = 'transcript_tags'

    tag_id = Column(Integer, primary_key=True, index=True)
    transcript_id = Column(ForeignKey("transcripts.transcript_id"), nullable=False)
    type = Column(String(50))
    text = Column(String(255))
    variant = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    transcript = relationship("Transcript", back_populates="tags")

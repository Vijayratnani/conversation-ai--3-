from sqlalchemy import Column, BigInteger, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from db.base_class import Base

class TranscriptTag(Base):
    __tablename__ = "transcript_tags"

    tag_id = Column(BigInteger, primary_key=True, index=True)
    transcript_id = Column(BigInteger, ForeignKey("transcripts.transcript_id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)
    text = Column(String(255), nullable=False)
    variant = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

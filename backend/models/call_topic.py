from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.base_class import Base


class CallTopic(Base):
    __tablename__ = 'call_topics'

    call_topic_id = Column(Integer, primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.call_id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.topic_id"), nullable=False)
    mention_count = Column(Integer, default=1)
    mention_snippet = Column(Text)  # <-- Added column for transcript snippet

    __table_args__ = (
        UniqueConstraint("call_id", "topic_id", name="_call_topic_uc"),
    )

    # Relationships
    call = relationship("Call", back_populates="topics")
    topic = relationship("Topic", back_populates="call_topics")

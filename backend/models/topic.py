from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from db.base_class import Base

class Topic(Base):
    __tablename__ = 'topics'

    topic_id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(255), nullable=False, unique=True)
    name_ur = Column(String(255), unique=True)
    category = Column(String(100))

    # Relationships
    call_topics = relationship("CallTopic", back_populates="topic")

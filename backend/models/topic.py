from sqlalchemy import Column, Integer, String
from db.base_class import Base

class Topic(Base):
    __tablename__ = "topics"

    topic_id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(255), unique=True, nullable=False)
    name_ur = Column(String(255), unique=True)
    category = Column(String(100))

from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base

class ProductKnowledgeScores(Base):
    __tablename__ = "product_knowledge_scores"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.agent_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    score = Column(Float, nullable=False)
    assessment_date = Column(Date, nullable=False)

    agent = relationship("Agent", back_populates="product_knowledge_scores")
    product = relationship("Product", back_populates="knowledge_scores")

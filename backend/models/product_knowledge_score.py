from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, Date
from sqlalchemy.orm import relationship
from db.base_class import Base

class ProductKnowledgeScore(Base):
    __tablename__ = 'product_knowledge_scores'

    score_id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(ForeignKey("agents.agent_id"), nullable=False)
    product_id = Column(ForeignKey("products.product_id"), nullable=False)
    score = Column(Numeric(5, 2), nullable=False)
    issues_noted = Column(Text)
    assessment_date = Column(Date, nullable=False)

    # Relationships
    agent = relationship("Agent", back_populates="knowledge_scores")
    product = relationship("Product", back_populates="knowledge_scores")

from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from db.base_class import Base

class Product(Base):
    __tablename__ = 'products'

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    category = Column(String(100))

    # Relationships
    script_adherences = relationship("ScriptAdherence", back_populates="product")
    knowledge_scores = relationship("ProductKnowledgeScore", back_populates="product")

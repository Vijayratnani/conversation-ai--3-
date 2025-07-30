from sqlalchemy import Column, Integer, String
from db.base_class import Base
from sqlalchemy.orm import relationship


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    #category = Column(String(100), nullable=True)
    category = Column(String(100))

# Relationships
    script_adherences = relationship("ScriptAdherence", back_populates="product")
    knowledge_scores = relationship("ProductKnowledgeScore", back_populates="product")

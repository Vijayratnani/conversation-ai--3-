from sqlalchemy import Column, Integer, String
from db.base_class import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    #category = Column(String(100), nullable=True)
    category = Column(String(100))

    # Optional: Add relationships here if needed, e.g., to adherence or knowledge score
    # script_adherences = relationship("ScriptAdherence", back_populates="product")
    # product_knowledge_scores = relationship("ProductKnowledgeScore", back_populates="product")

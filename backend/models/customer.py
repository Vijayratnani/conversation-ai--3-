from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.base_class import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


# ===============================
# Base Schema
# ===============================

class ProductBase(BaseModel):
    name: str
    category: Optional[str] = None


# ===============================
# Create Schema
# ===============================

class ProductCreate(ProductBase):
    pass


# ===============================
# Read Schema
# ===============================

class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    product_id: int

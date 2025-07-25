from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.product import Product
from schemas.product import ProductCreate
from .base import CRUDBase


class CRUDProduct(CRUDBase[Product, ProductCreate, ProductCreate]):

    async def get_by_name(self, db: AsyncSession, name: str) -> Product | None:
        result = await db.execute(
            select(Product).where(Product.name == name)
        )
        return result.scalars().first()


# Instance
product = CRUDProduct(Product)

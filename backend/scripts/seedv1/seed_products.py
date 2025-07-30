from models.product import Product

async def seed_products(db):
    products = [
        Product(name="VocaCRM"),
        Product(name="CallTrackPro"),
        Product(name="SalesBuddy"),
    ]
    db.add_all(products)
    await db.commit()

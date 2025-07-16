from fastapi import APIRouter
from models.product_stats import ProductStatItem
from data.product_stats_data import product_stats_data

router = APIRouter()

@router.get("/product-stats", response_model=list[ProductStatItem])
def get_product_stats():
    return product_stats_data

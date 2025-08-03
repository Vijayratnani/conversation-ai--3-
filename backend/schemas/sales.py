# schemas/sales.py

from pydantic import BaseModel
from typing import List


class CrossSellStat(BaseModel):
    from_: str
    to: str
    successPercent: float

    class Config:
        fields = {
            'from_': 'from',
        }


class MissedKeyword(BaseModel):
    phrase: str
    count: int


class SalesEffectivenessResponse(BaseModel):
    successfulSalesPercent: float
    successfulSalesCount: int
    totalCalls: int
    crossSellSuccessPercent: float
    topCrossSell: CrossSellStat
    lowestCrossSell: CrossSellStat
    missedOpportunitiesCount: int
    topMissedKeywords: List[MissedKeyword]

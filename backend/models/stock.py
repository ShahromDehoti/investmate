from pydantic import BaseModel

class StockData(BaseModel):
    name: str
    symbol: str
    price: float
    summary: str
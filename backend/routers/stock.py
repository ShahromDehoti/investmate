from fastapi import APIRouter, HTTPException
from models.stock import StockData
import yfinance as yf

router = APIRouter()

@router.get("/stock/{symbol}", response_model=StockData)
def get_stock(symbol: str):
    stock = yf.Ticker(symbol)
    info = stock.info

    if "shortName" not in info or "currentPrice" not in info:
        raise HTTPException(status_code=404, detail="Stock not found or incomplete data.")

    return {
        "symbol": symbol.upper(),
        "name": info.get("shortName", "N/A"),
        "price": info.get("currentPrice", 0.0),
        "summary": info.get("longBusinessSummary", "Summary not available.")
    }
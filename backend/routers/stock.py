from fastapi import APIRouter, HTTPException
from models.stock import StockData
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

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
        "summary": info.get("longBusinessSummary", "Summary not available."),
        "logo_url": info.get("logo_url", 'None'),
        "country": info.get("country", 'None')
    }

@router.get("/stock/{symbol}/details")
def get_stock_details(symbol: str):
    """Get detailed stock information including historical data and performance metrics"""
    try:
        stock = yf.Ticker(symbol.upper())
        info = stock.info
        
        if not info.get("currentPrice"):
            raise HTTPException(status_code=404, detail="Stock not found")
        
        # Get historical data for 1 year
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        hist = stock.history(start=start_date, end=end_date)
        
        # Calculate 1 year return
        if len(hist) > 0:
            start_price = hist.iloc[0]['Close']
            end_price = hist.iloc[-1]['Close']
            one_year_return = ((end_price - start_price) / start_price) * 100
        else:
            one_year_return = 0
        
        # Format historical data for chart
        chart_data = []
        for index, row in hist.iterrows():
            chart_data.append({
                "date": index.strftime("%Y-%m-%d"),
                "price": round(row['Close'], 2),
                "volume": row['Volume']
            })
        
        # Get performance metrics
        performance_metrics = {
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", 0),
            "one_year_return": round(one_year_return, 2),
            "beta": info.get("beta", 0),
            "dividend_yield": info.get("dividendYield", 0),
            "price_to_book": info.get("priceToBook", 0),
            "fifty_two_week_high": info.get("fiftyTwoWeekHigh", 0),
            "fifty_two_week_low": info.get("fiftyTwoWeekLow", 0)
        }
        
        return {
            "symbol": symbol.upper(),
            "name": info.get("shortName", "N/A"),
            "current_price": info.get("currentPrice", 0),
            "chart_data": chart_data,
            "performance_metrics": performance_metrics
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock details: {str(e)}")
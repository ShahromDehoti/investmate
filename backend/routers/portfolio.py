from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import yfinance as yf

from database import get_db
from models.portfolio import (
    PortfolioItemDB, 
    PortfolioItem, 
    PortfolioItemCreate, 
    PortfolioItemUpdate,
    PortfolioItemWithCurrentPrice
)

router = APIRouter()

@router.get("/portfolio", response_model=List[PortfolioItemWithCurrentPrice])
def get_portfolio(db: Session = Depends(get_db)):
    """Get all portfolio items with current prices and calculations"""
    portfolio_items = db.query(PortfolioItemDB).all()
    result = []
    
    for item in portfolio_items:
        # Get current price from Yahoo Finance
        try:
            stock = yf.Ticker(item.symbol)
            current_price = stock.info.get("currentPrice", 0.0)
        except:
            current_price = 0.0
        
        # Calculate portfolio metrics
        total_cost = item.shares * item.avg_price
        total_value = item.shares * current_price
        gain_loss = total_value - total_cost
        gain_loss_percent = (gain_loss / total_cost * 100) if total_cost > 0 else 0
        
        portfolio_item = PortfolioItemWithCurrentPrice(
            id=item.id,
            symbol=item.symbol,
            name=item.name,
            shares=item.shares,
            avg_price=item.avg_price,
            created_at=item.created_at,
            updated_at=item.updated_at,
            current_price=current_price,
            total_value=total_value,
            total_cost=total_cost,
            gain_loss=gain_loss,
            gain_loss_percent=gain_loss_percent
        )
        result.append(portfolio_item)
    
    return result

@router.post("/portfolio", response_model=PortfolioItem)
def add_to_portfolio(item: PortfolioItemCreate, db: Session = Depends(get_db)):
    """Add a new stock to portfolio"""
    # Check if stock already exists in portfolio
    existing_item = db.query(PortfolioItemDB).filter(PortfolioItemDB.symbol == item.symbol.upper()).first()
    
    if existing_item:
        raise HTTPException(status_code=400, detail=f"Stock {item.symbol} already exists in portfolio")
    
    # Verify stock exists by getting current price
    try:
        stock = yf.Ticker(item.symbol.upper())
        current_price = stock.info.get("currentPrice")
        if not current_price:
            raise HTTPException(status_code=404, detail="Stock not found")
    except:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    db_item = PortfolioItemDB(
        symbol=item.symbol.upper(),
        name=item.name,
        shares=item.shares,
        avg_price=item.avg_price,
        logo_url=item.logo_url,
        country=item.country
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return db_item

@router.put("/portfolio/{item_id}", response_model=PortfolioItem)
def update_portfolio_item(item_id: int, item_update: PortfolioItemUpdate, db: Session = Depends(get_db)):
    """Update portfolio item (shares or average price)"""
    db_item = db.query(PortfolioItemDB).filter(PortfolioItemDB.id == item_id).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    
    if item_update.shares is not None:
        db_item.shares = item_update.shares
    
    if item_update.avg_price is not None:
        db_item.avg_price = item_update.avg_price
    
    db.commit()
    db.refresh(db_item)
    
    return db_item

@router.delete("/portfolio/{item_id}")
def remove_from_portfolio(item_id: int, db: Session = Depends(get_db)):
    """Remove a stock from portfolio"""
    db_item = db.query(PortfolioItemDB).filter(PortfolioItemDB.id == item_id).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    
    db.delete(db_item)
    db.commit()
    
    return {"message": f"Removed {db_item.symbol} from portfolio"}

@router.get("/portfolio/summary")
def get_portfolio_summary(db: Session = Depends(get_db)):
    """Get portfolio summary with total value, cost, and gain/loss"""
    portfolio_items = db.query(PortfolioItemDB).all()
    
    total_cost = 0
    total_value = 0
    
    for item in portfolio_items:
        try:
            stock = yf.Ticker(item.symbol)
            current_price = stock.info.get("currentPrice", 0.0)
        except:
            current_price = 0.0
        
        item_cost = item.shares * item.avg_price
        item_value = item.shares * current_price
        
        total_cost += item_cost
        total_value += item_value
    
    total_gain_loss = total_value - total_cost
    total_gain_loss_percent = (total_gain_loss / total_cost * 100) if total_cost > 0 else 0
    
    return {
        "total_cost": total_cost,
        "total_value": total_value,
        "total_gain_loss": total_gain_loss,
        "total_gain_loss_percent": total_gain_loss_percent,
        "item_count": len(portfolio_items)
    }

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Optional

Base = declarative_base()

# Database Models
class PortfolioItemDB(Base):
    __tablename__ = "portfolio_items"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    shares = Column(Float, nullable=False, default=0.0)
    avg_price = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models for API
class PortfolioItemBase(BaseModel):
    symbol: str
    name: str
    shares: float
    avg_price: float

class PortfolioItemCreate(PortfolioItemBase):
    pass

class PortfolioItemUpdate(BaseModel):
    shares: Optional[float] = None
    avg_price: Optional[float] = None

class PortfolioItem(PortfolioItemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PortfolioItemWithCurrentPrice(PortfolioItem):
    current_price: Optional[float] = None
    total_value: Optional[float] = None
    total_cost: Optional[float] = None
    gain_loss: Optional[float] = None
    gain_loss_percent: Optional[float] = None 
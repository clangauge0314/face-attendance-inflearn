from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AccessCheckInRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")


class AccessResponse(BaseModel):
    id: int
    userId: int
    userName: str
    organizationType: str
    checkInTime: str
    similarity: Optional[float] = None
    status: str
    createdAt: str

    class Config:
        from_attributes = True


class AccessListResponse(BaseModel):
    total: int
    items: list[AccessResponse]


class AccessStatsItem(BaseModel):
    label: str
    count: int
    date: str
    firstCheckIn: float | None = None 

class AccessStatsResponse(BaseModel):
    period: str
    items: list[AccessStatsItem]


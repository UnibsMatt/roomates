from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


class TokenResponse(BaseModel):
    token: str
    user_id: int
    email: str
    name: str


class UserRead(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Room Images ─────────────────────────────────────────────────────────────

class RoomImageRead(BaseModel):
    id: int
    room_id: int
    filename: str
    url: str

    class Config:
        from_attributes = True


# ─── Rooms ───────────────────────────────────────────────────────────────────

class RoomCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=5000)
    location: Optional[str] = Field(default=None, max_length=500)
    price: float = Field(..., gt=0)


class RoomUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=5000)
    location: Optional[str] = Field(default=None, max_length=500)
    price: Optional[float] = Field(default=None, gt=0)


class RoomRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    price: float
    is_closed: bool
    owner_id: int
    owner_name: str
    images: List[RoomImageRead] = []
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Applications ─────────────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)
    course: str = Field(..., min_length=1, max_length=255)
    sex: str = Field(..., min_length=1, max_length=1)
    age: int = Field(..., ge=18, le=100)
    message: Optional[str] = Field(default=None, max_length=2000)


class ApplicationRead(BaseModel):
    id: int
    room_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    course: str
    sex: str
    age: int
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

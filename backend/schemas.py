from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    """Payload for creating a new rental application."""

    full_name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)
    course: str = Field(..., min_length=1, max_length=255)
    sex: str = Field(..., min_length=1, max_length=1)
    age: int = Field(..., ge=18, le=100)
    message: Optional[str] = Field(default=None, max_length=2000)


class ApplicationRead(BaseModel):
    """Representation of an application returned to API consumers."""

    id: int
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


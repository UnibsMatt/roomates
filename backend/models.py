from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from database import Base


class Application(Base):
    """SQLAlchemy model representing a rental application."""

    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    course = Column(String(255), nullable=False)
    sex = Column(String(1), nullable=False)
    age = Column(Integer, nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True,
    )


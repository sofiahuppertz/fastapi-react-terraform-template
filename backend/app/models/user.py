from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime

from app.models.base import BaseModel

class User(BaseModel):
    """User model for storing user information"""
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_superuser = Column(Boolean, default=False)
    last_connected_at = Column(DateTime(timezone=True), nullable=True)


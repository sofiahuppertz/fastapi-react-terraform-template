from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class UserResponse(BaseModel):
    """Schema for user response"""
    id: UUID
    email: str
    is_superuser: bool
    last_connected_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


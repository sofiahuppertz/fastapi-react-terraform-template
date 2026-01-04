from pydantic import BaseModel, Field
from datetime import datetime
from typing import Generic, TypeVar, List
from uuid import UUID

class BaseCreateSchema(BaseModel):
    """Base schema for create operations"""
    pass

class BaseResponseSchema(BaseModel):
    """Base schema for response data with common fields"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Generic type for paginated responses
T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response schema"""
    items: List[T] = Field(..., description="List of items for the current page")
    total: int = Field(..., description="Total number of items across all pages")
    page: int = Field(..., description="Current page number (1-indexed)")
    page_size: int = Field(..., description="Number of items per page")
    total_pages: int = Field(..., description="Total number of pages")
    has_next: bool = Field(..., description="Whether there is a next page")
    has_previous: bool = Field(..., description="Whether there is a previous page")
    
    class Config:
        from_attributes = True

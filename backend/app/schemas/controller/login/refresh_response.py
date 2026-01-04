from pydantic import BaseModel


class RefreshResponse(BaseModel):
    """Schema for token refresh response"""
    access_token: str
    token_type: str
    expires_in: int

from pydantic import BaseModel


class LoginResponse(BaseModel):
    """Schema for login response"""
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    is_superuser: bool

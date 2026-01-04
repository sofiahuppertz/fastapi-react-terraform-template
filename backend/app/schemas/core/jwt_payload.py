from pydantic import BaseModel
from typing import Literal


class JWTPayload(BaseModel):
    """JWT token payload schema"""
    sub: str  # user ID as string
    exp: int  # expiration timestamp
    type: Literal["access", "refresh"]  # token type

from pydantic import BaseModel, Field, field_validator

class PasswordUpdateRequest(BaseModel):
    current_password: str = Field(..., min_length=1, description="Current password for verification")
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        """Validate that new password meets security requirements"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        # Add more validations as needed (uppercase, lowercase, numbers, special chars)
        return v
    
    @field_validator('current_password')
    @classmethod
    def validate_current_password(cls, v):
        """Validate current password is not empty"""
        if not v or not v.strip():
            raise ValueError('Current password cannot be empty')
        return v


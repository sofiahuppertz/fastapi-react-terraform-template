from pydantic import BaseModel

class PasswordUpdateResponse(BaseModel):
    message: str
    success: bool
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Password updated successfully",
                "success": True
            }
        }
    }


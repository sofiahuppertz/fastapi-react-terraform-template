from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.auth import Auth
from app.core.database import get_db
from app.exceptions import AuthError
from app.schemas.core.jwt_payload import JWTPayload
from app.schemas.controller.login.login_response import LoginResponse
from app.schemas.controller.login.refresh_response import RefreshResponse
from app.schemas.controller.login.password_update_request import PasswordUpdateRequest
from app.schemas.controller.login.password_update_response import PasswordUpdateResponse
from app.services.login.login_service import LoginService

auth_router = APIRouter()
auth_service = LoginService()

@auth_router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access and refresh tokens."""
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise AuthError("Incorrect email or password")
    response = auth_service.create_tokens(db, user.id)
    auth_service.update_last_connected(db, user)
    return response


@auth_router.post("/refresh", response_model=RefreshResponse)
async def refresh_access_token(
    user_data: JWTPayload = Depends(auth_service.auth.get_user_from_refresh_token),
    db: Session = Depends(get_db)
):
    """Get a new access token using a refresh token."""
    return auth_service.refresh_access_token(db, user_data.sub)


@auth_router.put("/password", response_model=PasswordUpdateResponse)
async def change_password(
    password_data: PasswordUpdateRequest,
    current_user: JWTPayload = Depends(Auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's password."""
    auth_service.update_password(
        db,
        UUID(current_user.sub),
        password_data.current_password,
        password_data.new_password
    )
    return PasswordUpdateResponse(message="Password updated successfully", success=True)


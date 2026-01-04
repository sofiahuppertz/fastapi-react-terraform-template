from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.auth import Auth

from app.exceptions.database import ConflictError, NotFoundError
from app.repositories.user import UserRepo
from app.schemas.model.user.user_create import UserCreate
from app.schemas.controller.login.login_response import LoginResponse
from app.schemas.controller.login.refresh_response import RefreshResponse


class AuthService:
    def __init__(self):
        self.auth = Auth()
        
    def refresh_access_token(self, db: Session, user_id: UUID) -> RefreshResponse:
        """Create a new access token using a refresh token."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        access_token = self.auth.create_access_token(user_id)
        return RefreshResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=self.auth.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        
    def create_tokens(self, db: Session, user_id: UUID) -> LoginResponse:
        """Create both access and refresh tokens for the user."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        access_token = self.auth.create_access_token(user_id)
        refresh_token = self.auth.create_refresh_token(user_id)
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=self.auth.ACCESS_TOKEN_EXPIRE_MINUTES,
            is_superuser=user.is_superuser
        )

    def authenticate_user(self, db: Session, email: str, password: str):
        """Authenticate user by email and password. Returns user or None."""
        user_repo = UserRepo(db)
        user = user_repo.get(email=email)
        if not user or not self.auth.verify_password(password, user.password):
            return None
        return user

    def create_user(self, db: Session, user_data: UserCreate):
        """Create a new user (only superusers can do this)."""
        user_repo = UserRepo(db)
        existing_user = user_repo.get(email=user_data.email)
        if existing_user:
            raise ConflictError("Email", "already registered")
        hashed_password = self.auth.get_password_hash(user_data.password)
        return user_repo.create(user_data.email, hashed_password, user_data.is_superuser)

    def delete_user(self, db: Session, user_id: UUID, admin_user_id: UUID):
        """Delete a user (only superusers can do this)."""
        if user_id == admin_user_id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        user_repo = UserRepo(db)
        user_repo.delete(user_id)  # Raises NotFoundError if user doesn't exist

    def update_password(self, db: Session, user_id: UUID, current_password: str, new_password: str):
        """Update user's password after verifying current password."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        if not self.auth.verify_password(current_password, user.password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        if self.auth.verify_password(new_password, user.password):
            raise HTTPException(status_code=400, detail="New password must be different from current password")
        new_hashed_password = self.auth.get_password_hash(new_password)
        return user_repo.update(user_id, password=new_hashed_password)
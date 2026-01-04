# Standard library imports
import os
from typing import Literal
from uuid import UUID
from datetime import datetime, timezone, timedelta

# Third-party imports
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.exceptions.auth import AuthError
from app.schemas.core.jwt_payload import JWTPayload

# Create OAuth2 scheme instances
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")
oauth2_refresh_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/refresh", scheme_name="refresh")

SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

class Auth:
    def __init__(self):
        # Use explicit bcrypt configuration to avoid initialization issues
        self.pwd_context = CryptContext(
            schemes=["bcrypt"], 
            deprecated="auto",
            bcrypt__default_rounds=12,
            bcrypt__min_rounds=10,
            bcrypt__max_rounds=15
        )
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def create_refresh_token(self, user_id: UUID) -> str:
        """Create both access and refresh tokens for the user."""
        # Create access token
        refresh_expire = datetime.now(timezone.utc) + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_token = JWTPayload(
            sub=str(user_id),  # Convert UUID to string for JWT
            exp=int(refresh_expire.timestamp()),
            type="refresh"
        )
        return jwt.encode(refresh_token.model_dump(), REFRESH_SECRET_KEY, algorithm=ALGORITHM)

    def create_access_token(self, user_id: UUID) -> str:
        access_expire = datetime.now(timezone.utc) + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = JWTPayload(
            sub=str(user_id),  # Convert UUID to string for JWT
            exp=int(access_expire.timestamp()),
            type="access"
        )
        return jwt.encode(access_token.model_dump(), SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    async def get_current_user(token: str = Depends(oauth2_scheme)) -> JWTPayload:
        """Get the current user data from the JWT token without database query."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "access":
                raise AuthenticationError("Invalid token type")
            return JWTPayload(**payload)
        except ExpiredSignatureError:
            raise AuthenticationError("Token expired")
        except JWTError:
            raise AuthenticationError("Could not validate credentials")

    @staticmethod
    async def get_user_from_refresh_token(token: str = Depends(oauth2_refresh_scheme)) -> JWTPayload:
        """Get user data from refresh token without database query."""
        try:
            payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "refresh":
                print("Invalid token type detected")
                raise AuthenticationError("Invalid refresh token type")
                
            jwt_payload = JWTPayload(**payload)
            return jwt_payload
            
        except ExpiredSignatureError as e:
            print(f"Token expired: {str(e)}")
            raise AuthenticationError("Refresh token expired")
        except JWTError as e:
            print(f"JWT Error: {str(e)}")
            raise AuthenticationError("Could not validate refresh token")
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise AuthenticationError("Authentication failed")

    @staticmethod
    async def get_superuser(
        token: str = Depends(oauth2_scheme)
    ) -> JWTPayload:
        """Verify that the current user is a superuser.
        Note: This requires database access, so it should be used with db: Session = Depends(get_db) in the endpoint.
        """
        # Import here to avoid circular dependency
        from app.core.database import get_db
        from app.repositories.user.user_repository import UserRepository
        
        # First, validate the token and get JWT payload
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "access":
                raise AuthenticationError("Invalid token type")
            jwt_payload = JWTPayload(**payload)
        except ExpiredSignatureError:
            raise AuthenticationError("Token expired")
        except JWTError:
            raise AuthenticationError("Could not validate credentials")
        
        # Get database session and check superuser status
        db = next(get_db())
        try:
            user_repo = UserRepository()
            user = user_repo.get_by_id(db, UUID(jwt_payload.sub))
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            if not user.is_superuser:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized. Superuser access required."
                )
            
            return jwt_payload
        finally:
            db.close()

from sqlalchemy.orm import Session
from uuid import UUID
from app.models.user import User
from app.exceptions.database import NotFoundError, ConflictError

class UserRepo:

    def __init__(self, db: Session):
        self.db = db

    def get(self, **kwargs):
        query = self.db.query(User)
        for attr, value in kwargs.items():
            query = query.filter(getattr(User, attr) == value)
        return query.first()

    def create(self, email: str, password: str, is_superuser: bool = False):
        user = User(
            email=email,
            password=password,
            is_superuser=is_superuser
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user_id: UUID, **kwargs):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundError("User", str(user_id))
        for attr, value in kwargs.items():
            setattr(user, attr, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: UUID) -> None:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundError("User", str(user_id))
        self.db.delete(user)
        self.db.commit()

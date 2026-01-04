from fastapi import APIRouter

# Public controllers
from app.controllers.auth.auth_controller import auth_router

public_router = APIRouter(prefix="/api")

# Authentication (register/login/refresh/me/activate)
public_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["authentication"]
)





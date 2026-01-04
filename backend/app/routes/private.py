from fastapi import APIRouter


# Private routes that require authentication
private_router = APIRouter(prefix="/api")


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

# Import logging
from app.core.logging import logger

# Import routers
from app.routes.public import public_router
from app.routes.private import private_router

app = FastAPI(
    title="backend",
    version="1.0.0",
)


# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(public_router)
app.include_router(private_router)


@app.get("/", include_in_schema=False)
async def root():
    return {"status": "ok", "service": "backend-api", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

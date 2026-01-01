from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import os

# ------------------------------------------------------------------------------
# Application Metadata
# ------------------------------------------------------------------------------
app = FastAPI(
    title="ECS Python API",
    description="FastAPI service running on AWS ECS Fargate behind ALB",
    version="1.0.0",
    contact={"name": "Ajay | Backend API", "email": "not-set@example.com"}
)

# ------------------------------------------------------------------------------
# Response Models (For consistency & validation)
# ------------------------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str

class RootResponse(BaseModel):
    message: str

class InfoResponse(BaseModel):
    environment: str
    region: str
    container_id: str

# ------------------------------------------------------------------------------
# Root / Landing
# ------------------------------------------------------------------------------
@app.get("/", response_model=RootResponse)
def root() -> Dict[str, str]:
    return {"message": "ECS Fargate Python API running successfully"}

# ------------------------------------------------------------------------------
# Healthcheck (Used by ALB Target Group)
# ------------------------------------------------------------------------------
@app.get("/health", response_model=HealthResponse)
def health() -> Dict[str, str]:
    return {"status": "healthy"}

# ------------------------------------------------------------------------------
# Readiness Probe (Future-proof for DB / cache checks)
# ------------------------------------------------------------------------------
@app.get("/ready", response_model=HealthResponse)
def readiness() -> Dict[str, str]:
    # Placeholder: Add DB/cache/ping checks later
    return {"status": "ready"}

# ------------------------------------------------------------------------------
# Environment Info (Useful for debugging deployments)
# ------------------------------------------------------------------------------
@app.get("/info", response_model=InfoResponse)
def info() -> InfoResponse:
    return InfoResponse(
        environment=os.getenv("APP_ENV", "dev"),
        region=os.getenv("AWS_REGION", "ap-south-2"),
        container_id=os.getenv("HOSTNAME", "unknown")  # Fargate container ID
    )

# ------------------------------------------------------------------------------
# Example Error Route (Demonstrates exception handling)
# ------------------------------------------------------------------------------
@app.get("/error")
def fail():
    raise HTTPException(status_code=500, detail="Intentional error for testing.")

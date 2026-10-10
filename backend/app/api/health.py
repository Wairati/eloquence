from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.config import Settings, get_settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    coaching_available: bool


@router.get("/health", response_model=HealthResponse)
def health(settings: Annotated[Settings, Depends(get_settings)]) -> HealthResponse:
    """Lets the app show whether AI coaching is available before you start a session."""
    return HealthResponse(status="ok", coaching_available=settings.coaching_enabled)

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Server configuration, read from environment variables or backend/.env.

    Secrets (the Gemini key) live only here — never in the frontend bundle.
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Empty means AI coaching is switched off; the app still works without it.
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    # Comma-separated origins allowed to call the API (the deployed PWA, plus local dev).
    allowed_origins: str = Field(default="http://localhost:5173,http://localhost:4173")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def coaching_enabled(self) -> bool:
        return bool(self.gemini_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()

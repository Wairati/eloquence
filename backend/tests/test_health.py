from fastapi.testclient import TestClient

from app.config import Settings, get_settings
from app.main import app


def client_with(settings: Settings) -> TestClient:
    app.dependency_overrides[get_settings] = lambda: settings
    return TestClient(app)


def teardown_function() -> None:
    app.dependency_overrides.clear()


def test_health_reports_coaching_off_without_key() -> None:
    response = client_with(Settings(gemini_api_key="")).get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "coaching_available": False}


def test_health_reports_coaching_on_with_key() -> None:
    response = client_with(Settings(gemini_api_key="test-key")).get("/api/health")
    assert response.json()["coaching_available"] is True


def test_health_never_leaks_the_key() -> None:
    response = client_with(Settings(gemini_api_key="super-secret")).get("/api/health")
    assert "super-secret" not in response.text


def test_cors_origins_are_parsed_from_a_comma_list() -> None:
    settings = Settings(allowed_origins=" https://a.example , https://b.example,")
    assert settings.cors_origins == ["https://a.example", "https://b.example"]

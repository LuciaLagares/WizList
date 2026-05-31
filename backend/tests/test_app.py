import os

from app import create_app


def test_home_route_returns_welcome_message(monkeypatch):
    monkeypatch.setenv("DB_USER", "test")
    monkeypatch.setenv("DB_PASSWORD", "test")
    monkeypatch.setenv("DB_HOST", "localhost")
    monkeypatch.setenv("DB_PORT", "3306")
    monkeypatch.setenv("DB_NAME", "test_db")
    monkeypatch.setenv("SQLALCHEMY_DATABASE_URI", "sqlite:///:memory:")

    # Force the app to use an in-memory SQLite database for the test.
    monkeypatch.setenv("DB_USER", "" )
    monkeypatch.setenv("DB_PASSWORD", "" )
    monkeypatch.setenv("DB_HOST", "" )
    monkeypatch.setenv("DB_PORT", "" )
    monkeypatch.setenv("DB_NAME", "" )

    # Monkeypatch create_app to overwrite SQLALCHEMY_DATABASE_URI after creation.
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.test_client() as client:
        response = client.get("/")

    assert response.status_code == 200
    assert response.get_json() == {"message": "Bienvenido a Wizlist"}

from collections.abc import Generator
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlmodel import Session, SQLModel, create_engine

from app.categoria import model as _categoria_model  # noqa: F401
from app.producto import model as _producto_model  # noqa: F401


class Settings(BaseSettings):
    database_url: str

    # Ruta absoluta a Backend/.env: la app arranca igual desde cualquier directorio.
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env", extra="ignore"
    )


settings = Settings()

engine = create_engine(settings.database_url, connect_args={"connect_timeout": 5})


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)

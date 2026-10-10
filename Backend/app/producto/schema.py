import re

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator

PRECIO_REGEX = re.compile(r"^\d+(\.\d{1,2})?$")


def _limpiar_nombre(value: str) -> str:
    value = value.strip()
    if not value:
        raise ValueError("no puede estar vacío")
    return value


def _validar_precio(value: str) -> str:
    value = value.strip()
    if not PRECIO_REGEX.match(value):
        raise ValueError("debe ser numérico, ej. '1500' o '1500.50'")
    return value


class ProductoCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)
    precio_base: str
    imagen_url: list[HttpUrl] = Field(default_factory=list)
    disponible: bool = True

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, value: str) -> str:
        return _limpiar_nombre(value)

    @field_validator("precio_base")
    @classmethod
    def precio_numerico(cls, value: str) -> str:
        return _validar_precio(value)


class ProductoUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)
    precio_base: str | None = None
    imagen_url: list[HttpUrl] | None = None
    disponible: bool | None = None

    @field_validator("nombre", "precio_base", "imagen_url", "disponible", mode="before")
    @classmethod
    def no_nulo(cls, value):
        if value is None:
            raise ValueError("no puede ser null")
        return value

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, value: str) -> str:
        return _limpiar_nombre(value)

    @field_validator("precio_base")
    @classmethod
    def precio_numerico(cls, value: str) -> str:
        return _validar_precio(value)


class ProductoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str | None
    precio_base: str
    imagen_url: list[str]
    disponible: bool

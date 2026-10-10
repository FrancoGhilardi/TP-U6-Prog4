from sqlalchemy import ARRAY, Column, String
from sqlmodel import Field, Relationship, SQLModel

from app.categoria.model import Categoria


class ProductoCategoria(SQLModel, table=True):
    producto_id: int = Field(foreign_key="producto.id", primary_key=True, ondelete="CASCADE")
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True, ondelete="CASCADE")


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)
    precio_base: str
    imagen_url: list[str] = Field(
        default_factory=list, sa_column=Column(ARRAY(String), nullable=False)
    )
    disponible: bool = Field(default=True)

    categorias: list[Categoria] = Relationship(
        link_model=ProductoCategoria,
        sa_relationship_kwargs={"passive_deletes": True},
    )

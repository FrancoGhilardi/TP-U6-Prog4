from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.categoria import service as categoria_service
from app.categoria.model import Categoria
from app.core.ids import es_id_posible
from app.producto.model import Producto, ProductoCategoria
from app.producto.schema import ProductoCreate, ProductoUpdate


def _urls_a_str(datos: dict) -> dict:
    if "imagen_url" in datos:
        datos["imagen_url"] = [str(url) for url in datos["imagen_url"]]
    return datos


def listar(session: Session) -> list[Producto]:
    return list(session.exec(select(Producto).order_by(Producto.id)).all())


def obtener(session: Session, producto_id: int) -> Producto:
    producto = session.get(Producto, producto_id) if es_id_posible(producto_id) else None
    if producto is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    return producto


def crear(session: Session, datos: ProductoCreate) -> Producto:
    producto = Producto(**_urls_a_str(datos.model_dump()))
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def actualizar(session: Session, producto_id: int, datos: ProductoUpdate) -> Producto:
    producto = obtener(session, producto_id)
    for campo, valor in _urls_a_str(datos.model_dump(exclude_unset=True)).items():
        setattr(producto, campo, valor)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def eliminar(session: Session, producto_id: int) -> None:
    producto = obtener(session, producto_id)
    session.delete(producto)
    session.commit()


def listar_categorias(session: Session, producto_id: int) -> list[Categoria]:
    obtener(session, producto_id)
    query = (
        select(Categoria)
        .join(ProductoCategoria, ProductoCategoria.categoria_id == Categoria.id)
        .where(ProductoCategoria.producto_id == producto_id)
        .order_by(Categoria.id)
    )
    return list(session.exec(query).all())


def asociar(session: Session, producto_id: int, categoria_id: int) -> None:
    obtener(session, producto_id)
    categoria_service.obtener(session, categoria_id)
    if session.get(ProductoCategoria, (producto_id, categoria_id)) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "El producto ya tiene esa categoría asociada")
    session.add(ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id))
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "El producto ya tiene esa categoría asociada")


def desasociar(session: Session, producto_id: int, categoria_id: int) -> None:
    relacion = None
    if es_id_posible(producto_id) and es_id_posible(categoria_id):
        relacion = session.get(ProductoCategoria, (producto_id, categoria_id))
    if relacion is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "El producto no tiene esa categoría asociada")
    session.delete(relacion)
    session.commit()

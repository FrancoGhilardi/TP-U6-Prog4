from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, func, select

from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate
from app.core.ids import es_id_posible


def _error_duplicado(nombre: str) -> HTTPException:
    return HTTPException(
        status.HTTP_409_CONFLICT, f"Ya existe una categoría con el nombre '{nombre}'"
    )


def _validar_nombre_unico(session: Session, nombre: str, excluir_id: int | None = None) -> None:
    query = select(Categoria.id).where(func.lower(Categoria.nombre) == nombre.lower())
    if excluir_id is not None:
        query = query.where(Categoria.id != excluir_id)
    if session.exec(query).first() is not None:
        raise _error_duplicado(nombre)


def listar(session: Session) -> list[Categoria]:
    return list(session.exec(select(Categoria).order_by(Categoria.id)).all())


def obtener(session: Session, categoria_id: int) -> Categoria:
    categoria = session.get(Categoria, categoria_id) if es_id_posible(categoria_id) else None
    if categoria is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoría no encontrada")
    return categoria


def crear(session: Session, datos: CategoriaCreate) -> Categoria:
    _validar_nombre_unico(session, datos.nombre)
    categoria = Categoria.model_validate(datos)
    session.add(categoria)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise _error_duplicado(datos.nombre)
    session.refresh(categoria)
    return categoria


def actualizar(session: Session, categoria_id: int, datos: CategoriaUpdate) -> Categoria:
    categoria = obtener(session, categoria_id)
    _validar_nombre_unico(session, datos.nombre, excluir_id=categoria_id)
    categoria.nombre = datos.nombre
    categoria.descripcion = datos.descripcion
    session.add(categoria)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise _error_duplicado(datos.nombre)
    session.refresh(categoria)
    return categoria


def eliminar(session: Session, categoria_id: int) -> None:
    categoria = obtener(session, categoria_id)
    session.delete(categoria)
    session.commit()

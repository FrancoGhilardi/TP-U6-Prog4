from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session

from app.categoria import service
from app.categoria.schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.core.database import get_session

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(session: Session = Depends(get_session)):
    return service.listar(session)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, session: Session = Depends(get_session)):
    return service.obtener(session, categoria_id)


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(datos: CategoriaCreate, session: Session = Depends(get_session)):
    return service.crear(session, datos)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int, datos: CategoriaUpdate, session: Session = Depends(get_session)
):
    return service.actualizar(session, categoria_id, datos)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, session: Session = Depends(get_session)):
    service.eliminar(session, categoria_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session

from app.categoria.schema import CategoriaRead
from app.core.database import get_session
from app.producto import service
from app.producto.schema import ProductoCreate, ProductoRead, ProductoUpdate

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("", response_model=list[ProductoRead])
def listar_productos(session: Session = Depends(get_session)):
    return service.listar(session)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    return service.obtener(session, producto_id)


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(datos: ProductoCreate, session: Session = Depends(get_session)):
    return service.crear(session, datos)


@router.patch("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int, datos: ProductoUpdate, session: Session = Depends(get_session)
):
    return service.actualizar(session, producto_id, datos)


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, session: Session = Depends(get_session)):
    service.eliminar(session, producto_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{producto_id}/categorias", response_model=list[CategoriaRead])
def listar_categorias_de_producto(producto_id: int, session: Session = Depends(get_session)):
    return service.listar_categorias(session, producto_id)


@router.post("/{producto_id}/categorias/{categoria_id}", status_code=status.HTTP_201_CREATED)
def asociar_categoria(producto_id: int, categoria_id: int, session: Session = Depends(get_session)):
    service.asociar(session, producto_id, categoria_id)
    return {"producto_id": producto_id, "categoria_id": categoria_id}


@router.delete("/{producto_id}/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def desasociar_categoria(producto_id: int, categoria_id: int, session: Session = Depends(get_session)):
    service.desasociar(session, producto_id, categoria_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

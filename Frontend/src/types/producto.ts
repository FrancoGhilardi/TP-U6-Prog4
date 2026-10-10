export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: string;
  imagen_url: string[];
  disponible: boolean;
}

export interface ProductoCategoria {
  producto_id: number;
  categoria_id: number;
}

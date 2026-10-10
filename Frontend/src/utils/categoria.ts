import type { Categoria, CategoriaFormData } from "../types/categoria";

export const toFormData = (categoria: Categoria): CategoriaFormData => ({
  nombre: categoria.nombre,
  descripcion: categoria.descripcion,
});

export const trimFormData = (datos: CategoriaFormData): CategoriaFormData => ({
  nombre: datos.nombre.trim(),
  descripcion: datos.descripcion.trim(),
});

export const esFormularioCompleto = (datos: CategoriaFormData): boolean =>
  datos.nombre !== "" && datos.descripcion !== "";

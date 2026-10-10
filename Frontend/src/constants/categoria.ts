import type { CategoriaFormData } from "../types/categoria";

// Largos máximos: coinciden con las validaciones del backend (schema.py).
export const NOMBRE_MAX_LENGTH = 100;
export const DESCRIPCION_MAX_LENGTH = 255;

export const EMPTY_FORM: CategoriaFormData = { nombre: "", descripcion: "" };

import { API_URL } from "../config";

export const MESSAGES = {
  appTitle: "CRUD Categorías + Productos",
  cargando: "Cargando...",
  sinCategorias: "No hay categorías",
  formularioIncompleto: "Completá el nombre y la descripción.",
  sinConexion: `No se pudo conectar con el servidor en ${API_URL}.`,
  errorServidor: (status: number) =>
    `El servidor respondió con el error ${status}`,
  cargaFallida: (detalle?: string) =>
    `No se pudieron cargar las categorías${detalle ? ` (${detalle})` : ""}.`,
  eliminarFallido: (nombre: string, detalle: string) =>
    `No se pudo eliminar "${nombre}". ${detalle}`,
  confirmarEliminar: (nombre: string) =>
    `¿Seguro que querés eliminar la categoría "${nombre}"? Esta acción no se puede deshacer.`,
} as const;

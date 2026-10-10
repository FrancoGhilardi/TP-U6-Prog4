import { API_URL } from "../config";
import { MESSAGES } from "../constants/messages";
import type { Categoria, CategoriaFormData } from "../types/categoria";

const ENDPOINT = `${API_URL}/categorias`;

// status 0 = no hubo respuesta del servidor (backend apagado, red caída, etc.).
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const mensajeDeError = (err: unknown): string =>
  err instanceof Error ? err.message : MESSAGES.sinConexion;

// FastAPI responde `detail` como texto (409/404) o como lista de errores de validación (422).
const leerDetalle = async (res: Response): Promise<string> => {
  try {
    const body = (await res.json()) as {
      detail?: string | { loc: (string | number)[]; msg: string }[];
    };
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail
        .map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
        .join(". ");
    }
  } catch {
    // el cuerpo no era JSON: se usa el mensaje genérico
  }
  return MESSAGES.errorServidor(res.status);
};

const request = async (url: string, init?: RequestInit): Promise<Response> => {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new ApiError(MESSAGES.sinConexion, 0);
  }
  if (!res.ok) throw new ApiError(await leerDetalle(res), res.status);
  return res;
};

const jsonInit = (
  method: "POST" | "PUT",
  datos: CategoriaFormData,
): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datos),
});

export const getCategorias = async (): Promise<Categoria[]> =>
  (await request(ENDPOINT)).json() as Promise<Categoria[]>;

export const createCategoria = async (
  datos: CategoriaFormData,
): Promise<Categoria> =>
  (
    await request(ENDPOINT, jsonInit("POST", datos))
  ).json() as Promise<Categoria>;

export const updateCategoria = async (
  id: number,
  datos: CategoriaFormData,
): Promise<Categoria> =>
  (
    await request(`${ENDPOINT}/${id}`, jsonInit("PUT", datos))
  ).json() as Promise<Categoria>;

export const deleteCategoria = async (id: number): Promise<void> => {
  await request(`${ENDPOINT}/${id}`, { method: "DELETE" });
};

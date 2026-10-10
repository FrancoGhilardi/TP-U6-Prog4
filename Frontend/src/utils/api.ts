import { MESSAGES } from "../constants/messages";

// FastAPI responde `detail` como texto (409/404) o como lista de errores de validación (422).
export const leerDetalle = async (res: Response): Promise<string> => {
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

// Opciones de `fetch` para enviar `body` como JSON.
export const jsonRequest = (
  method: "POST" | "PUT",
  body: unknown,
): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

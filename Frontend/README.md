# CRUD Categorías — Frontend

Aplicación **React + TypeScript** (Vite) con **Tailwind CSS v4** para gestionar categorías: listar, crear, editar y eliminar. Consume la API FastAPI del backend con `fetch` nativo.

## Requisitos

- **Node.js 20.19 o superior** (o 22.12+)
- **pnpm** (`npm install -g pnpm`)
- El **backend** corriendo en `http://localhost:8000` (ver el `README.md` del backend)

## Puesta en marcha

Desde esta carpeta (`frontend/`):

```bash
pnpm install
pnpm dev
```

La app queda en <http://localhost:5173>. El puerto está fijado (`strictPort`) porque es el único origen que el backend permite por CORS: si está ocupado, `pnpm dev` falla en vez de usar otro puerto.

### URL de la API (opcional)

Por defecto la app llama a `http://localhost:8000`. Para cambiarla, copiá `.env.example` a `.env` y editá la variable:

```
VITE_API_URL=http://localhost:8000
```

## Comandos

| Comando      | Qué hace                                             |
| ------------ | ---------------------------------------------------- |
| `pnpm dev`   | Servidor de desarrollo en el puerto 5173             |
| `pnpm build` | Verifica los tipos de TypeScript y genera `dist/`    |
| `pnpm lint`  | Revisa el código con Oxlint                          |

## Estructura

```
src/
├── App.tsx              # Estado (useState/useEffect) y handlers con fetch: handleCreate, handleUpdate, handleDelete
├── main.tsx
├── config.ts            # URL de la API
├── types/               # Interfaces: Categoria, Producto, ProductoCategoria
├── components/          # Componentes puros (sin hooks): Navbar, CategoriaList, CategoriaCard,
│                        #   CategoriaModal, ConfirmModal y piezas compartidas (Button, ModalShell, FormField, ErrorBanner)
├── constants/           # Textos y límites de los campos
└── utils/               # Funciones auxiliares sin estado
```

## Decisiones de diseño

- **Hooks solo en `App.tsx`:** `useState` y `useEffect` viven ahí. El resto de los componentes son funciones puras que reciben todo por props.
- **Modal controlado:** `CategoriaModal` se abre y cierra con un estado booleano de `App.tsx` y llama a `onSubmit` al guardar. Sirve para crear y para editar.
- **Confirmación de borrado:** `ConfirmModal` pide confirmar antes de eliminar.
- **Errores:** si el backend no responde se muestra un aviso en pantalla; los errores al guardar (por ejemplo, un nombre de categoría repetido) se muestran dentro del modal.

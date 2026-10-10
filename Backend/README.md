# API Productos — Backend

API REST en **FastAPI** para gestionar **categorías** y **productos** (con la relación muchos a muchos entre ambos). Persiste en **PostgreSQL**, que corre en Docker.

**Stack:** FastAPI · SQLModel · psycopg 3 · Pydantic v2 · PostgreSQL 16.

## Requisitos

- **Python 3.11 o superior**
- **Docker Desktop** abierto y con el motor corriendo (*Engine running*)
- **VS Code** con la extensión **REST Client** (`humao.rest-client`), solo si vas a usar `api.http`

## Puesta en marcha

Todos los comandos se ejecutan desde esta carpeta (`Backend/`).

### 1. Variables de entorno

Copiá el archivo de ejemplo:

```powershell
copy .env.example .env      # Linux/macOS: cp .env.example .env
```

El `.env` no se sube a git. Para desarrollo local sirve tal cual viene:

```
POSTGRES_USER=tp_user
POSTGRES_PASSWORD=tp_pass
POSTGRES_DB=tp_productos
DATABASE_URL=postgresql+psycopg://tp_user:tp_pass@localhost:5433/tp_productos
```

### 2. Base de datos (Docker)

```powershell
docker compose up -d
docker compose ps           # el servicio "db" tiene que figurar como "healthy"
```

PostgreSQL queda publicado en el puerto **5433** del equipo (el 5432 interno del contenedor), para no chocar con un Postgres local instalado. Los datos se guardan en el volumen `pgdata` y sobreviven a `docker compose stop` y a `docker compose down`.

Otros comandos útiles:

```powershell
docker compose logs -f db                                   # ver logs (Ctrl+C para salir)
docker compose exec db psql -U tp_user -d tp_productos      # consola SQL
docker compose stop                                         # apagar sin borrar datos
docker compose down -v                                      # ⚠ borra también el volumen: se pierden TODOS los datos
```

### 3. Entorno virtual y dependencias

```powershell
python -m venv .venv
.venv\Scripts\activate      # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
```

### 4. Ejecutar la API

```powershell
fastapi dev app/main.py
```

- API: <http://localhost:8000>
- Documentación interactiva (Swagger): <http://localhost:8000/docs>

Las tablas se crean solas al iniciar la app. Si la base de datos no está levantada, la app falla al arrancar con un error de conexión (tarda unos 5 segundos en rendirse).

## Endpoints

| Método | Ruta | Descripción | Respuestas |
|--------|------|-------------|------------|
| GET | `/categorias` | Listar categorías | 200 |
| GET | `/categorias/{id}` | Obtener una categoría | 200 · 404 |
| POST | `/categorias` | Crear categoría | 201 · 409 · 422 |
| PUT | `/categorias/{id}` | Reemplazar una categoría | 200 · 404 · 409 · 422 |
| DELETE | `/categorias/{id}` | Eliminar categoría (borra sus relaciones) | 204 · 404 |
| GET | `/productos` | Listar productos | 200 |
| GET | `/productos/{id}` | Obtener un producto | 200 · 404 |
| POST | `/productos` | Crear producto | 201 · 422 |
| PATCH | `/productos/{id}` | Modificar campos de un producto | 200 · 404 · 422 |
| DELETE | `/productos/{id}` | Eliminar producto (borra sus relaciones) | 204 · 404 |
| GET | `/productos/{id}/categorias` | Categorías de un producto | 200 · 404 |
| POST | `/productos/{id}/categorias/{categoria_id}` | Asociar producto y categoría | 201 · 404 · 409 |
| DELETE | `/productos/{id}/categorias/{categoria_id}` | Quitar la asociación | 204 · 404 |

**Modelos**

- **Categoría:** `nombre` (1–100, único sin distinguir mayúsculas) y `descripcion` (1–255).
- **Producto:** `nombre` (1–100), `descripcion` (opcional, hasta 255), `precio_base`, `imagen_url` (lista de URLs válidas) y `disponible` (por defecto `true`).

## Probar la API con `api.http`

1. Abrí `api.http` en VS Code (con la extensión REST Client instalada).
2. Con la API en marcha y la base vacía, hacé clic en **Send Request** sobre cada request, de arriba hacia abajo.
3. Cada request indica el código esperado en el comentario `# Esperado: NNN`.

Los ids se toman de las respuestas anteriores, y el archivo termina borrando todo lo que creó, así que se puede ejecutar de nuevo. Los únicos ids fijos (`999999`) están a propósito para provocar los 404.

## Decisiones de diseño

- **`precio_base` es `str`:** el enunciado lo define así y se respeta. Para no aceptar cualquier texto, se valida que sea numérico: `"1500"` o `"1500.50"` (hasta 2 decimales).
- **CORS en `app/main.py`:** un `APIRouter` no admite middleware, así que no se puede configurar en `categoria/router.py`. Se permiten los orígenes `http://localhost:5173` y `http://127.0.0.1:5173` (el frontend con Vite).
- **Rutas sin barra final:** `/categorias` y `/productos`, para evitar el redirect 307 de FastAPI, que rompe el preflight de CORS.
- **Comando de ejecución:** el enunciado indica `python -m fastapi dev main.py`, pero `main.py` está dentro de `app/`. Por eso es `fastapi dev app/main.py`, ejecutado desde `Backend/`.
- **Borrado en cascada:** al borrar una categoría o un producto se eliminan sus filas en `productocategoria` (lo hace la base con `ON DELETE CASCADE`). El otro lado de la relación no se borra.

## Estructura

```
Backend/
├── app/
│   ├── main.py            # app FastAPI, CORS, lifespan, routers
│   ├── core/database.py   # configuración (.env), engine y sesión
│   ├── categoria/         # model · schema · service · router
│   └── producto/          # model · schema · service · router (incluye la relación con categorías)
├── api.http               # requests de prueba (REST Client)
├── docker-compose.yml     # PostgreSQL
├── requirements.txt
└── .env.example
```

## Solución de problemas

- **`error during connect` al usar `docker compose`:** Docker Desktop no está abierto. Abrilo y esperá a *Engine running*.
- **La app falla al iniciar con `connection timeout expired`:** la base no está levantada. Corré `docker compose up -d`.
- **`address already in use` al iniciar la API:** otro proceso usa el puerto 8000. Cerralo o usá `fastapi dev app/main.py --port 8001`.

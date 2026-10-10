import { useEffect, useState } from "react";
import Button from "./components/Button";
import CategoriaList from "./components/CategoriaList";
import CategoriaModal from "./components/CategoriaModal";
import ConfirmModal from "./components/ConfirmModal";
import ErrorBanner from "./components/ErrorBanner";
import Navbar from "./components/Navbar";
import { CATEGORIAS_URL } from "./config";
import { EMPTY_FORM } from "./constants/categoria";
import { MESSAGES } from "./constants/messages";
import type { Categoria, CategoriaFormData } from "./types/categoria";
import { jsonRequest, leerDetalle } from "./utils/api";
import {
  esFormularioCompleto,
  toFormData,
  trimFormData,
} from "./utils/categoria";

const App = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null,
  );
  const [formData, setFormData] = useState<CategoriaFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    // Evita actualizar el estado con la respuesta de un efecto ya limpiado (StrictMode monta dos veces en dev).
    let ignore = false;

    const fetchCategorias = async (): Promise<void> => {
      try {
        const res = await fetch(CATEGORIAS_URL);
        if (!res.ok) {
          const detalle = await leerDetalle(res);
          if (!ignore) setError(MESSAGES.cargaFallida(detalle));
          return;
        }
        const data = (await res.json()) as Categoria[];
        if (ignore) return;
        setCategorias(data);
        setError(null);
      } catch {
        if (!ignore) setError(MESSAGES.cargaFallida());
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchCategorias();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreate = (): void => {
    setDeleteError(null);
    setSelectedCategoria(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = (categoria: Categoria): void => {
    setDeleteError(null);
    setSelectedCategoria(categoria);
    setFormData(toFormData(categoria));
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setFormError(null);
  };

  const handleFormChange = (
    field: keyof CategoriaFormData,
    value: string,
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Devuelve los datos listos para enviar, o null si falta algún campo (el error ya queda en formError).
  const validarFormulario = (): CategoriaFormData | null => {
    const datos = trimFormData(formData);
    if (!esFormularioCompleto(datos)) {
      setFormError(MESSAGES.formularioIncompleto);
      return null;
    }
    return datos;
  };

  const handleCreate = async (): Promise<void> => {
    const datos = validarFormulario();
    if (!datos) return;

    setIsSaving(true);
    setFormError(null);
    try {
      const res = await fetch(CATEGORIAS_URL, jsonRequest("POST", datos));
      if (!res.ok) {
        setFormError(await leerDetalle(res));
        return;
      }
      const creada = (await res.json()) as Categoria;
      setCategorias((prev) => [...prev, creada]);
      closeModal();
    } catch {
      setFormError(MESSAGES.sinConexion);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (): Promise<void> => {
    if (!selectedCategoria) return;
    const datos = validarFormulario();
    if (!datos) return;

    setIsSaving(true);
    setFormError(null);
    try {
      const res = await fetch(
        `${CATEGORIAS_URL}/${selectedCategoria.id}`,
        jsonRequest("PUT", datos),
      );
      if (!res.ok) {
        setFormError(await leerDetalle(res));
        return;
      }
      const actualizada = (await res.json()) as Categoria;
      setCategorias((prev) =>
        prev.map((c) => (c.id === actualizada.id ? actualizada : c)),
      );
      closeModal();
    } catch {
      setFormError(MESSAGES.sinConexion);
    } finally {
      setIsSaving(false);
    }
  };

  const openDelete = (categoria: Categoria): void => {
    setDeleteError(null);
    setCategoriaToDelete(categoria);
  };

  const closeDelete = (): void => setCategoriaToDelete(null);

  const handleDelete = async (): Promise<void> => {
    if (!categoriaToDelete) return;
    const { id, nombre } = categoriaToDelete;

    setIsDeleting(true);
    try {
      const res = await fetch(`${CATEGORIAS_URL}/${id}`, { method: "DELETE" });
      // 404: ya no existe en el servidor, así que también se saca de la lista.
      if (res.ok || res.status === 404) {
        setCategorias((prev) => prev.filter((c) => c.id !== id));
      } else {
        setDeleteError(
          MESSAGES.eliminarFallido(nombre, await leerDetalle(res)),
        );
      }
    } catch {
      setDeleteError(MESSAGES.eliminarFallido(nombre, MESSAGES.sinConexion));
    } finally {
      setIsDeleting(false);
      closeDelete();
    }
  };

  const handleSubmit = (): Promise<void> =>
    selectedCategoria ? handleUpdate() : handleCreate();

  const bannerError = error ?? deleteError;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title={MESSAGES.appTitle} />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <Button onClick={openCreate}>+ Añadir Categoría</Button>
        </div>
        {bannerError && <ErrorBanner message={bannerError} className="mb-6" />}
        {isLoading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {MESSAGES.cargando}
          </p>
        ) : (
          !error && (
            <CategoriaList
              categorias={categorias}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )
        )}
      </main>
      <ConfirmModal
        isOpen={categoriaToDelete !== null}
        title="Eliminar categoría"
        message={MESSAGES.confirmarEliminar(categoriaToDelete?.nombre ?? "")}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
      <CategoriaModal
        isOpen={isModalOpen}
        mode={selectedCategoria ? "edit" : "create"}
        formData={formData}
        error={formError}
        isSaving={isSaving}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onCancel={closeModal}
      />
    </div>
  );
};

export default App;

import { useEffect, useState } from "react";
import Button from "./components/Button";
import CategoriaList from "./components/CategoriaList";
import CategoriaModal from "./components/CategoriaModal";
import ConfirmModal from "./components/ConfirmModal";
import ErrorBanner from "./components/ErrorBanner";
import Navbar from "./components/Navbar";
import { EMPTY_FORM } from "./constants/categoria";
import { MESSAGES } from "./constants/messages";
import {
  ApiError,
  createCategoria,
  deleteCategoria,
  getCategorias,
  mensajeDeError,
  updateCategoria,
} from "./services/categoriaService";
import type { Categoria, CategoriaFormData } from "./types/categoria";
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
        const data = await getCategorias();
        if (ignore) return;
        setCategorias(data);
        setError(null);
      } catch (err) {
        if (ignore) return;
        const detalle =
          err instanceof ApiError && err.status !== 0 ? err.message : undefined;
        setError(MESSAGES.cargaFallida(detalle));
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

  // Valida el formulario y lo guarda con `guardar`. Devuelve la categoría guardada, o null si hubo un error (ya mostrado en formError).
  const enviarFormulario = async (
    guardar: (datos: CategoriaFormData) => Promise<Categoria>,
  ): Promise<Categoria | null> => {
    const datos = trimFormData(formData);
    if (!esFormularioCompleto(datos)) {
      setFormError(MESSAGES.formularioIncompleto);
      return null;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      return await guardar(datos);
    } catch (err) {
      setFormError(mensajeDeError(err));
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async (): Promise<void> => {
    const creada = await enviarFormulario(createCategoria);
    if (!creada) return;
    setCategorias((prev) => [...prev, creada]);
    closeModal();
  };

  const handleUpdate = async (): Promise<void> => {
    if (!selectedCategoria) return;
    const actualizada = await enviarFormulario((datos) =>
      updateCategoria(selectedCategoria.id, datos),
    );
    if (!actualizada) return;
    setCategorias((prev) =>
      prev.map((c) => (c.id === actualizada.id ? actualizada : c)),
    );
    closeModal();
  };

  const openDelete = (categoria: Categoria): void => {
    setDeleteError(null);
    setCategoriaToDelete(categoria);
  };

  const closeDelete = (): void => setCategoriaToDelete(null);

  const handleDelete = async (): Promise<void> => {
    if (!categoriaToDelete) return;
    const { id, nombre } = categoriaToDelete;
    const quitarDeLaLista = () =>
      setCategorias((prev) => prev.filter((c) => c.id !== id));

    setIsDeleting(true);
    try {
      await deleteCategoria(id);
      quitarDeLaLista();
    } catch (err) {
      // 404: ya no existe en el servidor, así que también se saca de la lista.
      if (err instanceof ApiError && err.status === 404) {
        quitarDeLaLista();
      } else {
        setDeleteError(MESSAGES.eliminarFallido(nombre, mensajeDeError(err)));
      }
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

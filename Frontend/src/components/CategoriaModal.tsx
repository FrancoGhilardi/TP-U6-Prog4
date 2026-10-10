import {
  DESCRIPCION_MAX_LENGTH,
  NOMBRE_MAX_LENGTH,
} from "../constants/categoria";
import type { CategoriaFormData } from "../types/categoria";
import Button from "./Button";
import ErrorBanner from "./ErrorBanner";
import FormField from "./FormField";
import ModalShell from "./ModalShell";

interface CategoriaModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formData: CategoriaFormData;
  error: string | null;
  isSaving: boolean;
  onChange: (field: keyof CategoriaFormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoriaModal = ({
  isOpen,
  mode,
  formData,
  error,
  isSaving,
  onChange,
  onSubmit,
  onCancel,
}: CategoriaModalProps) => {
  if (!isOpen) return null;

  const title = mode === "create" ? "Nueva Categoría" : "Editar Categoría";

  return (
    <ModalShell labelledBy="categoria-modal-title" onClose={onCancel}>
      <h2
        id="categoria-modal-title"
        className="mb-4 text-lg font-bold text-gray-900"
      >
        {title}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <FormField
          id="categoria-nombre"
          label="Nombre de la categoría"
          value={formData.nombre}
          maxLength={NOMBRE_MAX_LENGTH}
          autoFocus
          onChange={(value) => onChange("nombre", value)}
        />
        <FormField
          id="categoria-descripcion"
          label="Descripción"
          value={formData.descripcion}
          maxLength={DESCRIPCION_MAX_LENGTH}
          onChange={(value) => onChange("descripcion", value)}
        />
        {error && <ErrorBanner message={error} className="mb-4" />}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
};

export default CategoriaModal;

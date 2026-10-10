import Button from "./Button";
import ModalShell from "./ModalShell";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalShell
      role="alertdialog"
      labelledBy="confirm-modal-title"
      describedBy="confirm-modal-message"
      onClose={onCancel}
    >
      <h2
        id="confirm-modal-title"
        className="mb-2 text-lg font-bold text-gray-900"
      >
        {title}
      </h2>
      <p id="confirm-modal-message" className="mb-6 text-sm text-gray-600">
        {message}
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" autoFocus onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" disabled={isLoading} onClick={onConfirm}>
          {isLoading ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>
    </ModalShell>
  );
};

export default ConfirmModal;

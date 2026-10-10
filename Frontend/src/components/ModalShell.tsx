import type { ReactNode } from "react";

interface ModalShellProps {
  role?: "dialog" | "alertdialog";
  labelledBy: string;
  describedBy?: string;
  onClose: () => void;
  children: ReactNode;
}

// Overlay oscuro + panel centrado. Se cierra con clic en el fondo o con Escape.
const ModalShell = ({
  role = "dialog",
  labelledBy,
  describedBy,
  onClose,
  children,
}: ModalShellProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalShell;

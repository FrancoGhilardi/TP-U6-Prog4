import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "link" | "linkDanger";

interface ButtonProps {
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  autoFocus?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400",
  danger:
    "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  link: "text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500",
  linkDanger:
    "text-sm font-medium text-red-600 hover:text-red-800 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500",
};

const Button = ({
  variant = "primary",
  type = "button",
  disabled,
  autoFocus,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      autoFocus={autoFocus}
      onClick={onClick}
      className={VARIANT_CLASSES[variant]}
    >
      {children}
    </button>
  );
};

export default Button;

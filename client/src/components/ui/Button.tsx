import React from "react";
import { Link } from "react-router-dom";
import type { ButtonProps } from "../../utils/types/types";

// Ajout de disabled dans l'interface si nécessaire ou utilisation directe
interface ExtendedButtonProps extends ButtonProps {
    disabled?: boolean;
}

const Button: React.FC<ExtendedButtonProps> = ({
  children,
  onClick,
  to,
  variant = "primary",
  isActive = false,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseStyles = "inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white",
    ghost: `text-gray-600 hover:bg-red-50 hover:text-red-600 ${isActive ? "bg-red-50 text-red-600 border-r-4 border-red-600 rounded-r-none" : ""}`,
  };

  const selectedVariant = variants[variant] || variants.primary;
  const finalClass = `${baseStyles} ${selectedVariant} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={finalClass}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={finalClass}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
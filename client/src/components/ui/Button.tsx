import { Link } from "react-router-dom";
import type { ButtonProps } from "../../utils/types/types";

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  to,
  variant = "primary",
  isActive = false,
  className = "",
  type = "button",
}) => {
  const baseStyles = "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform active:scale-95";
  const variants: Record<string, string> =
  {
    primary: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5",
    danger: "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors",
    ghost: `text-gray-600 hover:bg-red-50 hover:text-red-600 hover:pl-6 ${isActive ? "bg-red-50 text-red-600 shadow-sm border-r-4 border-red-600" : ""}`,
  };
  const selectedVariant = variants[variant] || variants.primary;
  const finalClass = `${baseStyles} ${selectedVariant} ${className}`;

  if (to) {
    return (
      <Link to = {to} className = {finalClass}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type = {type}
      onClick = {onClick}
      className = {finalClass}
    >
      {children}
    </button>
  );
};

export default Button;
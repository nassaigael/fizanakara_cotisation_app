import React, { memo } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "px-6 py-4 rounded-2xl font-black uppercase tracking-wide text-sm " +
    "border-2 border-b-4 transition active:translate-y-[1px] " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary:
      "bg-brand-primary text-white border-brand-primary hover:opacity-90",
    secondary:
      "bg-white dark:bg-brand-border-dark text-brand-text border-brand-border hover:bg-brand-primary/10",
    danger:
      "bg-brand-primary text-white border-brand-primary hover:opacity-90",
    warning:
      "bg-orange-500 text-white border-orange-500 hover:opacity-90",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default memo(Button);

import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  leftIcon,
  rightIcon,
  to,
  disabled,
  ...props
}) => {
  
  const baseStyles = "relative flex items-center justify-center gap-3 px-6 py-3 rounded-2xl font-black text-[11px] tracking-widest uppercase transition-all duration-100 select-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-primary text-white border-b-4 border-brand-primary-dark hover:brightness-110 active:border-b-0 active:translate-y-1",
    secondary: "bg-white text-brand-text border-2 border-b-4 border-brand-border hover:bg-brand-bg active:border-b-2 active:translate-y-0.5",
    ghost: "text-brand-muted hover:text-brand-primary border-none bg-transparent active:scale-95",
    danger: "bg-red-600 text-white border-b-4 border-red-800 hover:bg-red-700 active:border-b-0 active:translate-y-1",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5 active:translate-y-0.5"
  };

  const content = (
    <>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};

export default memo(Button);
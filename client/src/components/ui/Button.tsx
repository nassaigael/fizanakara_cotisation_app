import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { ButtonProps } from '../../utils/types/components/Button.types';
import { THEME } from '../../styles/theme';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  to,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon
}) => {
  
  const baseStyles = `relative flex items-center justify-center gap-3 px-6 py-3 rounded-2xl ${THEME.font.black} text-[11px] transition-all duration-100 select-none disabled:opacity-50 disabled:cursor-not-allowed`;
  
  const variants = {
    primary: "bg-brand-primary text-white border-b-4 border-brand-primary-dark hover:brightness-110 active:border-b-0 active:translate-y-1",
    secondary: "bg-white text-brand-muted border-2 border-b-4 border-brand-border hover:bg-brand-bg active:border-b-2 active:translate-y-0.5",
    ghost: "text-brand-muted hover:text-brand-primary border-none bg-transparent active:scale-95",
    danger: "bg-red-500 text-white border-b-4 border-red-700 hover:bg-red-600 active:border-b-0 active:translate-y-1",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5"
  };

  const content = (
    <>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
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
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  );
};

export default memo(Button);